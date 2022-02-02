import { Component } from '../../../core/templates/components';
import { Card } from '../../../common/card';
import { CardType } from '../../../common/card/types';
import './appDescription.scss';

const cardsContent: CardType[] = [
  {
    img: '../../../assets/images/1.png',
    text:
      'Изучай новые слова от простого к сложному! Ты можешь пометить сложные слова и удалить слово из раздела как изученное! Выучил все слова в разделе? Переходи к следующему!',
    caption: 'Учебник',
  },
  {
    img: '../../../assets/images/2.png',
    text: 'Словарь содержит 4000 часто встречающихся слов. Ичи их в своем темпе!',
    caption: 'Словарь',
  },
  {
    img: '../../../assets/images/7.png',
    text: 'Скучно просто повторять слова по учебнику? Переходи в раздел Игры!',
    caption: 'Игры',
  },
  {
    img: '../../../assets/images/5.png',
    text: 'Регистрируйся и получай подробную статистику своих достижений!',
    caption: 'Статистика',
  },
];

export class AppDescription extends Component {
  constructor(tagName: string, className: string[]) {
    super(tagName, className);
    this.container.classList.add('appDescription');
    this.container.innerHTML = '<h3 class="visually-hidden>Application description</h3>';
  }

  // private renderCards() {
  //   const cards = document.createElement('div');
  //   cardsContent.forEach((el) => {
  //     const card = new Card(el).render();
  //     cards.append(card);
  //   });
  //   return cards;
  // }

  render() {
    cardsContent.forEach((el) => {
      const card = new Card(el).render();
      this.container.append(card);
    });
    return this.container;
  }
}
