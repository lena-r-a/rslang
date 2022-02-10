import { Page } from '../../core/templates/page';
import { IWord } from '../../services/WordsService';
import { WordServise } from '../../services/WordsService';
import getRandomInt from '../../common/getRandomInt';
import './stylesheet.scss'

export abstract class Game extends Page{
  title: string;
  constructor(id: string, title: string, data?: IWord[]) {
    super(id);
    this.title = title;
    if (data) { this.startGame(data);
    } else this.showMenu();
  }

  render() {
    const title = this.createHeaderTitle(this.title);
    title.classList.add('visually-hidden');
    this.container.classList.add('game');
    this.container.append(title);
    return this.container;
  }

  abstract startGame(items: IWord[]): void;

  private showMenu() {
    const MENU_CONTAINER = document.createElement('div');
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
    MENU_CONTAINER.classList.add('game__menu');
    MENU_CONTAINER.append(DESCRIPTION, DIFFICULTY_SELECT, START_BUTTON);
    this.container.append(MENU_CONTAINER);
    START_BUTTON.addEventListener('click', async () => {
      const ITEMS = await this.getGameItems(Number(DIFFICULTY_SELECT.value));
      MENU_CONTAINER.remove();
      if(ITEMS) this.startGame(ITEMS);
    });
  }

  async getGameItems(difficulty: number) {
    const API = new WordServise();
    const MIN = 1;
    const MAX = 20;
    const RANDOM_PAGE = getRandomInt(MIN, MAX);
    const RESPONSE = await API.getWords(RANDOM_PAGE, difficulty);
    return RESPONSE;
  }
}