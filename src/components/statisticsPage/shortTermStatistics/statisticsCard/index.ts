import { Component } from '../../../../core/templates/components';
import './statisticsCard.scss';

export class StatisticsCard extends Component {
  constructor(title: string) {
    super('div', ['statCard']);
    this.container.innerHTML = `<h4 class="statCard__header">${title}</h4><div class="statCard__wrapper"><span class="statCard__content">0</span></div>`;
  }

  public render() {
    return this.container;
  }
}
