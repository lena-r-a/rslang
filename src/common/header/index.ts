'use strict';

import { Component } from '../../core/templates/components';
import { PageIds } from '../../app';

const Buttons = [
  {
    id: PageIds.mainPage,
    text: 'Main Page',
  },
  {
    id: PageIds.statisticsPage,
    text: 'Statistics',
  },
  {
    id: PageIds.autorizationPage,
    text: 'Autorization',
  },
  {
    id: PageIds.gameSprintPage,
    text: 'Game Sprint',
  },
  {
    id: PageIds.gameChallengePage,
    text: 'Game Challenge',
  },
];

export class Header extends Component {
  constructor(tagName: string, className: string) {
    super(tagName, className);
  }

  renderPageButtons() {
    const pageButtons = document.createElement('div');
    Buttons.forEach((btn) => {
      const buttonHTML = document.createElement('a');
      buttonHTML.href = `#${btn.id}`;
      buttonHTML.innerText = btn.text;
      buttonHTML.classList.add('btn');
      pageButtons.append(buttonHTML);
    });
    this.container.append(pageButtons);
  }

  render() {
    this.renderPageButtons();
    return this.container;
  }
}
