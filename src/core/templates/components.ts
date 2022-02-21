'use strict';

export class Component {
  readonly container: HTMLElement;

  constructor(tagName: string, className?: string[]) {
    this.container = document.createElement(tagName);
    className?.forEach((el) => {
      this.container.classList.add(el);
    });
  }
}
