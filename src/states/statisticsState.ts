import { StatDataGameType, StatDataOptionalType, StatDataType, StatisticService } from '../services/StatisticsService';
import { logInData, refreshUserToken } from './logInData';
// для реализации статистики нужны данные. мне нужно их получать из функционала, который реализуют другие разработчики )

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

export class Statistics {
  private key: string;
  //key 'challenge' | 'sprint' | 'learned'
  //если ключ 'challenge' | 'sprint' - передаем как второй парамет объект типа StatDataGameType

  private statisticService: StatisticService;

  private data: StatDataGameType | number;

  constructor(key: string, data: StatDataGameType | number) {
    this.key = key;
    this.data = data;
    this.statisticService = new StatisticService();
  }

  private async getUserStat(): Promise<StatDataType | undefined> {
    const response: Response = await this.statisticService.getStatistics(logInData.userId!, logInData.token!);
    if (response.status === 200) {
      const result: StatDataType = await response.json();
      delete result.id;
      return result;
      //todo может response.status 403???
    } else if (response.status === 401) {
      console.log('401');
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
      throw new Error('Bed reqest');
    }
  }

  public refreshUserStat(dataFromBack: StatDataType, currentDate: string): StatDataType {
    const backDataObj: StatDataOptionalType = dataFromBack.optional[currentDate];
    if (this.key === 'learned' && typeof this.data === 'number') {
      backDataObj.learned += this.data;
    } else if ((this.key === 'sprint' || this.key === 'challenge') && typeof this.data !== 'number') {
      console.log(this.key);
      backDataObj[this.key].newWords += this.data.newWords;
      backDataObj[this.key].questions += this.data.questions;
      backDataObj[this.key].rightAnsw += this.data.rightAnsw;
      if (backDataObj[this.key].session < this.data.session) {
        backDataObj[this.key].session = this.data.session;
      }
    }
    return dataFromBack;
  }

  private createNewStatPerDay(dataFromBack: StatDataType, currentDate: string): StatDataType {
    const newData = Object.assign({}, statData);
    dataFromBack.optional[currentDate] = newData;
    return dataFromBack;
  }

  private getEarlyStatPerDay(datesArr: string[]): string | undefined {
    const savedDatesNumbers = datesArr.map((el) => Number(el.split(':').join('')));
    const earlyNumber = Math.min.apply(0, savedDatesNumbers);
    const earlyNumberIndex = savedDatesNumbers.findIndex((el) => el === earlyNumber);
    if (datesArr[earlyNumberIndex]) {
      return datesArr[earlyNumberIndex];
    }
  }

  static async updateStat(key: string, data: StatDataGameType | number) {
    const statState = new Statistics(key, data);
    const dataFromBack: StatDataType | undefined = await statState.getUserStat();
    if (dataFromBack) {
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
        updatedData = statState.refreshUserStat(dataFromBack, currentDate);
      } else {
        // сохранить новые данные за день
        const newData: StatDataType = statState.createNewStatPerDay(dataFromBack, currentDate);
        updatedData = statState.refreshUserStat(newData, currentDate);
      }
      await statState.statisticService.upsertStatistics(logInData.userId!, logInData.token!, updatedData);
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
