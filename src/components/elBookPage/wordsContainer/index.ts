import './wordsContainer.scss';
import { Component } from '../../../core/templates/components';
import { WordItem } from '../wordItem';
import { IWord } from '../../../services/WordsService';
import { wordService } from '../../../services/WordsService';
import { WordState } from '../groupNavigation';

export class WordContainer extends Component {
  wordsList: IWord[] | undefined;

  constructor() {
    super('section', ['elbook__words-container']);
    this.wordsList = [];
    this.container.style.backgroundColor = WordState.BG;
  }

  public async renderWordList(page: number, group: number): Promise<void> {
    this.container.innerHTML = '';
    this.wordsList = await wordService.getWords(page, group);
    if (this.wordsList) {
      this.wordsList.forEach((el) => {
        const cardItem = new WordItem(el).render();
        this.container.append(cardItem);
      });
    }
  }

  // render(): HTMLElement {
  //   this.renderWordList();
  //   return this.container;
  // }
}
