'use strict';

export abstract class Page {
  public container: HTMLElement;

  static TextObject = {};

  constructor(id: string) {
    this.container = document.createElement('section');
    this.container.id = id;
  }

  protected createHeaderTitle(text: string) {
    const headerTitle = document.createElement('h2');
    headerTitle.innerText = text;
    return headerTitle;
  }

  render() {
    return this.container;
  }
}
