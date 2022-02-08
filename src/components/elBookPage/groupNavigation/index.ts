import { Component } from '../../../core/templates/components';
import { GroupNavitem } from './groupNavItem';
import './groupNavigation.scss';

export const WordState = {
  PAGE: 0,
  GROUP: 0,
};

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
  navItems: HTMLElement[];

  constructor() {
    super('div', ['el-book__nav']);
    this.navItems = [];
    this.render();
  }

  private changeGroup(e: Event) {
    const target = e.currentTarget as HTMLElement;
    WordState.GROUP = Number(target.dataset.id);
    document.querySelectorAll('.elBool__nav-item').forEach((el) => {
      el.classList.add('unactive');
    });
    target.classList.remove('unactive');
  }

  render() {
    navItemsText.forEach((el, index) => {
      const navItem = new GroupNavitem(el.title, el.range, el.level).render();
      navItem.classList.add(el.color);
      navItem.dataset.id = String(index);
      if (index == WordState.GROUP) {
        navItem.classList.remove('unactive');
      }
      navItem.addEventListener('click', (e) => this.changeGroup(e));
      this.navItems.push(navItem);
      this.container.append(navItem);
    });
  }
}
