import { Component } from '../../../core/templates/components';
import './statisticsContainer.scss';

export class StatisticsContainer extends Component {
  constructor(headerContent: string) {
    super('div', ['statContainer']);
    this.container.innerHTML = `<h3 class = "statContainer__header">${headerContent}</h3><div class="statContainer__wrapper"></div>`;
  }

  render() {
    return this.container;
  }
}
