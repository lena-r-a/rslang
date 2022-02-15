import { Component } from '../../../core/templates/components';
import { Button } from '../../../common/button';
import { PageIds } from '../../../app';
import './masthead.scss';
import { logInData } from '../../../states/logInData';

const masheadInfo = {
  innerText: 'Учи английский играючи!',
};

export class Masthead extends Component {
  constructor(tagName: string, className: string[]) {
    super(tagName, className);
    this.container.classList.add('masthead');
    this.container.innerHTML = `<div class="masthead__wrapper"><h3 class="masthead__caption">Rs-lang</h3><p class="masthead__info">${masheadInfo.innerText}</p></div>`;
  }

  private renderBtn() {
    const btn = new Button('a', 'Вход', ['masthead__btn']).rendor();
    btn.setAttribute('href', `#${PageIds.autorizationPage}`);
    return btn;
  }

  private showBtn(btn: HTMLElement) {
    btn.style.display = 'block';
    this.container.style.paddingBottom = '150px';
    this.container.style.paddingTop = '150px';
  }

  public render() {
    const btn = this.renderBtn();
    this.container.querySelector('.masthead__wrapper')?.append(btn);
    if (logInData.isAutorizated) {
      this.showBtn(btn);
    }
    return this.container;
  }
}
