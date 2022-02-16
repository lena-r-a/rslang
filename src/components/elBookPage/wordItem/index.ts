import './wordItem.scss';
import { Component } from '../../../core/templates/components';
import { IWord } from '../../../services/WordsService';
import { logInData } from '../../../states/logInData';
import { INewWordRequest, userWordsService } from '../../../services/UserWordsService';
import { filterWordService } from '../../../services/FilterWordsService';
import { WordState } from '../../../RSLangSS';

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
    this.buttonsWrapper.append(this.complicatedWord);
    this.buttonsWrapper.append(this.studiedWord);
    if (!logInData.isAutorizated) {
      this.buttonsWrapper.classList.add('visually-hidden');
    }
  }

  private renderWordButtons(): HTMLElement {
    this.buttonsWrapper.classList.add('word-item__buttons');
    this.studiedWord.textContent = 'Добаваить в изученные';
    this.studiedWord.classList.add('add-to-easy');
    this.complicatedWord.textContent = 'Добавить в сложные';
    this.complicatedWord.classList.add('add-to-hard');
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
      window.addEventListener('hashchange', () => {
        audio.pause();
        isPlay = false;
      });
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
    return descriptionContainer;
  }

  async addToStudiedWords(e: Event) {
    const target = e.currentTarget as HTMLElement;
    const thisID = this.word.id || this.word._id;
    const result = await filterWordService.getWordByID(logInData.userId!, thisID!, logInData.token!);
    const data: INewWordRequest = {
      userId: logInData.userId!,
      wordId: thisID!,
      word: {
        difficulty: 'normal',
      },
    };
    if (!result[0].userWord) {
      this.container.classList.add('easy');
      target.textContent = 'Удалить из изученных';
      this.container.classList.remove('hard');
      this.complicatedWord.textContent = 'Добавить в сложные';
      data.word!.difficulty = 'easy';
      await userWordsService.createUserWord(data, logInData.token!);
    } else {
      if (result[0].userWord && result[0].userWord.optional) {
        data.word!.optional = result[0].userWord.optional;
      }
      if (result[0].userWord.difficulty == 'easy') {
        this.container.classList.remove('easy');
        target.textContent = 'Добаваить в изученные';
        await userWordsService.editUserWord(data, logInData.token!);
      } else {
        this.container.classList.add('easy');
        target.textContent = 'Удалить из изученных';
        this.container.classList.remove('hard');
        this.complicatedWord.textContent = 'Добавить в сложные';
        data.word!.difficulty = 'easy';
        await userWordsService.editUserWord(data, logInData.token!);
      }
    }
    this.checkStudiedPage();
  }

  async addToComplicatedWords(e: Event) {
    const target = e.currentTarget as HTMLElement;
    const thisID = this.word.id || this.word._id;
    const result = await filterWordService.getWordByID(logInData.userId!, thisID!, logInData.token!);
    const data: INewWordRequest = {
      userId: logInData.userId!,
      wordId: thisID!,
      word: {
        difficulty: 'normal',
      },
    };
    if (!result[0].userWord) {
      this.container.classList.add('hard');
      target.textContent = 'Удалить из сложных';
      this.container.classList.remove('easy');
      this.studiedWord.textContent = 'Добаваить в изученные';
      data.word!.difficulty = 'hard';
      await userWordsService.createUserWord(data, logInData.token!);
    } else {
      if (result[0].userWord && result[0].userWord.optional) {
        data.word!.optional = result[0].userWord.optional;
      }
      if (result[0].userWord && result[0].userWord.difficulty == 'hard') {
        this.container.classList.remove('hard');
        target.textContent = 'Добавить в сложные';
        await userWordsService.editUserWord(data, logInData.token!);
      } else {
        this.container.classList.add('hard');
        target.textContent = 'Удалить из сложных';
        this.container.classList.remove('easy');
        this.studiedWord.textContent = 'Добаваить в изученные';
        data.word!.difficulty = 'hard';
        await userWordsService.editUserWord(data, logInData.token!);
      }
    }
    this.checkStudiedPage();
  }

  private checkStudiedPage() {
    WordState.isStudiedPage = true;
    document.querySelectorAll('.elbook__word-item').forEach((el) => {
      if (!el.classList.contains('hard') && !el.classList.contains('easy')) {
        WordState.isStudiedPage = false;
      }
    });
    this.toggleStylesForStudiedPage();
  }

  toggleStylesForStudiedPage() {
    const container = document.querySelector('.elbook__words-container') as HTMLElement;
    if (WordState.isStudiedPage) {
      document.querySelector('.page-navigation__current')?.classList.add('studied-page');
      container.style.border = '2px solid green';
      document.querySelectorAll('.game-button').forEach((el) => {
        el.setAttribute('disabled', 'true');
      });
    } else {
      document.querySelector('.page-navigation__current')?.classList.remove('studied-page');
      container.style.border = 'none';
      document.querySelectorAll('.game-button').forEach((el) => {
        el.removeAttribute('disabled');
      });
    }
  }

  private renderWordProgress(): HTMLElement {
    const progressContainer = document.createElement('div');
    if (!logInData.isAutorizated) {
      progressContainer.classList.add('dislplaynone');
    }
    progressContainer.innerHTML = `
      <p>Статистика слова: Угадано: <span>1</span> / Ошибка: <span>1</span></p>
    `;
    return progressContainer;
  }

  render(): HTMLElement {
    this.container.append(this.renderImage());
    const rightContainer = document.createElement('div');
    rightContainer.classList.add('word-item__right');
    rightContainer.append(this.renderWordDescription());
    rightContainer.append(this.renderWordButtons());
    rightContainer.append(this.renderAudio());
    this.container.append(rightContainer);
    rightContainer.append(this.renderWordProgress());
    return this.container;
  }
}
