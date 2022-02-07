import { PageIds } from '../../../app';
import { Component } from '../../../core/templates/components';
import { RSLangLS } from '../../../RSLangLS';
import { Button } from '../../button';
import './userView.scss';

export class UserView extends Component {
  private buttonExit: Button;

  private buttonInput: HTMLLinkElement;

  constructor() {
    super('div', ['userView']);
    this.container.innerHTML =
      '<div class="userView__wrap"><img src="../../../assets/images/user-icon.svg" class="userView__img"></div><p class="userView__greeting">User</p>';
    this.buttonExit = new Button('button', 'Выход', ['userView__btn', 'userView__btn--exit']);
    this.buttonExit.onClick(RSLangLS.removeUserData);
    this.buttonInput = new Button('a', 'Вход', ['userView__btn', 'userView__btn--input']).rendor() as HTMLLinkElement;
    this.buttonInput.href = `#${PageIds.autorizationPage}`;
  }

  render() {
    const wrap = this.container.querySelector('.userView__wrap') as HTMLElement;
    wrap.append(this.buttonInput);
    wrap.append(this.buttonExit.rendor());
    return this.container;
  }
}
