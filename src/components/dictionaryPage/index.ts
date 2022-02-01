'use strict';

import { Page } from '../../core/templates/page';

export class DictionaryPage extends Page {
  static TextObject = {
    MainTitle: 'DictionaryPage',
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const title = this.createHeaderTitle(DictionaryPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}
