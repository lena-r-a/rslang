'use strict';

import { Page } from '../../core/templates/page';

export class AutorizationPage extends Page {
  static TextObject = {
    MainTitle: 'AutorizationPage',
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const title = this.createHeaderTitle(AutorizationPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}
