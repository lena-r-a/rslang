//import './button.scss';
import { Component } from '../../core/templates/components';

export class Button extends Component {
  public title: string;

  constructor(tagName: string, title: string, className?: string[]) {
    super(tagName, className);
    this.title = title;
    this.container.textContent = title;
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
