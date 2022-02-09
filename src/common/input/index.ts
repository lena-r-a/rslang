import { Component } from '../../core/templates/components';
import { Attr } from '../types';
import './input.scss';

export class Input extends Component {
  constructor(attr: Attr) {
    super('input');
    if (attr && typeof attr === 'object') {
      Object.keys(attr).forEach((key: string) => {
        this.container.setAttribute(key, attr[key]);
      });
    }
    this.container.onfocus = () => {
      this.container.classList.add('input--focus');
    };

    this.container.onblur = () => {
      this.container.classList.remove('input--focus');
    };
  }

  public onInput(cb: (event: Event) => void): void {
    this.container.addEventListener('input', cb);
  }

  public getValue(): string {
    const value = this.container.getAttribute('value') as string;
    return value;
  }

  public setValue(value: string): void {
    this.container.setAttribute('value', value);
  }

  public render() {
    return this.container;
  }
}
