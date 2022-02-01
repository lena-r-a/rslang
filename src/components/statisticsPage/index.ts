'use strict';

import { Page } from '../../core/templates/page';

export class StatisticsPage extends Page {
  static TextObject = {
    MainTitle: 'StatisticsPage',
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const title = this.createHeaderTitle(StatisticsPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}
