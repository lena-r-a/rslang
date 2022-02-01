'use strict';

import { Page } from '../../core/templates/page';

export class MainPage extends Page {
  static TextObject = {
    MainTitle: 'MainPage',
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const title = this.createHeaderTitle(MainPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}
