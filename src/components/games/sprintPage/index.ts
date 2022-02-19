'use strict';
import { Game } from '../Game';
import getRandomInt from '../../../common/getRandomInt';
import './sprintPage.scss';
import Chart from 'chart.js/auto';

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

  private score: HTMLElement;


  constructor(id: string, page?: number, group?: number, title = 'GameSprintPage') {
    super(id, title, 'sprint', page, group);
    this.sprintGameContainer = document.createElement('div');
    this.stackDesciprtion = document.createElement('p');
    this.item = document.createElement('p');
    this.itemTranslate = document.createElement('p');
    this.score = document.createElement('div');
    this.container.append(this.sprintGameContainer);
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

  private renderItem() {
    const CONTAINER = document.createElement('div');
    CONTAINER.append(this.item, this.itemTranslate);
    this.sprintGameContainer.append(CONTAINER);
    this.nextItem();
  }

  private renderTimer() {
    const TIMER_CONTAINER = document.createElement('div');
    TIMER_CONTAINER.textContent = String(this.gameTime);
    this.invervalId = setInterval(() => {
      TIMER_CONTAINER.textContent = String(--this.gameTime);
      if (!this.gameTime) {
        this.clearInterval();
        this.renderResults();
      }
    }, 1000);
    this.container.append(TIMER_CONTAINER);
  }

  private renderControls() {
    const CONTROLS_CONTAINER = document.createElement('div');
    const RIGHT_BUTTON = document.createElement('button');
    const WRONG_BUTTON = document.createElement('button');
    RIGHT_BUTTON.textContent = 'Верно';
    WRONG_BUTTON.textContent = 'Неверно';
    CONTROLS_CONTAINER.classList.add('game__controls');
    CONTROLS_CONTAINER.append(WRONG_BUTTON, RIGHT_BUTTON);
    this.setControlsListeners(CONTROLS_CONTAINER, RIGHT_BUTTON, WRONG_BUTTON);
    this.sprintGameContainer.append(CONTROLS_CONTAINER);
  }

  private setControlsListeners(container: HTMLElement, right_button: HTMLButtonElement, wrong_button: HTMLButtonElement) {
    const KEYBOARD_HANDLER = (e: KeyboardEvent) => {
      if (this.currentItem === this.itemsList?.length) return
      if(e.key === 'ArrowLeft') wrong_button.click();
      if(e.key === 'ArrowRight') right_button.click();
    };
    container.addEventListener('click', async (e) => {
      if (!(e.target instanceof HTMLButtonElement)) return;
      const CORRECT_TRANSLATE = this.itemsList![this.currentItem].wordTranslate;
      const CURRENT_ITEM = this.itemsList![this.currentItem];
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
      await this.updateUserWordInfo(CURRENT_ITEM.id, status, CURRENT_ITEM.word);
      this.updateDescription();
      this.currentItem++;
      if (this.currentItem === this.itemsList?.length) {
        this.clearInterval();
        document.removeEventListener('keydown', KEYBOARD_HANDLER);
        this.renderResults(this.totalPoints);
        return;
      }
      this.nextItem();
    });
    document.addEventListener('keydown', KEYBOARD_HANDLER);
  }

  private renderScore() {
    this.sprintGameContainer.append(this.score);
    this.updateDescription();
  }

  private clearInterval() {
    if (this.invervalId) clearInterval(this.invervalId);
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

  private playSound(result: boolean) {}

  private correctAnswer() {
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
