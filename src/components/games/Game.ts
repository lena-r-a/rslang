import { StatDataGameType } from './../../services/StatisticsService';
import { Statistics, StatKeysType, StatDateLearnedType } from './../../states/statisticsState';
import { filterWordService, IAggr, IAgregatedWord } from './../../services/FilterWordsService';
import { logInData } from './../../states/logInData';
import { userWordsService, INewWordRequest, IUserWord, IUserWordsResponse, IOptional } from './../../services/UserWordsService';
import { Page } from '../../core/templates/page';
import { IWord } from '../../services/WordsService';
import { wordService } from './../../services/WordsService';
import getRandomInt from '../../common/getRandomInt';
import { Preloader } from '../../common/preloader';
import './stylesheet.scss';

enum Difficulty {
  easy = 'easy',
  hard = 'hard',
  normal = 'normal',
}
export abstract class Game extends Page {
  protected title: string;

  protected currentPage: number | undefined;
  
  protected currentGroup: number | undefined;

  protected itemsList: IWord[] | IAgregatedWord[] | undefined = undefined;

  protected currentItem = 0;

  protected results: boolean[] = [];

  protected newWords = 0;

  protected sequence = 0;

  protected bestSequence = 0;

  protected maxItemsAmount = 20;

  protected name: keyof StatKeysType;

  protected URL = 'https://rslang-js.herokuapp.com/';
  
  protected correctSound = '../../assets/sounds/correct.mp3';

  protected wrongSound = '../../assets/sounds/wrong.mp3';

