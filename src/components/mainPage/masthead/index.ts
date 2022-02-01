import { Component } from '../../../core/templates/components';
import { Button } from '../../../common/button/button';
import './masthead.scss';

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
    const btn = new Button('a', ['masthead__btn'], 'зарегистрироваться').rendor();
    return btn;
    //todo добавить onclick
  }

  render() {
    const btn = this.renderBtn();
    this.container.querySelector('.masthead__wrapper')?.append(btn);
    console.log(this.container);
    return this.container;
  }
}
