'use strict';
import { ElBookPage } from './components/elBookPage';
import { MainPage } from './components/mainPage';
import { StatisticsPage } from './components/statisticsPage';
import { GameSprintPage } from './components/games/sprintPage';
import { GameChallengePage } from './components/games/challengePage';
import { SignInPage } from './components/autorizationPage/SignInPage';
import { SignUpPage } from './components/autorizationPage/SignUpPage';
import { GamesPage } from './components/gamesPage';
import { Page } from './core/templates/page';
import { Header } from './common/header';
import { Footer } from './common/footer';
import { ErrorPage } from './components/errorPage';
import { Preloader } from './common/preloader';
import { RSLangLS } from './RSLangLS';
import { rsLangSS } from './RSLangSS';
import { clearUserLogInData, refreshUserLogInData } from './states/logInData';
import { WordState } from './RSLangSS';

export const enum PageIds {
  mainPage = 'mainPage',
  statisticsPage = 'statisticsPage',
  autorizationPage = 'autorizationPage',
  gameChallengePage = 'gameChallengePage',
  gameSprintPage = 'gameSprintPage',
  elBookPage = 'ElBookPage',
  games = 'games',
  signUpPage = 'signUpPage',
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
      case PageIds.elBookPage:
        page = new ElBookPage(idPage);
        break;
      case PageIds.statisticsPage:
        page = new StatisticsPage(idPage);
        break;
      case PageIds.gameChallengePage:
        page = App.checkWordState(idPage);
        WordState.isFromBookPage = false;
        break;
      case PageIds.gameSprintPage:
        page = App.checkWordState(idPage);
        WordState.isFromBookPage = false;
        break;
      case PageIds.autorizationPage:
        page = new SignInPage(idPage);
        break;
      case PageIds.signUpPage:
        page = new SignUpPage(idPage);
        break;
      default:
        page = new ErrorPage(idPage, '404');
    }
    if (page) {
      const pageHTML = page.render();
      pageHTML.id = App.defaultPageId;
      this.container.querySelector('.header')?.after(pageHTML);
    }
    App.toogleFooterDisplay(idPage);
    App.setFocusOnInput(idPage);
  }

  static checkWordState(idPage: string): GameChallengePage | GameSprintPage {
    if (WordState.isFromBookPage) {
      if (WordState.VOCABULARY) {
        return idPage === PageIds.gameSprintPage ? new GameSprintPage(idPage, -1) : new GameChallengePage(idPage, -1);
      } else {
        return idPage === PageIds.gameSprintPage
          ? new GameSprintPage(idPage, WordState.PAGE, WordState.GROUP)
          : new GameChallengePage(idPage, WordState.PAGE, WordState.GROUP);
      }
    }
    return idPage === PageIds.gameSprintPage ? new GameSprintPage(idPage) : new GameChallengePage(idPage);
  }

  static toogleFooterDisplay(idPage: string): void {
    if (idPage === PageIds.gameChallengePage || idPage === PageIds.gameSprintPage) {
      this.container.querySelector('.footer')?.remove();
    } else {
      if (!document.querySelector('.footer')) {
        const footer = new Footer();
        this.container.append(footer.render());
      }
    }
  }

  static setFocusOnInput(idPage: string): void {
    if (idPage === PageIds.autorizationPage || idPage === PageIds.signUpPage) {
      const formEl = document.forms[0]?.querySelector('input') as HTMLInputElement | null;
      formEl?.focus();
    }
  }

  private enableRouteChange() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      App.renderNewPage(hash);
    });
  }

  private getPreloader() {
    const preloader = new Preloader().render();
    preloader.style.display = 'none';
    return preloader;
  }

  public checkUserData() {
    if (RSLangLS.isUserAutorizated()) {
      const dataJSON = RSLangLS.getUserDataJSON() as string;
      const data = JSON.parse(dataJSON);
      refreshUserLogInData(data);
    } else clearUserLogInData();
  }

  private runApp() {
    this.checkUserData();
    App.container.append(this.getPreloader());
    Preloader.enablePreloader();
    const header = new Header();
    App.container.append(header.render());
  }

  public runToMainPage() {
    document.body.innerHTML = '';
    window.location.href = `#${PageIds.mainPage}`;
    this.runApp();
    App.renderNewPage('mainPage');
  }

  public runToAutorizationPage() {
    document.body.innerHTML = '';
    window.location.href = `#${PageIds.autorizationPage}`;
    this.runApp();
    App.renderNewPage('autorizationPage');
  }

  public run() {
    rsLangSS.setWordStateFromStorage();
    window.onbeforeunload = () => {
      rsLangSS.saveToSessionStorage();
    };
    this.runApp();
    if (window.location.hash.slice(1)) {
      App.renderNewPage(window.location.hash.slice(1));
    } else {
      App.renderNewPage('mainPage');
    }
    this.enableRouteChange();
  }
}
