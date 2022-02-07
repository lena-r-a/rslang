import './wordsContainer.scss';
import { Component } from '../../../core/templates/components';
import { WordItem } from '../wordItem';
import { IWord } from '../../../services/WordsService';

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
  constructor() {
    super('section', ['elbook__words-container']);
  }

  render(): HTMLElement {
    this.container.append(new WordItem(wordMock).render());
    return this.container;
  }
}
