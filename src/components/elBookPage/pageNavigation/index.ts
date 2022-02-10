import './pageNavigation.scss';
import { Component } from '../../../core/templates/components';
import { WordState } from '../groupNavigation';
import { GamesMenu } from '../gamesMenu';

export class PageNavigation extends Component {
  prevPage: HTMLElement;

  nextPage: HTMLElement;

  firstPage: HTMLElement;

  lastPage: HTMLElement;

  numberContainer: HTMLElement;

  navPageWrapper: HTMLElement;

  difficultWordsLink: HTMLElement;

  gamesMenu: GamesMenu;

  constructor() {
    super('section', ['page-navigation']);
    this.navPageWrapper = document.createElement('div');
    this.prevPage = document.createElement('button');
    this.nextPage = document.createElement('button');
    this.firstPage = document.createElement('button');
    this.lastPage = document.createElement('button');
    this.gamesMenu = new GamesMenu();
    this.numberContainer = document.createElement('div');
    this.numberContainer.innerHTML = `
      <span class = "page-navigation__current">${WordState.PAGE + 1}</span> / 
      <span class = "page-navigation__total">${WordState.TOTALPAGES}</span>
    `;
    this.difficultWordsLink = document.createElement('button');
    this.difficultWordsLink.innerHTML = 'Сложные слова';
    this.appendElements();
    this.addClasses();
  }

  private addClasses() {
    this.prevPage.classList.add('page-navigation__prev', 'arrow-btn');
    this.navPageWrapper.classList.add('page-navigation__wrapper');
    this.nextPage.classList.add('page-navigation__next', 'arrow-btn');
    this.lastPage.classList.add('page-navigation__end', 'arrow-btn');
    this.firstPage.classList.add('page-navigation__start', 'arrow-btn');
    this.difficultWordsLink.classList.add('page-navigation__difficult', 'link-btn');
  }

  private appendElements() {
    this.navPageWrapper.append(this.firstPage);
    this.navPageWrapper.append(this.prevPage);
    this.navPageWrapper.append(this.numberContainer);
    this.navPageWrapper.append(this.nextPage);
    this.navPageWrapper.append(this.lastPage);
    this.container.append(this.gamesMenu.container);
    this.container.append(this.navPageWrapper);
    this.container.append(this.difficultWordsLink);
  }
}
