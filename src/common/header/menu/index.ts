import { Component } from '../../../core/templates/components';
import { PageIds } from '../../../app';
import './menu.scss';
import { RSLangLS } from '../../../RSLangLS';

const Buttons = [
  {
    id: PageIds.mainPage,
    text: 'главная',
  },
  {
    id: PageIds.elBookPage,
    text: 'учебник',
  },
  {
    id: PageIds.dictionary,
    text: 'словарь',
  },
  {
    id: PageIds.games,
    text: 'игры',
  },
  {
    id: PageIds.statisticsPage,
    text: 'статистика',
  },
  // {
  //   id: PageIds.autorizationPage,
  //   text: 'вход',
  // },
];

export class Menu extends Component {
  constructor(tagName: string, className: string[]) {
    super(tagName, className);
  }

  private renderPageButtons() {
    Buttons.forEach((btn) => {
      const buttonHTML = document.createElement('a');
      buttonHTML.href = `#${btn.id}`;
      buttonHTML.innerText = btn.text;
      buttonHTML.classList.add('menu__item', `menu__item--${btn.id}`);
      this.container.append(buttonHTML);
    });
  }

  public render() {
    this.renderPageButtons();
    if (!RSLangLS.isUserAutorizated()) {
      const statistics = this.container.querySelector(`.menu__item--${PageIds.statisticsPage}`) as HTMLElement;
      console.log(statistics);
      statistics.style.display = 'none';
    }
    return this.container;
  }
}
