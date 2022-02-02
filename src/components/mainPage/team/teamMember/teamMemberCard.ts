import { Component } from '../../../../core/templates/components';
import { TeamMemberData } from './types';
import './teamMemberCard.scss';

export class TeamMemberCard extends Component {
  private dataObj: TeamMemberData;

  constructor(className: string[], dataObj: TeamMemberData) {
    super('div', className);
    this.dataObj = dataObj;
    this.container.classList.add('teamMember');
    this.container.innerHTML = `<img class="teamMember__img" src=${this.dataObj.img} alt="photo ${this.dataObj.name}"><a class="teamMember__gitHub" href="${this.dataObj.gitHub}" target="_blank"></a><div class="teamMember__text"><h3 class="teamMember__name">${this.dataObj.name}</h3><p class="teamMember__position">${this.dataObj.position}</p><p class="teamMember__info">${this.dataObj.role}</p></div>`;
  }

  render() {
    return this.container;
  }
}
