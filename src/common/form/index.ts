import { Component } from '../../core/templates/components';
import { Button } from '../button';
import { Input } from '../input';
import { Attr } from '../types';

export abstract class Form extends Component {
  constructor(attr?: Attr) {
    super('form');
    if (attr && typeof attr === 'object') {
      Object.keys(attr).forEach((key: string) => {
        this.container.setAttribute(key, attr[key]);
      });
    }
  }

  static renderInput(attr: Attr) {
    const input = new Input(attr).render();
    return input as HTMLInputElement;
  }

  static renderLink(className: string[], text: string) {
    const btn = new Button('a', text, className).rendor();
    return btn as HTMLLinkElement;
  }

  static renderButton(className: string[], text: string) {
    const btn = new Button('button', text, className).rendor();
    return btn as HTMLButtonElement;
  }
}
