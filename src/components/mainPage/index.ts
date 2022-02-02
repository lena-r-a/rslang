'use strict';

import { Page } from '../../core/templates/page';
import { Masthead } from './masthead';
import { AppDescription } from './appDescription';

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

  private renderAppDescription() {
    const appDescription = new AppDescription('section', ['MainPage__appDescription']).render();
    return appDescription;
  }

  render() {
    const title = this.createHeaderTitle(MainPage.TextObject.MainTitle);
    title.classList.add('visually-hidden');
    this.container.append(title);
    this.container.append(this.renderMasthead());
    this.container.append(this.renderAppDescription());
    return this.container;
  }
}
