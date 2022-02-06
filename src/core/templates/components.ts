'use strict';

export abstract class Component {
  protected container: HTMLElement;

  constructor(tagName: string, className: string[]) {
    this.container = document.createElement(tagName);
    className.forEach((el) => {
      this.container.classList.add(el);
    });
  }
}
