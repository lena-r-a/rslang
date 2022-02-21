import { Component } from '../../../core/templates/components';
import { WordState } from '../../../RSLangSS';

export class SmallGamesMenu extends Component {
  sprint: HTMLElement;

  audioChallenge: HTMLElement;

  constructor() {
    super('div', ['games-adaptive']);
    this.sprint = document.createElement('a');
    this.audioChallenge = document.createElement('a');
    this.container.append(this.sprint);
    this.container.append(this.audioChallenge);
    this.addClasses();
    this.addLinks();
  }

  private addClasses() {
    this.sprint.classList.add('small-sprint');
    this.audioChallenge.classList.add('small-challenge');
  }

  private addLinks() {
    this.audioChallenge.setAttribute('href', '#gameChallengePage');
    this.sprint.setAttribute('href', '#gameSprintPage');
    this.sprint.addEventListener('click', () => {
      WordState.isFromBookPage = true;
    });
    this.audioChallenge.addEventListener('click', () => {
      WordState.isFromBookPage = true;
    });
  }
}
