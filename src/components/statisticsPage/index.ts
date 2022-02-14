import { Button } from '../../common/button';
import { Page } from '../../core/templates/page';
import { StatDataType, StatisticService } from '../../services/StatisticsService';
import { logInData, refreshUserToken } from '../../states/logInData';
import { ShortTermStatistics } from './shortTermStatistics';
import { Preloader } from '../../common/preloader';
import './statisticsPage.scss';

export class StatisticsPage extends Page {
  private shortTermStatBtn: HTMLElement;

  private longTermStatBtn: HTMLElement;

  private btnsWrapper: HTMLElement;

  static TextObject = {
    MainTitle: 'StatisticsPage',
  };

  constructor(id: string) {
    super(id);
    this.container.classList.add('stat');
    this.shortTermStatBtn = new Button('button', 'Статистика за текущий день', ['stat__btn', 'stat__btn--shortTerm']).rendor();
    this.longTermStatBtn = new Button('button', 'долгострочная статистика', ['stat__btn', 'stat__btn--longTerm']).rendor();
    this.btnsWrapper = document.createElement('div');
    this.btnsWrapper.classList.add('stat__btn-wrapper');

    this.shortTermStatBtn.addEventListener('click', async () => {
      await this.shortTermStatRender();
    });
  }

  private async getStatistics(): Promise<StatDataType | undefined> {
    const statisticService = new StatisticService();
    const response: Response = await statisticService.getStatistics(logInData.userId!, logInData.token!);
    if (response.status === 200) {
      const result: StatDataType = await response.json();
      delete result.id;
      return result;
    } else if (response.status === 401) {
      await refreshUserToken();
      const response2: Response = await statisticService.getStatistics(logInData.userId!, logInData.token!);
      if (response2.status === 200) {
        const result: StatDataType = await response.json();
        delete result.id;
        return result;
      }
    }
  }

  private getDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    return `${year}:${month < 10 ? '0' + month : month}:${day < 10 ? '0' + day : day}`;
  }

  private async getShortTermStat(): Promise<HTMLElement | undefined> {
    const userStat: StatDataType | undefined = await this.getStatistics();
    console.log(userStat);
    const currentDate: keyof StatDataType | string = this.getDate();
    if (userStat) {
      if (userStat.optional[currentDate]) {
        const shortTermStat = new ShortTermStatistics(userStat.optional[currentDate]);
        return shortTermStat.render();
      }
    }
  }

  private getErrorMessage(): HTMLElement {
    const errorMessage = document.createElement('div');
    errorMessage.textContent = 'Недостаточно данных для статистики';
    errorMessage.classList.add('stat__error-message');
    return errorMessage;
  }

  public async shortTermStatRender() {
    Preloader.showPreloader();
    const shortStat = await this.getShortTermStat();
    if (shortStat) {
      this.container.append(shortStat);
      Preloader.hidePreloader();
    } else {
      const errorMessage = this.getErrorMessage();
      Preloader.hidePreloader();
      this.container.append(errorMessage);
    }
  }

  public render() {
    const title = this.createHeaderTitle(StatisticsPage.TextObject.MainTitle);
    title.classList.add('visually-hidden');
    this.container.append(title);
    this.btnsWrapper.append(this.shortTermStatBtn);
    this.btnsWrapper.append(this.longTermStatBtn);
    this.container.append(this.btnsWrapper);
    return this.container;
  }
}
