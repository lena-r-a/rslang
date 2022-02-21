import { Component } from '../../../core/templates/components';
import { GroupNavitem } from './groupNavItem';
import './groupNavigation.scss';
import { WordState } from '../../../RSLangSS';

const navItemsText = [
  {
    title: 'Easy',
    range: '1-600',
    level: 'A-1',
    color: 'yellow',
    data: '#e9e91dc4',
  },
  {
    title: 'Easy',
    range: '601-1200',
    level: 'A-2',
    color: 'green',
    data: '#1de979c4',
  },
  {
    title: 'Medium',
    range: '1201-1800',
    level: 'B-1',
    color: 'blue',
    data: '#157ddfc4',
  },
  {
    title: 'Medium',
    range: '1801-2400',
    level: 'B-2',
    color: 'violet',
    data: '#ec8eecc4',
  },
  {
    title: 'Hard',
    range: '2401-3000',
    level: 'C-1',
    color: 'orange',
    data: '#e9b31dc4',
  },
  {
    title: 'Hard',
    range: '3001-3600 ',
    level: 'C-2',
    color: 'red',
    data: '#e76868c4',
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
    WordState.PAGE = 0;
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
      navItem.dataset.color = el.data;
      this.navItems.push(navItem);
      this.container.append(navItem);
    });
  }
}
