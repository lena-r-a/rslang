import { Button } from '../../common/button';
import { Page } from '../../core/templates/page';
import { ShortTermStatistics } from './shortTermStatistics';
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
    this.longTermStatBtn = new Button('button', 'долгострочная статистика', ['stat__btn', 'stat__btn--shortTerm']).rendor();
    this.btnsWrapper = document.createElement('div');
    this.btnsWrapper.classList.add('stat__btn-wrapper');
  }

  public render() {
    const title = this.createHeaderTitle(StatisticsPage.TextObject.MainTitle);
    title.classList.add('visually-hidden');
    this.container.append(title);
    this.btnsWrapper.append(this.shortTermStatBtn);
    this.btnsWrapper.append(this.longTermStatBtn);
    this.container.append(this.btnsWrapper);
    const shortTermStat = new ShortTermStatistics().render();
    this.container.append(shortTermStat);
    return this.container;
  }
}
