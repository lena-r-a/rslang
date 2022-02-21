'use strict';

import './elBookPage.scss';
import { Page } from '../../core/templates/page';
import { GroupNavigation } from './groupNavigation';
import { WordContainer } from './wordsContainer';
import { WordState } from '../../RSLangSS';
import { PageNavigation } from './pageNavigation';
import { filterWordService } from '../../services/FilterWordsService';
import { logInData } from '../../states/logInData';
import { WordItem } from './wordItem';
import { Preloader } from '../../common/preloader';

export class ElBookPage extends Page {
  static TextObject = {
    MainTitle: 'ElBookPage',
  };

  groupNavigation: GroupNavigation;

  wordsContainer: WordContainer;

  pageNavigation: PageNavigation;

  constructor(id: string) {
    super(id);
    this.container.classList.add('elbook');
    this.groupNavigation = new GroupNavigation();
    this.wordsContainer = new WordContainer();
    this.pageNavigation = new PageNavigation();
    WordState.VOCABULARY ? this.goToDifficultWords() : this.wordsContainer.renderWordList(WordState.PAGE, WordState.GROUP);
    this.addListeners();
  }

  async goToDifficultWords() {
    this.setSettingsForVocabulary();
    Preloader.showPreloader();
    this.pageNavigation.navPageWrapper.classList.add('visually-hidden');
    const result = await filterWordService.getAggregatedWords(logInData.userId!, logInData.token!, '{"userWord.difficulty":"hard"}', 3600);
    const wordList = result![0].paginatedResults;
    if (wordList.length === 0) {
      this.wordsContainer.container.innerHTML = `
      <div class="center">
      Здесь будут отображаться сложные слова
      </div>
      `;
    } else {
      wordList!.forEach((el) => {
        const cardItem = new WordItem(el);
        cardItem.render();
        cardItem.container.classList.add(el.userWord.difficulty);
        cardItem.complicatedWord.innerHTML = 'Удалить из сложных';
        cardItem.complicatedWord.addEventListener('click', () => cardItem.container.remove());
        cardItem.studiedWord.innerHTML = 'Добавить в изученные';
        cardItem.studiedWord.addEventListener('click', () => cardItem.container.remove());
        this.wordsContainer.container.append(cardItem.container);
      });
    }
    Preloader.hidePreloader();
  }

  private setSettingsForVocabulary(): void {
    WordState.VOCABULARY = true;
    WordState.isStudiedPage = false;
    this.wordsContainer.container.innerHTML = '';
    this.wordsContainer.container.style.border = 'none';
    this.pageNavigation.difficultWordsLink.classList.add('active-link');
    this.groupNavigation.navItems.forEach((elem) => {
      elem.classList.add('unactive');
    });
    document.querySelectorAll('.game-button').forEach((el) => {
      const elem = el as HTMLElement;
      elem.style.pointerEvents = 'auto';
    });
  }

  private addListeners(): void {
    this.groupNavigation.navItems.forEach((el) => {
      el.addEventListener('click', () => {
        this.pageNavigation.navPageWrapper.classList.remove('visually-hidden');
        this.pageNavigation.gamesMenu.container.classList.remove('visually-hidden');
        WordState.GROUP = Number(el.dataset.id);
        WordState.PAGE = 0;
        this.wordsContainer.renderWordList(WordState.PAGE, WordState.GROUP);
        this.wordsContainer.container.style.backgroundColor = el.dataset.color!;
        WordState.BG = el.dataset.color!;
        this.pageNavigation.renderPagination(WordState.PAGE + 1);
      });
    });
    this.pageNavigation.difficultWordsLink.addEventListener('click', () => {
      this.goToDifficultWords();
    });
    this.pageNavigation.paginationList.addEventListener('click', (e: Event) => {
      let target = e.target as HTMLElement;
      if (target.classList.contains('numb-span') || target.children[0].classList.contains('numb-span')) {
        if (target.children[0]?.classList.contains('numb-span')) {
          target = target.children[0] as HTMLElement;
        }
        const currentPage = Number(target.innerHTML) - 1;
        WordState.PAGE = currentPage;
        this.pageNavigation.renderPagination(currentPage + 1);
        this.wordsContainer.renderWordList(WordState.PAGE, WordState.GROUP);
      }
      if (target.classList.contains('prev')) {
        this.goToPrevPage();
      }
      if (target.classList.contains('next')) {
        this.goToNextPage();
      }
    });
  }

  goToNextPage(): void {
    if (WordState.PAGE < WordState.TOTALPAGES - 1) {
      WordState.PAGE += 1;
      this.pageNavigation.renderPagination(WordState.PAGE + 1);
      this.wordsContainer.renderWordList(WordState.PAGE, WordState.GROUP);
    }
  }

  goToPrevPage(): void {
    if (WordState.PAGE > 0) {
      WordState.PAGE -= 1;
      this.pageNavigation.renderPagination(WordState.PAGE + 1);
      this.wordsContainer.renderWordList(WordState.PAGE, WordState.GROUP);
    }
  }

  render() {
    const title = this.createHeaderTitle(ElBookPage.TextObject.MainTitle);
    title.classList.add('visually-hidden');
    this.container.append(title);
    this.container.append(this.groupNavigation.container);
    this.container.append(this.pageNavigation.container);
    this.container.append(this.wordsContainer.container);
    return this.container;
  }
}
