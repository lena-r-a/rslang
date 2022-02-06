import { Component } from '../../core/templates/components';
import { Menu } from './menu';
import './header.scss';

export class Header extends Component {
  private menu: Menu;

  private logo: HTMLElement;

  constructor(tagName: string, className: string[]) {
    super(tagName, className);

    this.menu = new Menu('nav', ['menu']);
    this.container.innerHTML = '<div class="header__fixed"><div class ="header__wrapper"></div></div>';
    this.logo = this.renderLogo();
  }

  renderLogo() {
    const logo = document.createElement('h1');
    logo.innerText = 'Rs-Lang';
    logo.classList.add('header__logo');
    return logo;
  }

  render() {
    const headerWrapper = this.container.querySelector('.header__wrapper');
    headerWrapper?.append(this.logo);
    headerWrapper?.append(this.menu.render());
    return this.container;
  }
}
