import './wordsContainer.scss';
import { Component } from '../../../core/templates/components';
import { WordItem } from '../wordItem';
import { IWord } from '../../../services/WordsService';
import { wordService } from '../../../services/WordsService';

const wordMock: IWord = {
  id: 'fdf',
  group: 1,
  image: 'https://koreanbinge.files.wordpress.com/2022/01/ourbelovedsummer4types.jpg?w=1024&h=496&crop=1',
  word: 'word',
  page: 1,
  audio: 'https://raw.githubusercontent.com/lena-r-a/christmas/master/asset/audio/audio.mp3',
  audioMeaning: 'dkfjsnkdjnksjnvdksjn',
  audioExample: 'njhnjnjh',
  textMeaning: 'fgdfg',
  textExample: 'dfdsfds',
  transcription: 'ffdsf',
  wordTranslate: 'слово',
  textMeaningTranslate: 'fdsfsdf',
  textExampleTranslate: 'fdsfsdfs',
};

export class WordContainer extends Component {
  wordsList: IWord[] | undefined;

  constructor() {
    super('section', ['elbook__words-container']);
    this.wordsList = [];
  }

  public async renderWordList(): Promise<void> {
    this.container.innerHTML = '';
    this.wordsList = await wordService.getWords(0, 0);
    if (this.wordsList) {
      this.wordsList.forEach((el) => {
        const cardItem = new WordItem(el).render();
        this.container.append(cardItem);
      });
    }
  }

  render(): HTMLElement {
    this.renderWordList();
    return this.container;
  }
}
