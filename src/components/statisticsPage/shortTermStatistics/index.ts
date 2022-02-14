import { Component } from '../../../core/templates/components';
import { StatisticsContainer } from '../statisticsContainer';
import { StatisticsCard } from './statisticsCard';
import './shortTermStatistics.scss';
import { StatDataOptionalType } from '../../../services/StatisticsService';

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
  readonly statData: StatDataOptionalType;

  constructor(statData: StatDataOptionalType) {
    super('div', ['shortStat']);
    this.statData = statData;
  }

  private getNewWordsSumm(): number {
    return this.statData.challenge.newWords + this.statData.sprint.newWords;
  }

  private getRightAnswPercent() {
    const amountQuestions = this.statData.challenge.questions + this.statData.sprint.questions;
    const amountRightAnsw = this.statData.challenge.rightAnsw + this.statData.sprint.rightAnsw;
    return Math.round((amountRightAnsw / amountQuestions) * 100);
  }

  private getWordsCard(value: string, index: number): HTMLElement {
    const card = new StatisticsCard(value).render();
    const cardContent = card.querySelector('.statCard__content') as HTMLElement;
    switch (index) {
      case 0:
        cardContent.textContent = String(this.getNewWordsSumm());
        break;
      case 1:
        cardContent.textContent = String(this.statData.learned);
        break;
      case 2:
        if (!isNaN(this.getRightAnswPercent())) {
          cardContent.textContent = `${this.getRightAnswPercent()}%`;
        } else {
          card.lastChild?.remove();
          const errorMessage = this.getErrorMessage();
          card.append(errorMessage);
        }
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

  private getRightAnswersInGamePercent(game: keyof StatDataOptionalType): number | undefined {
    if (game === 'sprint' || game === 'challenge') {
      return Math.round((this.statData[game].rightAnsw / this.statData[game].questions) * 100);
    }
  }

  private isDataNull(title: string): boolean {
    switch (title) {
      case 'sprint':
        return this.statData.sprint.questions === 0;
      case 'challenge':
        return this.statData.challenge.questions === 0;
      default:
        return true;
    }
  }

  private getErrorMessage(): HTMLElement {
    const errorMessage = document.createElement('div');
    errorMessage.textContent = 'Недостаточно данных для статистики';
    errorMessage.classList.add('shortStat__message');
    return errorMessage;
  }

  private getGameCard(value: string, index: number, title: string) {
    const card = new StatisticsCard(value).render();
    const cardContent = card.querySelector('.statCard__content') as HTMLElement;
    switch (index) {
      case 0:
        card.classList.add('gameStat--new');
        title === 'sprint' ? (cardContent.textContent = `${this.statData.sprint.newWords}`) : (cardContent.textContent = `${this.statData.challenge.newWords}`);
        break;
      case 1:
        card.classList.add('gameStat--percent');
        title === 'sprint'
          ? (cardContent.textContent = `${this.getRightAnswersInGamePercent('sprint')}%`)
          : (cardContent.textContent = `${this.getRightAnswersInGamePercent('challenge')}%`);
        break;
      case 2:
        card.classList.add('gameStat--session');
        title === 'sprint'
          ? (cardContent.textContent = String(this.statData.sprint.session))
          : (cardContent.textContent = String(this.statData.challenge.session));
    }
    return card;
  }

  private getGameCards(title: string) {
    let containerTitle = '';
    title === 'sprint' ? (containerTitle = titlesObj.sprint) : (containerTitle = titlesObj.challenge);
    const statOfGameContainer = new StatisticsContainer(containerTitle).render();
    const wrapper = statOfGameContainer.querySelector('.statContainer__wrapper') as HTMLElement;
    if (this.isDataNull(title)) {
      wrapper.append(this.getErrorMessage());
    } else {
      textObjCards.game.forEach((value, index) => {
        const card = this.getGameCard(value, index, title);
        wrapper.append(card);
      });
    }
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