  constructor(id: string, title: string, name: keyof StatKeysType, page?: number, group?: number) {
    super(id);
    this.title = title;
    this.currentGroup = group;
    this.currentPage = page;
    this.name = name;
    let items: Promise<IWord[] | undefined> | null = null;
    let difficultItems: Promise<IAggr[] | undefined> | null = null;
    const IS_NUM = typeof page === 'number';
    if (IS_NUM && page < 0 && logInData.isAutorizated) {
      difficultItems = this.getFiltredItems(Difficulty.hard);
    } else if (IS_NUM && logInData.isAutorizated) {
      items = this.filterLearnedItems(group!, page);
    } else if (IS_NUM) {
      items = this.getGameItems(group!, page);
    } else {
      this.renderMenu();
    }
    if (items){
      Preloader.showPreloader();
      items.then((arr) => {
        this.itemsList = arr;
        this.startGame();
        Preloader.hidePreloader();
      });
    }

    if (difficultItems) {
      Preloader.showPreloader()
      difficultItems.then((arr) => {
        this.itemsList = arr![0].paginatedResults;
        this.startGame();
        Preloader.hidePreloader();
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
    SELECT_CONTAINER.classList.add('game__select');
    SELECT_CONTAINER.append(GROUP_SELECT);
    START_BUTTON.textContent = BUTTON_TEXT;
    START_BUTTON.classList.add('game__menu-button');
    DESCRIPTION.textContent = DESCRIPTION_TEXT;
    MENU_CONTAINER.classList.add('game__menu');
    MENU_CONTAINER.append(DESCRIPTION, SELECT_CONTAINER, START_BUTTON);
    this.container.append(MENU_CONTAINER);
    START_BUTTON.addEventListener('click', async () => {
      Preloader.showPreloader();
      this.currentGroup = Number(GROUP_SELECT.value);
      const ITEMS = await this.getGameItems(this.currentGroup);
      this.itemsList = ITEMS!;
      MENU_CONTAINER.remove();
      this.startGame();
      Preloader.hidePreloader();
    });
  }

  //TODO INFINITY QUESTIONS LOOP
  protected async getGameItems(group: number, page?: number, filtred?: boolean) {
    const MIN = 0;
    const MAX = 29;
    const IS_NUM = typeof page === 'number';
    if (!IS_NUM) page = getRandomInt(MIN, MAX);
    let items = await wordService.getWords(page!, group);
    if (filtred) {
      const LEARNED = await this.getFiltredItems(Difficulty.easy);
      const IDS = LEARNED![0].paginatedResults.map((elem) => elem._id);
      items = items?.filter((elem) => {
        return !IDS?.includes(elem.id)});
    }
    return items;
  }

  private async filterLearnedItems(group: number, page: number) {
    const ITEMS = [];
    let currentPage = page;
    while (currentPage >= 0 && ITEMS.length < this.maxItemsAmount) {
      const FILTRED = await this.getGameItems(group, currentPage--, true);
      ITEMS.push(...FILTRED!);
    }
    if (ITEMS.length > 20) return ITEMS.slice(0, 20);
    return ITEMS;
  }

  private async getFiltredItems(diff: string) {
    const ITEMS = await filterWordService.getAggregatedWords(logInData.userId!, logInData.token!, `{"userWord.difficulty":"${diff}"}`, 3600);
    return ITEMS;
  }

  protected async updateUserWordInfo(wordId: string, status: boolean, word = '') {
    const TOKEN = logInData.token;
    const userId = logInData.userId;
    if (!logInData.isAutorizated || !TOKEN || !userId) return;

    const ITEMS = await userWordsService.getUserWords(userId, TOKEN);
    const ITEM = ITEMS!.find((elem) => elem.wordId === wordId);
    if (ITEM) {
      const REQUEST_WORD: IUserWord = await userWordsService.getUserWordByID({ userId, wordId }, TOKEN);
      this.updateWordStats(REQUEST_WORD, null, status, word);
      userWordsService.editUserWord({ userId, wordId, word: { difficulty: REQUEST_WORD.difficulty, optional: REQUEST_WORD.optional } }, TOKEN);
    } else {
      const DATA = this.createWordData(userId, wordId);
      this.updateWordStats(null, DATA, status, word);
      userWordsService.createUserWord(DATA, TOKEN);
    }
  }

  private createWordData(userId: string, wordId: string) {
    const DATA: INewWordRequest = {
      userId,
      wordId,
      word: {
        difficulty: Difficulty.normal,
        optional: {
          trueAnswer: 0,
          falseAnswer: 0,
        },
      },
    };
    return DATA;
  }

  private updateWordStats(response?: IUserWord | null, request?: INewWordRequest | null, status?: boolean, word?: string) {
    const KEY = 'learned';
    const STATISTIC_DATA: StatDateLearnedType = {
      word: word!,
      add: status!,
    };
    const DIFF = response ? response.difficulty : request!.word!.difficulty;
    let optional: IOptional | null = null;
    if (response) optional = response.optional!;
    if (request) optional = request.word?.optional!;
    if (!optional!.falseAnswer && !optional!.trueAnswer) this.newWords++;
    if (status) {
      optional!.trueAnswer += 1;
    } else {
      optional!.falseAnswer += 1;
      if (DIFF === Difficulty.easy && response) response.difficulty = Difficulty.normal;
      if (DIFF === Difficulty.easy && request) request.word!.difficulty = Difficulty.normal;
      Statistics.updateStat(KEY, STATISTIC_DATA);
    }

    if (optional!.trueAnswer >= 3 && DIFF === Difficulty.normal) {
      if (response) response.difficulty = Difficulty.easy;
      if (request) request.word!.difficulty = Difficulty.easy;
      Statistics.updateStat(KEY, STATISTIC_DATA);
    }
    if (optional!.trueAnswer >= 5 && DIFF === Difficulty.hard) {
      if (response) response.difficulty = Difficulty.easy;
      if (request) request.word!.difficulty = Difficulty.easy;
      Statistics.updateStat(KEY, STATISTIC_DATA);
    }
  }

  private sendStats() {
    const DATA: StatDataGameType = {
      newWords: this.newWords,
      rightAnsw: this.results.reduce((acc, elem) => acc + Number(elem), 0),
      questions: this.results.length,
      session: this.bestSequence,
    };
    Statistics.updateStat(this.name, DATA);
  }

  protected renderResults(score?: number) {
    if (logInData.isAutorizated) this.sendStats();
    const RESULTS_CONTAINER = document.createElement('div');
    const RESULTS_TABLE = document.createElement('table');
    const RETURN_BUTTON = document.createElement('button');
    const SCORE = document.createElement('p');
    RETURN_BUTTON.textContent = 'SOME BUTTON EVENT';
    if (score) {
      SCORE.textContent = `Вы заработали ${score} очков`;
    }
    this.results.forEach((result, index) => {
      const LINE = this.getResultLine(result, index);
      RESULTS_TABLE.append(LINE);
    });
    RESULTS_CONTAINER.append(SCORE, RESULTS_TABLE, RETURN_BUTTON);
    this.container.innerHTML = '';
    this.container.append(RESULTS_CONTAINER);
  }

  private getResultLine(result: boolean, index: number) {
    const LINE = document.createElement('tr');
    const sound = document.createElement('audio');
    sound.src = this.URL + this.itemsList![index].audio;
    const soundIcon = document.createElement('img');
    soundIcon.src = '../../assets/svg/sound.svg';
    soundIcon.addEventListener('click', () => sound.play());
    soundIcon.classList.add('game__sound-icon');
    const RESULT_ITEMS = [
      soundIcon,
      this.itemsList![index].word,
      this.itemsList![index].wordTranslate,
      this.itemsList![index].transcription,
      result ? '✔️' : '❌',
    ];
    RESULT_ITEMS.forEach((content) => {
      const TD = document.createElement('td');
      if (typeof content === 'string') TD.textContent = content;
      else TD.append(content);
      LINE.append(TD);
    });
    return LINE;
  }

  protected playSound(result: boolean) {
    const SOUND = document.createElement('audio');
    SOUND.src = result ? this.correctSound : this.wrongSound;
    SOUND.play();
  }
  //TODO ERROR NOT ENOUGHT WORDS FOR THE GAME
}
