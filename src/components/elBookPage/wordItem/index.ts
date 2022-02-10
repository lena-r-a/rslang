import './wordItem.scss';
import { Component } from '../../../core/templates/components';
import { IWord } from '../../../services/WordsService';
const URL = 'https://rslang-js.herokuapp.com/';
let isPlay = false;

export class WordItem extends Component {
  word: IWord;

  buttonsWrapper: HTMLElement;

  studiedWord: HTMLElement;

  complicatedWord: HTMLElement;

  constructor(word: IWord) {
    super('div', ['elbook__word-item']);
    this.word = word;
    this.buttonsWrapper = document.createElement('div');
    this.container.append(this.buttonsWrapper);
    this.studiedWord = document.createElement('button');
    this.complicatedWord = document.createElement('button');
  }

  private renderWordButtons(): HTMLElement {
    this.buttonsWrapper.classList.add('word-item__buttons');
    this.studiedWord.textContent = 'Добаваить в изученные';
    this.studiedWord.classList.add('add-to-studied');
    this.complicatedWord.textContent = 'Добавить в сложные';
    this.complicatedWord.classList.add('add-to-complicated');
    this.buttonsWrapper.append(this.complicatedWord);
    this.buttonsWrapper.append(this.studiedWord);
    this.studiedWord.addEventListener('click', (e) => this.addToStudiedWords(e));
    this.complicatedWord.addEventListener('click', (e) => this.addToComplicatedWords(e));
    return this.buttonsWrapper;
  }

  private renderImage(): HTMLElement {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('word-item__image');
    const image = new Image();
    image.src = `${URL}${this.word.image}`;
    image.onload = () => {
      imageContainer.style.backgroundImage = `url(${URL}${this.word.image})`;
    };
    return imageContainer;
  }

  private renderAudio(): HTMLElement {
    const audioWrapper = document.createElement('button');
    audioWrapper.classList.add('audio-btn');
    audioWrapper.style.backgroundImage = 'url("../../../assets/images/sound.svg")';
    audioWrapper.addEventListener('click', () => this.playAudio());
    return audioWrapper;
  }

  private playAudio(): void {
    if (!isPlay) {
      isPlay = true;
      let audio = new Audio(`${URL}${this.word.audio}`);
      audio.play();
      audio.onended = () => {
        audio = new Audio(`${URL}${this.word.audioMeaning}`);
        audio.play();
        audio.onended = () => {
          audio = new Audio(`${URL}${this.word.audioExample}`);
          audio.play();
          audio.onended = () => (isPlay = false);
        };
      };
    }
  }

  private renderWordDescription(): HTMLElement {
    const descriptionContainer = document.createElement('div');
    descriptionContainer.innerHTML = `
      <p class = "word">
        <span>✧ ${this.word.word} - <span>
        <span>${this.word.transcription} - <span>
        <span>${this.word.wordTranslate}<span>
      </p>
      <h4>Значение:</h4>
      <p>${this.word.textMeaning}</p>
      <h4>Пример:</h4>
      <p>${this.word.textExample}</p>
    `;
    descriptionContainer.append(this.renderAudio());
    return descriptionContainer;
  }

  addToStudiedWords(e: Event): void {
    const target = e.currentTarget as HTMLElement;
    if (this.container.classList.contains('studied')) {
      this.container.classList.remove('studied');
      target.textContent = 'Добаваить в изученные';
    } else {
      this.container.classList.add('studied');
      target.textContent = 'Удалить из изученных';
      this.container.classList.remove('complicated');
      this.complicatedWord.textContent = 'Добавить в сложные';
    }
  }

  addToComplicatedWords(e: Event) {
    const target = e.currentTarget as HTMLElement;
    if (this.container.classList.contains('complicated')) {
      this.container.classList.remove('complicated');
      target.textContent = 'Добавить в сложные';
    } else {
      this.container.classList.add('complicated');
      target.textContent = 'Удалить из сложных';
      this.container.classList.remove('studied');
      this.studiedWord.textContent = 'Добаваить в изученные';
    }
  }

  private renderWordProgress(): HTMLElement {
    const progressContainer = document.createElement('div');
    progressContainer.innerHTML = `
      <p>Статистика слова: Угадано 1 раз Ошибка: 1 раз</p>
    `;
    return progressContainer;
  }

  render(): HTMLElement {
    this.container.append(this.renderImage());
    const rightContainer = document.createElement('div');
    rightContainer.classList.add('word-item__right');
    rightContainer.append(this.renderWordDescription());
    rightContainer.append(this.renderWordButtons());
    this.container.append(rightContainer);
    return this.container;
  }
}
