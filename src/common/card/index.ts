import { Component } from '../../core/templates/components';
import { CardType } from './types';
import './card.scss';

export class Card extends Component {
  private dataObj: CardType;

  constructor(dataObj: CardType) {
    super('a', ['card']);
    this.dataObj = dataObj;
    this.container.innerHTML = `<div class="card__img"><img src=${this.dataObj.img}></div><div class="card__thumb"><h3 class="card__thumb-caption">${this.dataObj.caption}</h3><p class="card__thumb-info">${this.dataObj.text}</p></div>`;
  }

  render() {
    return this.container;
  }
}
