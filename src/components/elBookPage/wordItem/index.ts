import './wordItem.scss';
import { Component } from '../../../core/templates/components';
import { IWord } from '../../../services/WordsService';

const URL = 'https://rslang-js.herokuapp.com/';

export class WordItem extends Component {
  word: IWord;

  constructor(word: IWord) {
    super('div', ['elbook__word-item']);
    this.word = word;
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
    let audio = new Audio(`${URL}${this.word.audio}`);
    audio.play();
    audio.onended = () => {
      audio = new Audio(`${URL}${this.word.audioMeaning}`);
      audio.play();
      audio.onended = () => {
        audio = new Audio(`${URL}${this.word.audioExample}`);
        audio.play();
      };
    };
  }

  private renderWordDescription(): HTMLElement {
    const descriptionContainer = document.createElement('div');
    descriptionContainer.innerHTML = `
      <p class = "word">
        <span>${this.word.word} - <span>
        <span>[${this.word.transcription}] - <span>
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

  private renderWordButtons(): HTMLElement {
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.classList.add('word-item__buttons');
    const studiedWord = document.createElement('button');
    studiedWord.textContent = 'Изученное слово';
    const complicatedWord = document.createElement('button');
    complicatedWord.textContent = 'Сложное слово';
    buttonsWrapper.append(complicatedWord);
    buttonsWrapper.append(studiedWord);
    return buttonsWrapper;
  }

  addToStudiedWords() {
    this.container.classList.add('studies');
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
