import { Component } from '../../core/templates/components';
import './preloader.scss';

export class Preloader extends Component {
  constructor() {
    super('div');
    this.container.id = 'preloader';
    this.container.innerHTML = `<div id="floatingCirclesG">
    <div class="f_circleG" id="frotateG_01"></div>
    <div class="f_circleG" id="frotateG_02"></div>
    <div class="f_circleG" id="frotateG_03"></div>
    <div class="f_circleG" id="frotateG_04"></div>
    <div class="f_circleG" id="frotateG_05"></div>
    <div class="f_circleG" id="frotateG_06"></div>
    <div class="f_circleG" id="frotateG_07"></div>
    <div class="f_circleG" id="frotateG_08"></div>
  </div>`;
  }

  static enablePreloader() {
    window.addEventListener('load', () => {
      const preloader = document.getElementById('preloader') as HTMLElement;
      preloader.style.display = 'none';
    });
  }

  static showPreloader() {
    const preloader = document.getElementById('preloader') as HTMLElement;
    preloader.style.display = 'flex';
  }

  static hidePreloader() {
    const preloader = document.getElementById('preloader') as HTMLElement;
    preloader.style.display = 'none';
  }

  render() {
    return this.container;
  }
}
