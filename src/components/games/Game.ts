import { filterWordService } from './../../services/FilterWordsService';
import { logInData } from './../../states/logInData';
import { userWordsService, INewWordRequest } from './../../services/UserWordsService';
import { Page } from '../../core/templates/page';
import { IWord } from '../../services/WordsService';
import { wordService } from './../../services/WordsService';
import getRandomInt from '../../common/getRandomInt';
import { Preloader } from '../../common/preloader';
import './stylesheet.scss';

export abstract class Game extends Page {
  protected title: string;

  protected itemsList: IWord[] | null = null;

  protected currentItem = 0;

  protected results: boolean[] = [];

  protected newWords = 0;

  protected sequence = 0;

  protected maxItemsAmount = 20;

  constructor(id: string, title: string, page?: number, group?: number) {
    super(id);
    this.title = title;
    let items: Promise<IWord[] | undefined> | null = null;
    Preloader.showPreloader();
    if (page && group && logInData.isAutorizated) {
      items = this.getFiltredItems(page, group);
    } else if (page && group) {
      items = this.getGameItems(page, group);
    } else {
      this.renderMenu();
    }
    if (items)
      items.then((arr) => {
        this.itemsList = arr!;
        this.startGame();
      });
    Preloader.hidePreloader();
  }

  render() {
    const title = this.createHeaderTitle(this.title);
    title.classList.add('visually-hidden');
    this.container.classList.add('game');
    this.container.append(title);
    return this.container;
  }

  abstract startGame(): void;

  private renderMenu() {
    const MENU_CONTAINER = document.createElement('div');
    const DESCRIPTION = document.createElement('p');
    const SELECT_CONTAINER = document.createElement('div');
    const GROUP_SELECT = document.createElement('select');
    const START_BUTTON = document.createElement('button');
    const BUTTON_TEXT = 'Cтарт';
    const DESCRIPTION_TEXT = 'Выберите сложность';
    for (let i = 0; i < 6; i++) {
      const OPTION = document.createElement('option');
      OPTION.textContent = String(i + 1);
      OPTION.value = String(i);
      GROUP_SELECT.append(OPTION);
    }
    SELECT_CONTAINER.classList.add('select');
    SELECT_CONTAINER.append(GROUP_SELECT);
    START_BUTTON.textContent = BUTTON_TEXT;
    START_BUTTON.classList.add('game__menu-button');
    DESCRIPTION.textContent = DESCRIPTION_TEXT;
    MENU_CONTAINER.classList.add('game__menu');
    MENU_CONTAINER.append(DESCRIPTION, SELECT_CONTAINER, START_BUTTON);
    this.container.append(MENU_CONTAINER);
    START_BUTTON.addEventListener('click', async () => {
      Preloader.showPreloader();
      const ITEMS = await this.getGameItems(Number(GROUP_SELECT.value));
      this.itemsList = ITEMS!;
      MENU_CONTAINER.remove();
      this.startGame();
      Preloader.hidePreloader();
    });
  }

  protected async getGameItems(group: number, page?: number, filtred?: boolean) {
    const MIN = 0;
    const MAX = 29;
    if (!page) page = getRandomInt(MIN, MAX);
    let items = await wordService.getWords(page, group);
    if (filtred) {
      const LEARNED = await filterWordService.getAggregatedWords(logInData.userId!, logInData.token!, '{"userWord.difficulty":"easy"}', 3600);
      const IDS = LEARNED?.map((elem, index) => elem.paginatedResults[index].id);
      items = items?.filter((elem) => !IDS?.includes(elem.id));
    }
    return items;
  }

  protected async getFiltredItems(group: number, page: number) {
    const ITEMS = [];
    let currentPage = page;
    while (currentPage >= 0 && ITEMS.length < this.maxItemsAmount) {
      const FILTRED = await this.getGameItems(currentPage--, group, true);
      ITEMS.push(...FILTRED!);
    }
    if(ITEMS.length > 20) return ITEMS.slice(0, 20);
    return ITEMS;
  }

  protected async updateUserWordInfo(wordId: string, status: boolean) {
    const TOKEN = logInData.token;
    const userId = logInData.userId;
    if (!logInData.isAutorizated || !TOKEN || !userId) return;
    const RESPONSE = await userWordsService.getUserWordByID({ userId, wordId }, TOKEN);
    if (RESPONSE) {
      this.updateWordStats(RESPONSE, status);
      userWordsService.editUserWord(RESPONSE, TOKEN);
    } else {
      const DATA = this.createWordData(userId, wordId);
      this.updateWordStats(DATA, status);
      userWordsService.createUserWord(DATA, TOKEN);
    }
  }

  protected createWordData(userId: string, wordId: string) {
    const DATA: INewWordRequest = {
      userId,
      wordId,
      word: {
        difficulty: 'normal',
        optional: {
          trueAnswer: 0,
          falseAnswer: 0,
        },
      },
    };
    return DATA;
  }

  protected updateWordStats(data: INewWordRequest, status: boolean) {
    if (!data.word!.optional!.falseAnswer && !data.word!.optional!.trueAnswer) this.newWords++;
    if (status) data.word!.optional!.trueAnswer += 1;
    else {
      data.word!.optional!.falseAnswer += 1;
      data.word!.difficulty = 'normal';
    }
    if (data.word!.optional!.trueAnswer >= 3 && data.word!.difficulty === 'normal') data.word!.difficulty = 'easy';
    if (data.word!.optional!.trueAnswer >= 5 && data.word!.difficulty === 'hard') data.word!.difficulty = 'easy';
  }
}
