'use strict';

import { Page } from '../../core/templates/page';
import { GroupNavigation } from './groupNavigation';
import { WordContainer } from './wordsContainer';

export class ElBookPage extends Page {
  static TextObject = {
    MainTitle: 'ElBookPage',
  };

  constructor(id: string) {
    super(id);
  }

  renderNavigation() {
    return new GroupNavigation().render();
  }

  renderWordsContainer() {
    return new WordContainer().render();
  }

  render() {
    const title = this.createHeaderTitle(ElBookPage.TextObject.MainTitle);
    title.classList.add('visually-hidden');
    this.container.append(title);
    this.container.append(this.renderNavigation());
    this.container.append(this.renderWordsContainer());
    return this.container;
  }
}
