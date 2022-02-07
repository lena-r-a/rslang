import { Component } from '../../../core/templates/components';
import { GroupNavitem } from './groupNavItem';
import './groupNavigation.scss';

const navItemsText = [
  {
    title: 'Easy',
    range: '1-600',
    level: 'A-1',
    color: 'yellow',
  },
  {
    title: 'Easy',
    range: '601-1200',
    level: 'A-2',
    color: 'green',
  },
  {
    title: 'Medium',
    range: '1201-1800',
    level: 'B-1',
    color: 'blue',
  },
  {
    title: 'Medium',
    range: '1801-2400',
    level: 'B-2',
    color: 'violet',
  },
  {
    title: 'Hard',
    range: '2401-3000',
    level: 'C-1',
    color: 'orange',
  },
  {
    title: 'Hard',
    range: '3001-3600 ',
    level: 'C-2',
    color: 'red',
  },
];

export class GroupNavigation extends Component {
  constructor() {
    super('div', ['el-book__nav']);
  }

  render(): HTMLElement {
    navItemsText.forEach((el) => {
      const navItem = new GroupNavitem(el.title, el.range, el.level).render();
      navItem.classList.add(el.color);
      this.container.append(navItem);
    });
    return this.container;
  }
}
