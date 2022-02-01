'use strict';

import { Page } from '../../../core/templates/page';

export class GameChallengePage extends Page {
  static TextObject = {
    MainTitle: 'GameChallengePage',
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const title = this.createHeaderTitle(GameChallengePage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}
