import { Component } from '../../../core/templates/components';
import { StatisticsContainer } from '../statisticsContainer';
import { StatisticsCard } from './statisticsCard';
import './shortTermStatistics.scss';

const titlesObj = {
  words: 'Статистика по словам',
  sprint: 'Статистика по игре "Cпринт"',
  challenge: 'Статистика по игре "Аудиовызов"',
};

const textObjCards = {
  words: ['Количество новых слов за день', 'Количество изученных слов за день', '% правильных ответов'],
  game: ['Количество новых слов', '% правильных ответов', 'Самая длинная серия'],
};

export class ShortTermStatistics extends Component {
  constructor() {
    super('div', ['shortStat']);
  }

  private getWordsCard(value: string, index: number): HTMLElement {
    const card = new StatisticsCard(value).render();
    const cardContent = card.querySelector('.statCard__content') as HTMLElement;
    console.log(cardContent);
    switch (index) {
      case 0:
        card.classList.add('wordsStat--new');
        //todo вставить значение для контента
        break;
      case 1:
        card.classList.add('wordsStat--learned');
        break;
      case 2:
        card.classList.add('wordsStat--percent');
    }
    return card;
  }

  private getWordsCards(): HTMLElement {
    const statOfWordsContainer = new StatisticsContainer(titlesObj.words).render();
    const wrapper = statOfWordsContainer.querySelector('.statContainer__wrapper') as HTMLElement;
    textObjCards.words.forEach((value, index) => {
      const card = this.getWordsCard(value, index);
      wrapper.append(card);
    });
    return statOfWordsContainer;
  }

  private getGameCard(value: string, index: number, title: string) {
    const card = new StatisticsCard(value).render();
    // const cardContent = card.querySelector('.statCard__content') as HTMLElement;
    console.log(title);
    switch (index) {
      case 0:
        //todo вставить textcontent
        //title = 'sprint' ? cardContent.textContent = ... : cardContent.textContent = ...
        card.classList.add('gameStat--new');
        break;
      case 1:
        card.classList.add('gameStat--percent');
        break;
      case 2:
        card.classList.add('gameStat--session');
    }
    return card;
  }

  private getGameCards(title: string) {
    let containerTitle = '';
    title === 'sprint' ? (containerTitle = titlesObj.sprint) : (containerTitle = titlesObj.challenge);
    const statOfGameContainer = new StatisticsContainer(containerTitle).render();
    const wrapper = statOfGameContainer.querySelector('.statContainer__wrapper') as HTMLElement;
    textObjCards.game.forEach((value, index) => {
      const card = this.getGameCard(value, index, title);
      wrapper.append(card);
    });
    return statOfGameContainer;
  }

  private getContainers() {
    const statOfWordsContainer = this.getWordsCards();
    this.container.append(statOfWordsContainer);
    const statOfSprintContainer = this.getGameCards('sprint');
    this.container.append(statOfSprintContainer);
    const statOfChallengeContainer = this.getGameCards('challenge');
    this.container.append(statOfChallengeContainer);
  }

  public render() {
    this.getContainers();
    return this.container;
  }
}
