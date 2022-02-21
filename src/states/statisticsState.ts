import { ISettings, SettingsService } from '../services/SettingsService';
import { StatDataGameType, StatDataOptionalType, StatDataType, StatisticService } from '../services/StatisticsService';
import { logInData, refreshUserToken } from './logInData';

export const statData: StatDataOptionalType = {
  learned: 0,
  sprint: {
    newWords: 0,
    rightAnsw: 0,
    questions: 0,
    session: 0,
  },
  challenge: {
    newWords: 0,
    rightAnsw: 0,
    questions: 0,
    session: 0,
  },
};

export const statKeys: StatKeysType = {
  challenge: 'challenge',
  sprint: 'sprint',
  learned: 'learned',
};

export type StatKeysType = {
  challenge: string;
  sprint: string;
  learned: string;
};

export type StatDateLearnedType = {
  word: string;
  add: boolean;
};

export class Statistics {
  private key: keyof StatKeysType;

  private statisticService: StatisticService;

  private settingsService: SettingsService;

  private data: StatDataGameType | StatDateLearnedType;

  constructor(key: keyof StatKeysType, data: StatDataGameType | StatDateLearnedType) {
    this.key = key;
    this.data = data;
    this.statisticService = new StatisticService();
    this.settingsService = new SettingsService();
  }

  private async getUserStat(): Promise<StatDataType | undefined> {
    const response: Response = await this.statisticService.getStatistics(logInData.userId!, logInData.token!);
    if (response.status === 200) {
      const result: StatDataType = await response.json();
      delete result.id;
      return result;
    } else if (response.status === 401) {
      await refreshUserToken();
      const response2: Response = await this.statisticService.getStatistics(logInData.userId!, logInData.token!);
      if (response2.status === 200) {
        const result: StatDataType = await response.json();
        delete result.id;
        return result;
      }
    } else if (response.status === 404) {
      const newUserStat: StatDataType = { learnedWords: 0, optional: {} };
      return newUserStat;
    } else {
      throw new Error('Bad request');
    }
  }

  private async getLearnedToday(): Promise<ISettings | undefined> {
    const response: Response = await this.settingsService.getSettings(logInData.userId!, logInData.token!);
    if (response.status === 200) {
      const result: ISettings = await response.json();
      delete result.id;
      return result;
    } else if (response.status === 401) {
      // console.log('401 from Statistics');
      await refreshUserToken();
      const response2: Response = await this.settingsService.getSettings(logInData.userId!, logInData.token!);
      if (response2.status === 200) {
        const result: ISettings = await response.json();
        delete result.id;
        return result;
      }
    } else if (response.status === 404) {
      // если данных на back нет - создаем "чистый объект"
      const newLearned = this.createNewLearnedToday();
      return newLearned;
    } else {
      throw new Error('Bad request');
    }
  }

  public refreshLearnedToday(learnedTodayFromBack: ISettings) {
    const learned: string[] = learnedTodayFromBack.optional.learnedToday.words;
    if ('add' in this.data) {
      if (this.data.add) {
        if (!learned.includes(this.data.word)) {
          learned.push(this.data.word);
        }
      } else if (!this.data.add) {
        const index = learned.indexOf(this.data.word);
        if (index !== -1) {
          learned.splice(index, 1);
        }
      }
    }
  }

  public refreshUserStat(dataFromBack: StatDataType, learnedTodayFromBack: ISettings, currentDate: string): StatDataType {
    const backDataObj: StatDataOptionalType = dataFromBack.optional[currentDate];
    if (this.key === 'learned') {
      backDataObj[this.key] = learnedTodayFromBack.optional.learnedToday.words.length;
    } else if (this.key === 'sprint' || this.key === 'challenge') {
      if ('newWords' in this.data) {
        backDataObj[this.key].newWords += this.data.newWords;
        backDataObj[this.key].questions += this.data.questions;
        backDataObj[this.key].rightAnsw += this.data.rightAnsw;
        if (backDataObj[this.key].session < this.data.session) {
          backDataObj[this.key].session = this.data.session;
        }
      }
    }
    return dataFromBack;
  }

  private createNewStatPerDay(dataFromBack: StatDataType, currentDate: string): StatDataType {
    const newData = Object.assign({}, statData);
    dataFromBack.optional[currentDate] = newData;
    return dataFromBack;
  }

  public createNewLearnedToday(): ISettings {
    const newLearnedToday: ISettings = {
      wordsPerDay: 1,
      optional: {
        learnedToday: {
          words: [],
        },
      },
    };
    return newLearnedToday;
  }

  private clearLearnedFromBack(obj: ISettings) {
    obj.optional.learnedToday.words.length = 0;
  }

  private getEarlyStatPerDay(datesArr: string[]): string | undefined {
    const savedDatesNumbers = datesArr.map((el) => Number(el.split(':').join('')));
    const earlyNumber = Math.min.apply(0, savedDatesNumbers);
    const earlyNumberIndex = savedDatesNumbers.findIndex((el) => el === earlyNumber);
    if (datesArr[earlyNumberIndex]) {
      return datesArr[earlyNumberIndex];
    }
  }

  static async updateStat(key: keyof StatKeysType, data: StatDataGameType | StatDateLearnedType) {
    const statState = new Statistics(key, data);
    const dataFromBack: StatDataType | undefined = await statState.getUserStat();
    const learnedFromBack: ISettings | undefined = await statState.getLearnedToday();
    // получили данные с back
    if (dataFromBack && learnedFromBack) {
      const currentDate: string = statState.getDate();
      const savedDates: string[] = Object.keys(dataFromBack.optional);
      // удаляем наиболее ранние данные, если option переполнен
      if (savedDates.length > 8) {
        const deletedDataKey = statState.getEarlyStatPerDay(savedDates);
        if (deletedDataKey) {
          delete dataFromBack.optional[deletedDataKey];
        }
      }
      let updatedData: StatDataType;
      if (savedDates.includes(currentDate)) {
        // обновить данные за день
        statState.refreshLearnedToday(learnedFromBack);
        updatedData = statState.refreshUserStat(dataFromBack, learnedFromBack, currentDate);
      } else {
        // сохранить новые данные за день
        const newData: StatDataType = statState.createNewStatPerDay(dataFromBack, currentDate);
        statState.clearLearnedFromBack(learnedFromBack);
        statState.refreshLearnedToday(learnedFromBack);
        updatedData = statState.refreshUserStat(newData, learnedFromBack, currentDate);
      }
      await statState.statisticService.upsertStatistics(logInData.userId!, logInData.token!, updatedData);
      await statState.settingsService.upsertSettings(logInData.userId!, logInData.token!, learnedFromBack);
    }
  }

  private getDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    return `${year}:${month < 10 ? '0' + month : month}:${day < 10 ? '0' + day : day}`;
  }
}
