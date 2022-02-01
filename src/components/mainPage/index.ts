'use strict';

import { Page } from '../../core/templates/page';
import { Masthead } from '../../common/header/masthead';

export class MainPage extends Page {
  static TextObject = {
    MainTitle: 'MainPage',
  };

  constructor(id: string) {
    super(id);
  }

  private renderMasthead() {
    const masthead = new Masthead('section', ['mainPage__masthead']).render();
    return masthead;
  }

  render() {
    // const title = this.createHeaderTitle(MainPage.TextObject.MainTitle);
    // this.container.append(title);
    this.container.append(this.renderMasthead());
    return this.container;
  }
}
