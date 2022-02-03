'use strict';
import { ElBookPage } from './components/elBookPage';
import { MainPage } from './components/mainPage';
import { StatisticsPage } from './components/statisticsPage';
import { GameSprintPage } from './components/games/sprintPage';
import { GameChallengePage } from './components/games/challengePage';
import { AutorizationPage } from './components/autorizationPage';
import { DictionaryPage } from './components/dictionaryPage';
import { GamesPage } from './components/gamesPage';
import { Page } from './core/templates/page';
import { Header } from './common/header';
import { Footer } from './common/footer';
import { ErrorPage } from './components/errorPage';

export const enum PageIds {
  mainPage = 'mainPage',
  statisticsPage = 'statisticsPage',
  autorizationPage = 'autorizationPage',
  gameChallengePage = 'gameChallengePage',
  gameSprintPage = 'gameSprintPage',
  elBookPage = 'ElBookPage',
  games = 'games',
  dictionary = 'dictionary',
}

export class App {
  private static container: HTMLElement = document.body;

  private initialPage: MainPage;

  private static defaultPageId = 'currentPage';

  constructor() {
    this.initialPage = new MainPage('MainPage');
  }

  static renderNewPage(idPage: string) {
    const currentPage = document.getElementById(App.defaultPageId);
    if (currentPage) {
      currentPage.remove();
    }
    let page: Page | null = null;
    switch (idPage) {
      case PageIds.mainPage:
        page = new MainPage(idPage);
        break;
      case PageIds.games:
        page = new GamesPage(idPage);
        break;
      case PageIds.dictionary:
        page = new DictionaryPage(idPage);
        break;
      case PageIds.elBookPage:
        page = new ElBookPage(idPage);
        break;
      case PageIds.statisticsPage:
        page = new StatisticsPage(idPage);
        break;
      case PageIds.gameChallengePage:
        page = new GameChallengePage(idPage);
        break;
      case PageIds.gameSprintPage:
        page = new GameSprintPage(idPage);
        break;
      case PageIds.autorizationPage:
        page = new AutorizationPage(idPage);
        break;
      default:
        page = new ErrorPage(idPage, '404');
    }
    if (page) {
      const pageHTML = page.render();
      pageHTML.id = App.defaultPageId;
      this.container.querySelector('.header')?.after(pageHTML);
    }
    if (idPage === PageIds.gameChallengePage || idPage === PageIds.gameSprintPage) {
      this.container.querySelector('.footer')?.remove();
    } else {
      if (!document.querySelector('.footer')) {
        const footer = new Footer();
        this.container.append(footer.render());
      }
    }
  }

  private enableRouteChange() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      App.renderNewPage(hash);
    });
  }

  public run() {
    const header = new Header();
    App.container.append(header.render());
    App.renderNewPage('mainPage');
    window.location.href = `#${PageIds.mainPage}`;
    this.enableRouteChange();
  }
}
