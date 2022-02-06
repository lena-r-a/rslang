import { Component } from '../../../core/templates/components';
import { PageIds } from '../../../app';
import './menu.scss';

const Buttons = [
  {
    id: PageIds.mainPage,
    text: 'главная',
  },
  {
    id: PageIds.autorizationPage,
    text: 'авторизация',
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
];

export class Menu extends Component {
  constructor(tagName: string, className: string[]) {
    super(tagName, className);
  }

  renderPageButtons() {
    Buttons.forEach((btn) => {
      const buttonHTML = document.createElement('a');
      buttonHTML.href = `#${btn.id}`;
      buttonHTML.innerText = btn.text;
      buttonHTML.classList.add('menu__item');
      this.container.append(buttonHTML);
    });
  }

  render() {
    this.renderPageButtons();
    return this.container;
  }
}
