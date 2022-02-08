import { Component } from '../../../../core/templates/components';
import './groupNavItem.scss';
import { WordState } from '..';

export class GroupNavitem extends Component {
  private title: string;

  private range: string;

  private level: string;

  constructor(title: string, range: string, level: string) {
    super('button', ['elBool__nav-item', 'unactive']);
    this.title = title;
    this.range = range;
    this.level = level;
    this.container.innerHTML = `
      <div class = "nav-item__left">
        <p>${this.title}</p>
        <span>${this.range}</span>
      </div>
      <div class = "nav-item__right">${this.level}</div>
    `;
    this.container.addEventListener('mouseover', () => {
      this.container.classList.remove('unactive');
    });
    this.container.addEventListener('mouseout', () => {
      if (WordState.GROUP !== Number(this.container.dataset.id)) {
        this.container.classList.add('unactive');
      }
    });
  }

  render(): HTMLElement {
    return this.container;
  }
}
