'use strict';

import { Page } from '../../core/templates/page';
import { GroupNavigation } from './groupNavigation';
import { WordContainer } from './wordsContainer';
import { WordState } from './groupNavigation';
import { PageNavigation } from './pageNavigation';

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
