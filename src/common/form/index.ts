import { Component } from '../../core/templates/components';
import { Button } from '../button';
import { Input } from '../input';
import { Attr } from '../input';

export abstract class Form extends Component {
  constructor(className: string[]) {
    super('form', className);
  }

  static renderInput(attr: Attr) {
    const input = new Input(attr).render();
    return input as HTMLInputElement;
  }

  static renderButton(className: string[], text: string) {
    const btn = new Button('a', text, className).rendor();
    return btn as HTMLButtonElement;
  }
}
