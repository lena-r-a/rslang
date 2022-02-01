'use strict';

import { Page } from '../../core/templates/page';

export class GamesPage extends Page {
  static TextObject = {
    MainTitle: 'GamesPage',
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const title = this.createHeaderTitle(GamesPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}
