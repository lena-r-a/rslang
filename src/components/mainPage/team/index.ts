import { Component } from '../../../core/templates/components';
import { TeamMemberCard } from './teamMember/teamMemberCard';
import { TeamMemberData } from './teamMember/types';
import './team.scss';

export const teamMembersData: TeamMemberData[] = [
  {
    img: '../../../assets/images/team1.jpg',
    name: 'Татьяна Болтрушевич',
    position: 'Разработчик',
    role: 'Реализация главной страницы',
    gitHub: 'https://github.com/Tatsiana-Vaitovich',
    nicName: 'Tatsiana-vaitovich',
  },
  {
    img: '../../../assets/images/team2.jpg',
    name: 'Богдан Палица',
    position: 'Разработчик',
    role: 'Реализация',
    gitHub: 'https://github.com/whispermind',
    nicName: 'Whispermind',
  },
  {
    img: '../../../assets/images/team3.jpg',
    name: 'Елена Ружанкова',
    position: 'Разработчик',
    role: 'Реализация электронного учебника, backEnd',
    gitHub: 'https://github.com/lena-r-a',
    nicName: 'Lena_r_a',
  },
];

export class Team extends Component {
  constructor(tagName: string, className: string[]) {
    super(tagName, className);
    this.container.classList.add('team');
  }

  render() {
    teamMembersData.forEach((el) => {
      const card = new TeamMemberCard(['team__member'], el).render();
      this.container.append(card);
    });
    return this.container;
  }
}
