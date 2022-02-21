import { logInData } from './../../../states/logInData';
('use strict');
import { Game } from '../Game';
import getRandomInt from '../../../common/getRandomInt';
import './sprintPage.scss';

export class GameSprintPage extends Game {
  private invervalId: NodeJS.Timer | null = null;

  private gameTime = 60;

  private pointsGrowth = 10;

  private readonly minGrowth = 10;

  private readonly maxGrowth = 80;

  private totalPoints = 0;

  private stackCurrent = 0;

  private readonly maxStackItemsAmount = 3;

  private stackItems: HTMLCollection | null = null;

  private stackDesciprtion: HTMLElement;

  private sprintGameContainer: HTMLElement;

  private item: HTMLElement;

  private itemTranslate: HTMLElement;

  private gameHeading: HTMLElement;

  private score: HTMLElement;

  private usedPages: number[] = [];

  private keyBoardHandler: (e: KeyboardEvent) => void = () => null;

  constructor(id: string, page?: number, group?: number, title = 'GameSprintPage') {
    super(id, title, 'sprint', page, group);
    this.sprintGameContainer = document.createElement('div');
    this.stackDesciprtion = document.createElement('p');
    this.item = document.createElement('p');
    this.itemTranslate = document.createElement('p');
    this.score = document.createElement('div');
    this.gameHeading = document.createElement('div');
    this.gameHeading.classList.add('game__heading');
    this.score.classList.add('game__score');
    this.item.classList.add('game__item');
    this.itemTranslate.classList.add('game__item-translate');
    this.sprintGameContainer.classList.add('game__sprint-container');
    this.container.append(this.gameHeading, this.sprintGameContainer);
    this.sprintGameContainer.addEventListener('DOMNodeRemovedFromDocument', () => {
      this.clear();
    });
  }

  startGame(): void {
    this.renderTimer();
    this.renderStack();
    this.renderScore();
    this.renderItem();
    this.renderControls();
  }

  private renderStack() {
    const CONTAINER = document.createElement('div');
    const STACK_CONTAINER = document.createElement('div');
    STACK_CONTAINER.classList.add('game__stack');
    for (let i = 0; i < this.maxStackItemsAmount; i++) {
      const item = document.createElement('div');
      item.classList.add('game__stack-item');
      STACK_CONTAINER.append(item);
    }
    this.stackItems = STACK_CONTAINER.children;
    CONTAINER.classList.add('game__stack-heading');
    this.stackDesciprtion.classList.add('game__stack-description');
    this.stackDesciprtion.textContent = `${this.pointsGrowth} очков за ответ`;
    CONTAINER.append(STACK_CONTAINER, this.stackDesciprtion);
    this.sprintGameContainer.append(CONTAINER);
  }

  private async renderItem() {
    const CONTAINER = document.createElement('div');
    CONTAINER.append(this.item, this.itemTranslate);
    CONTAINER.classList.add('game__items-container');
    this.sprintGameContainer.append(CONTAINER);
    this.nextItem();
  }

  private renderTimer() {
    const TIMER_CONTAINER = document.createElement('div');
    TIMER_CONTAINER.textContent = String(this.gameTime);
    TIMER_CONTAINER.classList.add('game__timer');
    this.invervalId = setInterval(() => {
      TIMER_CONTAINER.textContent = String(--this.gameTime);
      if (!this.gameTime) {
        this.ResultItems?.push(...this.itemsList!);
        this.clear();
        this.renderResults();
      }
    }, 1000);
    this.gameHeading.append(TIMER_CONTAINER);
  }

  private renderControls() {
    const CONTROLS_CONTAINER = document.createElement('div');
    const RIGHT_BUTTON = this.getButton('Верно');
    const WRONG_BUTTON = this.getButton('Неверно');
    CONTROLS_CONTAINER.classList.add('game__controls');
    CONTROLS_CONTAINER.append(WRONG_BUTTON, RIGHT_BUTTON);
    this.setControlsListeners(CONTROLS_CONTAINER, RIGHT_BUTTON, WRONG_BUTTON);
    this.sprintGameContainer.append(CONTROLS_CONTAINER);
  }

  private getButton(str: string) {
    const BUTTON = document.createElement('button');
    BUTTON.textContent = str;
    BUTTON.classList.add('game__controls-button');
    return BUTTON;
  }

