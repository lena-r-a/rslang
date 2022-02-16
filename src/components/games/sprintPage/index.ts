'use strict';
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

  private question: HTMLElement;

  private answer: HTMLElement;

  private score: HTMLElement;

  constructor(id: string, page?: number, group?: number, title = 'GameSprintPage') {
    super(id, title, page, group);
    this.sprintGameContainer = document.createElement('div');
    this.stackDesciprtion = document.createElement('p');
    this.question = document.createElement('p');
    this.answer = document.createElement('p');
    this.score = document.createElement('div');
    this.container.append(this.sprintGameContainer);
  }

  startGame(): void {
    this.renderTimer();
    this.renderStack();
    this.renderScore();
    this.renderQuestion();
    this.renderControls();
  }

  renderStack() {
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

  renderQuestion() {
    const CONTAINER = document.createElement('div');
    CONTAINER.append(this.question, this.answer);
    this.sprintGameContainer.append(CONTAINER);
    this.nextQuestion();
  }

  renderTimer() {
    const TIMER_CONTAINER = document.createElement('div');
    TIMER_CONTAINER.textContent = String(this.gameTime);
    this.invervalId = setInterval(() => {
      TIMER_CONTAINER.textContent = String(--this.gameTime);
      if (!this.gameTime) this.renderResults();
    }, 1000);
    this.container.append(TIMER_CONTAINER);
  }

  renderControls() {
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

  setControlsListeners(container: HTMLElement, right_button: HTMLButtonElement, wrong_button: HTMLButtonElement) {
    container.addEventListener('click', (e) => {
      const CORRECT_TRANSLATE = this.questionsList![this.currentQuestion].wordTranslate;
      if (e.target === right_button) {
        if (this.answer.textContent === CORRECT_TRANSLATE) this.correctAnswer();
        else this.incorrectAnswer();
      } else if (e.target === wrong_button) {
        if (this.answer.textContent !== CORRECT_TRANSLATE) this.correctAnswer();
        else this.incorrectAnswer();
      }
      this.updateStats();
      this.currentQuestion++;
      this.nextQuestion();
    });
  }

  renderScore() {
    this.sprintGameContainer.append(this.score);
    this.updateStats();
  }

  renderResults() {
    if (this.invervalId) clearInterval(this.invervalId);
  }

  nextQuestion() {
    if (!this.questionsList) return;
    const WORD_DATA = this.questionsList[this.currentQuestion];
    const RANDOM_INT = getRandomInt(0, this.questionsList.length - 1);
    const ANSWERS = [WORD_DATA.wordTranslate, this.questionsList[RANDOM_INT].wordTranslate];
    const RANDOM_TRANSLATE = ANSWERS[getRandomInt(0, 1)];
    this.question.textContent = WORD_DATA.word;
    this.answer.textContent = RANDOM_TRANSLATE;
  }

  playSound(result: boolean) {}

  correctAnswer() {
    this.results.push(true);
    this.totalPoints += this.pointsGrowth;
    if (this.stackCurrent === this.maxStackItemsAmount && this.pointsGrowth < this.maxGrowth) {
      this.pointsGrowth *= 2;
      this.clearStack();
    } else {
      this.stackItems![this.stackCurrent++].classList.add('game__stack-item_filled');
    }
  }

  incorrectAnswer() {
    this.results.push(false);
    this.clearStack();
    if (this.pointsGrowth > this.minGrowth) {
      this.pointsGrowth /= 2;
    }
  }

  clearStack() {
    this.stackCurrent = 0;
    for (let i = 0; i < this.stackItems!.length; i++) {
      this.stackItems![i].classList.remove('game__stack-item_filled');
    }
  }

  updateStats() {
    const DESCRIPTION = `${this.pointsGrowth} очков за ответ`;
    const SCORE_DESCRIPTION = `Набрано очков: ${this.totalPoints}`;
    this.stackDesciprtion.textContent = DESCRIPTION;
    this.score.textContent = SCORE_DESCRIPTION;
  }
}
