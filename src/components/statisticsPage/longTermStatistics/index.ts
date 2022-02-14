import { Component } from '../../../core/templates/components';
import { StatisticsContainer } from '../statisticsContainer';
import '../shortLongTermStatistics.scss';
import { StatDataOptionalType } from '../../../services/StatisticsService';

const titlesObj = {
  new: 'Количество новых слов по дням',
  learned: 'Количество изученных слов по дням',
};

export class LongTermStatistics extends Component {
  readonly statData: { [prop: string]: StatDataOptionalType };

  constructor(statData: { [prop: string]: StatDataOptionalType }) {
    super('div', ['longStat']);
    this.statData = statData;
  }

  private getErrorMessage(): HTMLElement {
    const errorMessage = document.createElement('div');
    errorMessage.textContent = 'Недостаточно данных для статистики';
    errorMessage.classList.add('longStat__message');
    return errorMessage;
  }

  private getContainers() {
    const statOfNewWordsContainer = new StatisticsContainer(titlesObj.new).render();
    this.container.append(statOfNewWordsContainer);
    const statOfLearnedWordsContainer = new StatisticsContainer(titlesObj.learned).render();
    this.container.append(statOfLearnedWordsContainer);
  }

  public render() {
    this.getContainers();
    return this.container;
  }
}
