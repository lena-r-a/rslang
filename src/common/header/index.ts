import { Component } from '../../core/templates/components';
import { Menu } from './menu';
import './header.scss';
import { UserView } from './userView';

export class Header extends Component {
  private menu: HTMLElement;

  private logo: HTMLElement;

  private userView: HTMLElement;

  constructor() {
    super('header', ['header']);
    this.menu = new Menu('nav', ['menu']).render();
    this.menu.classList.add('header__menu');
    this.container.innerHTML = '<div class="header__fixed"><span class="header__message"></span><div class ="header__wrapper"></div></div>';
    this.logo = this.renderLogo();
    this.userView = new UserView().render();
    this.userView.classList.add('header__userView');
  }

  private renderLogo() {
    const logo = document.createElement('h1');
    logo.innerText = 'Rs-Lang';
    logo.classList.add('header__logo');
    return logo;
  }

  public render() {
    const headerWrapper = this.container.querySelector('.header__wrapper') as HTMLElement;
    headerWrapper.append(this.logo);
    headerWrapper.append(this.menu);
    headerWrapper.append(this.userView);
    return this.container;
  }
}
