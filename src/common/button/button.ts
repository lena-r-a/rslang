import './button.scss';
import { Component } from '../../core/templates/components';

export class Button extends Component {
  constructor(tagName: string, className: string[], title: string) {
    super(tagName, className);
    this.container.textContent = title;
    this.container.classList.add('btn');
  }

  public onClick(cb: () => void): void {
    this.container.addEventListener('click', (event: Event) => {
      event.preventDefault();
      cb();
    });
  }

  rendor() {
    return this.container;
  }
}