  private setControlsListeners(container: HTMLElement, right_button: HTMLButtonElement, wrong_button: HTMLButtonElement) {
    this.keyBoardHandler = (e: KeyboardEvent) => {
      if (this.currentItem === this.itemsList!.length) return;
      if (e.key === 'ArrowLeft') wrong_button.click();
      if (e.key === 'ArrowRight') right_button.click();
    };
    container.addEventListener('click', async (e) => {
      if (!(e.target instanceof HTMLButtonElement)) return;
      const CORRECT_TRANSLATE = this.itemsList![this.currentItem].wordTranslate;
      const CURRENT_ITEM = this.itemsList![this.currentItem];
      const ID = CURRENT_ITEM.id || CURRENT_ITEM._id;
      let status = true;
      if (e.target === right_button) {
        if (this.itemTranslate.textContent === CORRECT_TRANSLATE) this.correctAnswer();
        else {
          this.incorrectAnswer();
          status = false;
        }
      }
      if (e.target === wrong_button) {
        if (this.itemTranslate.textContent !== CORRECT_TRANSLATE) this.correctAnswer();
        else {
          this.incorrectAnswer();
          status = false;
        }
      }
      this.updateUserWordInfo(ID!, status, CURRENT_ITEM.word);
      this.updateDescription();
      this.currentItem++;
      if (this.currentItem === this.itemsList?.length && typeof this.currentGroup === 'number') {
        this.currentItem = 0;
        let flag = true;
        this.ResultItems?.push(...this.itemsList);
        while (flag) {
          const RANDOM_PAGE = getRandomInt(this.MIN_PAGE, this.MAX_PAGE);
          if (RANDOM_PAGE !== this.currentPage && !this.usedPages.includes(RANDOM_PAGE)) {
            this.usedPages.push(RANDOM_PAGE);
            this.itemsList = logInData.isAutorizated
              ? await this.filterLearnedItems(this.currentGroup, RANDOM_PAGE)
              : await this.getGameItems(this.currentGroup, RANDOM_PAGE);
            flag = false;
          }
        }
      } else if (this.currentItem === this.itemsList?.length) {
        this.ResultItems?.push(...this.itemsList);
        this.clear();
        this.renderResults();
        return;
      }
      this.nextItem();
    });
    document.addEventListener('keydown', this.keyBoardHandler);
  }

  private renderScore() {
    this.gameHeading.append(this.score);
    this.updateDescription();
  }

  private clear() {
    if (this.invervalId) clearInterval(this.invervalId);
    document.removeEventListener('keydown', this.keyBoardHandler);
  }

  private nextItem() {
    if (!this.itemsList) return;
    const WORD_DATA = this.itemsList[this.currentItem];
    const RANDOM_INT = getRandomInt(0, this.itemsList.length - 1);
    const ANSWERS = [WORD_DATA.wordTranslate, this.itemsList[RANDOM_INT].wordTranslate];
    const RANDOM_TRANSLATE = ANSWERS[getRandomInt(0, 1)];
    this.item.textContent = WORD_DATA.word;
    this.itemTranslate.textContent = RANDOM_TRANSLATE;
  }

  private correctAnswer() {
    this.playSound(true);
    this.results.push(true);
    this.totalPoints += this.pointsGrowth;
    this.sequence++;
    if (this.sequence > this.bestSequence) this.bestSequence = this.sequence;
    if (this.stackCurrent === this.maxStackItemsAmount) {
      if (this.pointsGrowth !== this.maxGrowth) this.pointsGrowth *= 2;
      this.clearStack();
    } else {
      this.stackItems![this.stackCurrent++].classList.add('game__stack-item_filled');
    }
  }

  private incorrectAnswer() {
    this.playSound(false);
    this.sequence = 0;
    this.results.push(false);
    this.clearStack();
    if (this.pointsGrowth > this.minGrowth) {
      this.pointsGrowth /= 2;
    }
  }

  private clearStack() {
    this.stackCurrent = 0;
    for (let i = 0; i < this.stackItems!.length; i++) {
      this.stackItems![i].classList.remove('game__stack-item_filled');
    }
  }

  private updateDescription() {
    const DESCRIPTION = `${this.pointsGrowth} очков за ответ`;
    const SCORE_DESCRIPTION = `Набрано очков: ${this.totalPoints}`;
    this.stackDesciprtion.textContent = DESCRIPTION;
    this.score.textContent = SCORE_DESCRIPTION;
  }
}
