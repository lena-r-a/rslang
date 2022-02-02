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
    nicName: 't_a_b',
  },
  {
    img: '../../../assets/images/team2.jpg',
    name: 'Богдан Палица',
    position: 'Разработчик',
    role: 'Реализация',
    gitHub: 'https://github.com/whispermind',
    nicName: 'whispermind',
  },
  {
    img: '../../../assets/images/team3.jpg',
    name: 'Елена Ружанкова',
    position: 'Разработчик',
    role: 'Реализация электронного учебника, backEnd',
    gitHub: 'https://github.com/lena-r-a',
    nicName: 'lena_r_a',
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
