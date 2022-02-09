import { Component } from '../../../core/templates/components';
import { PageIds } from '../../../app';
import './menu.scss';
import { RSLangLS } from '../../../RSLangLS';
import { Button } from '../../button';

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
];

export class Menu extends Component {
  private burgerBtn: Button;

  private wrapper: HTMLElement;

  constructor(tagName: string, className: string[]) {
    super(tagName, className);
    this.burgerBtn = new Button('button', '', ['menu__burgerBtn']);
    this.burgerBtn.onClick(this.showMenu);
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('menu__wrapper');
  }

  private showMenu() {
    const wrapper = document.querySelector('.menu__wrapper') as HTMLElement;
    wrapper.classList.toggle('menu__wrapper--open');
    const btn = document.querySelector('.menu__burgerBtn') as HTMLElement;
    btn.classList.toggle('menu__burgerBtn--open');
  }

  private renderPageButtons() {
    Buttons.forEach((btn) => {
      const buttonHTML = document.createElement('a');
      buttonHTML.href = `#${btn.id}`;
      buttonHTML.innerText = btn.text;
      buttonHTML.classList.add('menu__item', `menu__item--${btn.id}`);
      this.wrapper.append(buttonHTML);
    });
  }

  public render() {
    this.container.append(this.burgerBtn.rendor());
    this.renderPageButtons();
    this.container.append(this.wrapper);
    if (!RSLangLS.isUserAutorizated()) {
      const statistics = this.container.querySelector(`.menu__item--${PageIds.statisticsPage}`) as HTMLElement;
      statistics.style.display = 'none';
    }
    return this.container;
  }
}
