import { Component } from '../../../core/templates/components';

export class SmallGamesMenu extends Component {
  sprint: HTMLElement;

  audioChallenge: HTMLElement;

  constructor() {
    super('div', ['games-adaptive']);
    this.sprint = document.createElement('div');
    this.audioChallenge = document.createElement('div');
    this.container.append(this.sprint);
    this.container.append(this.audioChallenge);
    this.addClasses();
  }

  private addClasses() {
    this.sprint.classList.add('small-sprint');
    this.audioChallenge.classList.add('small-challenge');
  }
}
