'use strict';
import { Component } from '../../../core/templates/components';
import { StatisticsContainer } from '../statisticsContainer';
import '../shortLongTermStatistics.scss';
import { StatDataOptionalType } from '../../../services/StatisticsService';
import Chart from 'chart.js/auto';

const titlesObj = {
  new: 'Количество новых слов по дням',
  learned: 'Количество изученных слов по дням',
};

const stylesObj = {
  backgroundColor: '#e84545',
  backgroundColorTooltip: '#6c7279',
  borderColor: '#fff',
  fontFamily: 'neucha',
  fontSize: 16,
  fontColor: 'rgba(255, 255, 255, 0.75)',
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

  private getMonth(num: string): string {
    return Number(num) + 1 < 10 ? `0${Number(num) + 1}` : `${Number(num) + 1}`;
  }

  private getLabels(): string[] {
    const labels: string[] = [];
    Object.keys(this.statData).forEach((el) => {
      const rowDate = el.split(':');
      const date = `${rowDate[rowDate.length - 1]}:${this.getMonth(rowDate[rowDate.length - 2])}:${rowDate[rowDate.length - 3]}`;
      labels.push(date);
    });
    return labels;
  }

  private getDataNewWords(): number[] {
    const data: number[] = [];
    Object.values(this.statData).forEach((el) => {
      const newWordsAmount = el.challenge.newWords + el.sprint.newWords;
      data.push(newWordsAmount);
    });
    return data;
  }

  private getDataLearnedWords(): number[] {
    const data: number[] = [];
    Object.values(this.statData).forEach((el) => {
      const learnedWordsAmount = el.learned;
      data.push(learnedWordsAmount);
    });
    return data;
  }

  private getContainer(key: string): HTMLCanvasElement {
    const container = document.createElement('canvas') as HTMLCanvasElement;
    // container.getContext('2d');
    container.classList.add('longStat__shart-container');
    const labels = this.getLabels();
    let shartData: number[];
    key === 'new' ? (shartData = this.getDataNewWords()) : (shartData = this.getDataLearnedWords());
    const data = {
      labels: labels,
      datasets: [
        {
          label: `${key === 'learned' ? titlesObj.learned : titlesObj.new}`,
          backgroundColor: `${stylesObj.backgroundColor}`,
          borderColor: `${stylesObj.borderColor}`,
          data: shartData, //здесь значения для отрисовки
        },
      ],
    };
    Chart.defaults.font.family = stylesObj.fontFamily;
    Chart.defaults.font.size = stylesObj.fontSize;
    Chart.defaults.color = stylesObj.fontColor;
    Chart.defaults.plugins.legend.display = false;
    Chart.defaults.plugins.legend.labels.color = stylesObj.fontColor;
    Chart.defaults.plugins.tooltip.backgroundColor = stylesObj.backgroundColorTooltip;
    Chart.defaults.elements.point.hoverRadius = 7;
    Chart.defaults.elements.point.radius = 5;
    const lineChart = new Chart(container, {
      type: 'line',
      data: data,
      options: {},
    });
    return container;
  }

  private getContainers() {
    const statOfNewWordsContainer = new StatisticsContainer(titlesObj.new).render();
    statOfNewWordsContainer.append(this.getContainer('new'));
    this.container.append(statOfNewWordsContainer);
    const statOfLearnedWordsContainer = new StatisticsContainer(titlesObj.learned).render();
    statOfLearnedWordsContainer.append(this.getContainer('learned'));
    this.container.append(statOfLearnedWordsContainer);
  }

  public render() {
    this.getContainers();
    return this.container;
  }
}
