import { Page } from '../../core/templates/page';
import { IWord } from '../../services/WordsService';
import { WordServise } from '../../services/WordsService';
import getRandomInt from '../../common/getRandomInt';
import './stylesheet.scss';

export abstract class Game extends Page {
  protected title: string;

  protected questionsList: IWord[] | null = null;

  protected currentQuestion = 0;

  protected results: boolean[] = [];

  constructor(id: string, title: string, page?: number, group?: number) {
    super(id);
    this.title = title;
    if (!page || !group) {
      this.showMenu();
    } else {
      const ITEMS_RESPONSE = this.getGameItems(page, group);
      ITEMS_RESPONSE.then((ITEMS) => {
        if (ITEMS) this.startGame();
      });
    }
  }

  render() {
    const title = this.createHeaderTitle(this.title);
    title.classList.add('visually-hidden');
    this.container.classList.add('game');
    this.container.append(title);
    return this.container;
  }

  abstract startGame(): void;

  private showMenu() {
    const MENU_CONTAINER = document.createElement('div');
    const DESCRIPTION = document.createElement('p');
    const GROUP_SELECT = document.createElement('select');
    const START_BUTTON = document.createElement('button');
    const BUTTON_TEXT = 'старт';
    const DESCRIPTION_TEXT = 'Выберите сложность';
    for (let i = 1; i <= 6; i++) {
      const OPTION = document.createElement('option');
      OPTION.textContent = String(i);
      OPTION.value = String(i);
      GROUP_SELECT.append(OPTION);
    }
    START_BUTTON.textContent = BUTTON_TEXT;
    DESCRIPTION.textContent = DESCRIPTION_TEXT;
    MENU_CONTAINER.classList.add('game__menu');
    MENU_CONTAINER.append(DESCRIPTION, GROUP_SELECT, START_BUTTON);
    this.container.append(MENU_CONTAINER);
    START_BUTTON.addEventListener('click', async () => {
      await this.getGameItems(Number(GROUP_SELECT.value));
      MENU_CONTAINER.remove();
      this.startGame();
    });
  }

  private async getGameItems(group: number, page?: number) {
    const API = new WordServise();
    const MIN = 1;
    const MAX = 20;
    if (!page) page = getRandomInt(MIN, MAX);
    const ITEMS = await API.getWords(page, group);
    if (ITEMS) this.questionsList = ITEMS;
    return ITEMS;
  }
}
