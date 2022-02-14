'use strict';

import { Page } from '../../core/templates/page';
import { GroupNavigation } from './groupNavigation';
import { WordContainer } from './wordsContainer';
import { WordState } from './groupNavigation';
import { PageNavigation } from './pageNavigation';
import { filterWordService } from '../../services/FilterWordsService';
import { logInData } from '../../states/logInData';
import { WordItem } from './wordItem';

export class ElBookPage extends Page {
  static TextObject = {
    MainTitle: 'ElBookPage',
  };

  groupNavigation: GroupNavigation;

  wordsContainer: WordContainer;

  pageNavigation: PageNavigation;

  constructor(id: string) {
    super(id);
    this.groupNavigation = new GroupNavigation();
    this.wordsContainer = new WordContainer();
    this.pageNavigation = new PageNavigation();
    this.wordsContainer.renderWordList(WordState.PAGE, WordState.GROUP);
    this.groupNavigation.navItems.forEach((el) => {
      el.addEventListener('click', () => {
        this.pageNavigation.navPageWrapper.classList.remove('visually-hidden');
        this.pageNavigation.gamesMenu.container.classList.remove('visually-hidden');
        WordState.GROUP = Number(el.dataset.id);
        WordState.PAGE = 0;
        this.wordsContainer.renderWordList(WordState.PAGE, WordState.GROUP);
        this.wordsContainer.container.style.backgroundColor = el.dataset.color!;
        WordState.BG = el.dataset.color!;
        this.refreshCurrentPage();
      });
    });
    this.pageNavigation.firstPage.addEventListener('click', () => this.goToFirstPage());
    this.pageNavigation.lastPage.addEventListener('click', () => this.goToLastPage());
    this.pageNavigation.nextPage.addEventListener('click', () => this.goToNextPage());
    this.pageNavigation.prevPage.addEventListener('click', () => this.goToPrevPage());
    this.pageNavigation.difficultWordsLink.addEventListener('click', () => {
      this.goToDifficultWords();
    });
  }

  async goToDifficultWords() {
    WordState.VOCABULARY = true;
    this.wordsContainer.container.innerHTML = '';
    this.groupNavigation.navItems.forEach((elem) => {
      elem.classList.add('unactive');
    });
    this.pageNavigation.navPageWrapper.classList.add('visually-hidden');
    this.pageNavigation.gamesMenu.container.classList.add('visually-hidden');
    const result = await filterWordService.getAggregatedWords(logInData.userId!, logInData.token!, '{"userWord.difficulty":"hard"}', 3600);
    const wordList = result![0].paginatedResults;
    wordList!.forEach((el) => {
      const cardItem = new WordItem(el);
      cardItem.render();
      cardItem.container.classList.add(el.userWord.difficulty);
      cardItem.complicatedWord.innerHTML = 'Удалить из сложных';
      cardItem.complicatedWord.addEventListener('click', () => cardItem.container.remove());
      cardItem.studiedWord.innerHTML = 'Добвить в изученные';
      cardItem.studiedWord.addEventListener('click', () => cardItem.container.remove());
      this.wordsContainer.container.append(cardItem.container);
    });
  }

  goToNextPage(): void {
    if (WordState.PAGE < WordState.TOTALPAGES - 1) {
      WordState.PAGE += 1;
      this.refreshCurrentPage();
      this.wordsContainer.renderWordList(WordState.PAGE, WordState.GROUP);
    }
  }

  goToPrevPage(): void {
    if (WordState.PAGE > 0) {
      WordState.PAGE -= 1;
      this.refreshCurrentPage();
      this.wordsContainer.renderWordList(WordState.PAGE, WordState.GROUP);
    }
  }

  goToFirstPage(): void {
    if (WordState.PAGE !== 0) {
      WordState.PAGE = 0;
      this.refreshCurrentPage();
      this.wordsContainer.renderWordList(WordState.PAGE, WordState.GROUP);
    }
  }

  goToLastPage(): void {
    if (WordState.PAGE !== WordState.TOTALPAGES - 1) {
      WordState.PAGE = WordState.TOTALPAGES - 1;
      this.refreshCurrentPage();
      this.wordsContainer.renderWordList(WordState.PAGE, WordState.GROUP);
    }
  }

  refreshCurrentPage(): void {
    const current = document.querySelector('.page-navigation__current') as HTMLElement;
    current.innerHTML = String(WordState.PAGE + 1);
  }

  render() {
    const title = this.createHeaderTitle(ElBookPage.TextObject.MainTitle);
    title.classList.add('visually-hidden');
    this.container.append(title);
    this.container.append(this.groupNavigation.container);
    this.container.append(this.wordsContainer.container);
    this.container.append(this.pageNavigation.container);
    return this.container;
  }
}
