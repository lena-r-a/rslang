'use strict';

import { Page } from '../../core/templates/page';
import { GroupNavigation } from './groupNavigation';
import { WordContainer } from './wordsContainer';
import { WordState } from './groupNavigation';

export class ElBookPage extends Page {
  static TextObject = {
    MainTitle: 'ElBookPage',
  };

  groupNavigation: GroupNavigation;

  wordsContainer: WordContainer;

  constructor(id: string) {
    super(id);
    this.groupNavigation = new GroupNavigation();
    this.wordsContainer = new WordContainer();
    this.wordsContainer.renderWordList(WordState.PAGE, WordState.GROUP);
    this.groupNavigation.navItems.forEach((el) => {
      el.addEventListener('click', () => {
        WordState.GROUP = Number(el.dataset.id);
        this.wordsContainer.renderWordList(WordState.PAGE, WordState.GROUP);
      });
    });
  }

  render() {
    const title = this.createHeaderTitle(ElBookPage.TextObject.MainTitle);
    title.classList.add('visually-hidden');
    this.container.append(title);
    this.container.append(this.groupNavigation.container);
    this.container.append(this.wordsContainer.container);
    return this.container;
  }
}
