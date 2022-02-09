import { Page } from '../../core/templates/page';
import { Masthead } from './masthead';
import { AppDescription } from './appDescription';
import { Team } from './team';
import { logInData } from '../../states/logInData';

export class MainPage extends Page {
  static TextObject = {
    MainTitle: 'MainPage',
  };

  constructor(id: string) {
    super(id);
  }

  private renderMasthead() {
    return new Masthead('section', ['mainPage__masthead']).render();
  }

  private renderAppDescription() {
    return new AppDescription('section', ['mainPage__appDescription']).render(logInData.isAutorizated);
  }

  private renderTeam() {
    return new Team('section', ['mainPage__team']).render();
  }

  public render() {
    const title = this.createHeaderTitle(MainPage.TextObject.MainTitle);
    title.classList.add('visually-hidden');
    this.container.append(title);
    this.container.append(this.renderMasthead());
    this.container.append(this.renderAppDescription());
    this.container.append(this.renderTeam());
    return this.container;
  }
}
