'use strict';

import { Page } from '../../core/templates/page';

export class ElBookPage extends Page {
  static TextObject = {
    MainTitle: 'ElBookPage',
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const title = this.createHeaderTitle(ElBookPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}
