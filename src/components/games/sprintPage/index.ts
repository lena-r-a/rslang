'use strict';

import { Page } from '../../../core/templates/page';
import { IWord } from '../../../services/WordsService';
import { WordServise } from '../../../services/WordsService';
export class GameSprintPage extends Page {
  static TextObject = {
    MainTitle: 'GameSprintPage',
  };

  constructor(id: string, data?: IWord[]) {
    super(id);
    if (data) this.startGame(data);
    else this.showMenu();
  }

  render() {
    const title = this.createHeaderTitle(GameSprintPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }

  private startGame(data: IWord[]) {}

  private showMenu() {
    const DESCRIPTION = document.createElement('p');
    const DIFFICULTY_SELECT = document.createElement('select');
    const START_BUTTON = document.createElement('button');
    const BUTTON_TEXT = 'старт';
    const DESCRIPTION_TEXT = 'Выберите сложность';
    for (let i = 1; i <= 6; i++) {
      const OPTION = document.createElement('option');
      OPTION.textContent = String(i);
      OPTION.value = String(i);
      DIFFICULTY_SELECT.append(OPTION);
    }
    START_BUTTON.textContent = BUTTON_TEXT;
    DESCRIPTION.textContent = DESCRIPTION_TEXT;
    this.container.append(DESCRIPTION, DIFFICULTY_SELECT, START_BUTTON);
    START_BUTTON.addEventListener('click', () => this.loadContent(Number(DIFFICULTY_SELECT.value)));
  }

  async loadContent(difficulty: number){
  }
}
