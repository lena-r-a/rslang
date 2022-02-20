import './pageNavigation.scss';
import { Component } from '../../../core/templates/components';
import { WordState } from '../../../RSLangSS';
import { GamesMenu } from '../gamesMenu';
import { logInData } from '../../../states/logInData';
import { createPagination } from '../functions';

export class PageNavigation extends Component {
  navPageWrapper: HTMLElement;

  difficultWordsLink: HTMLElement;

  paginationList: HTMLElement;

  gamesMenu: GamesMenu;

  constructor() {
    super('section', ['page-navigation']);
    this.navPageWrapper = document.createElement('div');
    this.navPageWrapper.classList.add('pagination');
    this.paginationList = document.createElement('ul');
    this.gamesMenu = new GamesMenu();
    this.difficultWordsLink = document.createElement('button');
    this.difficultWordsLink.innerHTML = 'Сложные слова';
    this.appendElements();
    this.addClasses();
  }

  private addClasses() {
    this.navPageWrapper.classList.add('page-navigation__wrapper');
    this.difficultWordsLink.classList.add('page-navigation__difficult', 'link-btn');
    if (!logInData.isAutorizated) {
      this.difficultWordsLink.classList.add('visually-hidden');
    }
  }

  renderPagination(page: number): void {
    this.paginationList.innerHTML = createPagination(30, page, this.paginationList);
  }

  private appendElements() {
    this.navPageWrapper.append(this.paginationList);
    this.container.append(this.gamesMenu.container);
    this.container.append(this.navPageWrapper);
    this.container.append(this.difficultWordsLink);
    this.paginationList.innerHTML = createPagination(30, WordState.PAGE + 1, this.paginationList);
  }
}
