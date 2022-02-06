'use strict';

import { Page } from '../../../core/templates/page';

export class GameSprintPage extends Page {
  static TextObject = {
    MainTitle: 'GameSprintPage',
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const title = this.createHeaderTitle(GameSprintPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}
