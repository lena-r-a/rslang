import { Component } from '../../core/templates/components';
import { Menu } from './menu';
import './header.scss';
import { UserView } from './userView';

export class Header extends Component {
  private menu: Menu;

  private logo: HTMLElement;

  private userView: UserView;

  constructor() {
    super('header', ['header']);
    this.menu = new Menu('nav', ['menu']);
    this.container.innerHTML = '<div class="header__fixed"><div class ="header__wrapper"></div></div>';
    this.logo = this.renderLogo();
    this.userView = new UserView();
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
    headerWrapper.append(this.menu.render());
    headerWrapper.append(this.userView.render());
    return this.container;
  }
}
