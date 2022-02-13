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
    } else if (response.status === 401) {
      refreshUserToken();
      await this.getUserStat();
    } else if (response.status === 404) {
      const newUserStat: StatDataType = { learnedWords: 0, optional: {} };
      return newUserStat;
    } else {
      throw new Error('Bed reqest');
    }
  }

  public refreshUserStat(dataFromBack: StatDataType, currentDate: string): StatDataType {
    const backDataObj: StatDataOptionalType = dataFromBack.optional[currentDate];
    console.log(backDataObj);
    if (this.key === 'learned' && typeof this.data === 'number') {
      console.log(this.data);
      backDataObj.learned += this.data;
    } else if ((this.key === 'sprint' || this.key === 'challenge') && typeof this.data !== 'number') {
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
    console.log('newData');
    console.log(newData);
    // todo записать данные в новую дату
    dataFromBack.optional[currentDate] = newData;
    return dataFromBack;
  }

  private getEarlyStatPerDay(datesArr: string[]): string | undefined {
    const savedDatesNumbers = datesArr.map((el) => Number(el.split(':').join('')));
    console.log('savedDatesNumbers');
    console.log(savedDatesNumbers);
    const earlyNumber = Math.min.apply(0, savedDatesNumbers);
    console.log(earlyNumber);
    const earlyNumberIndex = savedDatesNumbers.findIndex((el) => el === earlyNumber);
    if (datesArr[earlyNumberIndex]) {
      return datesArr[earlyNumberIndex];
    }
  }

  static async updateStat(key: string, data: StatDataGameType | number) {
    const statState = new Statistics(key, data);
    const dataFromBack: StatDataType | undefined = await statState.getUserStat();
    if (dataFromBack) {
      console.log('dataFromBack');
      console.log(dataFromBack);
      const currentDate: string = statState.getDate();
      const savedDates: string[] = Object.keys(dataFromBack.optional);
      console.log('savedDates');
      console.log(savedDates);
      // удаляем наиболее ранние данные, если option переполнен
      if (savedDates.length > 8) {
        const deletedDataKey = statState.getEarlyStatPerDay(savedDates);
        console.log('deletedKey');
        console.log(deletedDataKey);
        if (deletedDataKey) {
          delete dataFromBack.optional[deletedDataKey];
        }
      }
      let updatedData: StatDataType;
      if (savedDates.includes(currentDate)) {
        // обновить данные за день
        updatedData = statState.refreshUserStat(dataFromBack, currentDate);
        console.log('updatedData');
        console.log(updatedData);
      } else {
        // сохранить новые данные за день
        const newData: StatDataType = statState.createNewStatPerDay(dataFromBack, currentDate);
        updatedData = statState.refreshUserStat(newData, currentDate);
        console.log('updatedData');
        console.log(updatedData);
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

// новые слова - слова, которые используются в играх первый раз
// изученные: 1) слова, на которые пользователь дал правильные ответы в играх (3 раза подряд - для обычных слов; 5 раз подряд - для сложных слов); 2) слова, которые пользователь пометил как изученные 3) слова, при угадывании которых была допущенна ошибка, удаляются из изученных.
// не придумала, как записать долгосрочную статистику (LongTermStat). т.е количество полей у optinal ограничено и количество знаков в каждом поле - тоже. только есть такая мысль: при переполнении optinal - удалять данные с самой поздней датой???
