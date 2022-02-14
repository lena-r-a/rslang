import './wordsContainer.scss';
import { Component } from '../../../core/templates/components';
import { WordItem } from '../wordItem';
import { IWord } from '../../../services/WordsService';
import { wordService } from '../../../services/WordsService';
import { WordState } from '../../../RSLangSS';
import { IUserWordsResponse, userWordsService } from '../../../services/UserWordsService';
import { logInData } from '../../../states/logInData';
import { Preloader } from '../../../common/preloader';

export class WordContainer extends Component {
  wordsList: IWord[] | undefined;

  constructor() {
    super('section', ['elbook__words-container']);
    this.wordsList = [];
    this.container.style.backgroundColor = WordState.BG;
  }

  public async renderWordList(page: number, group: number): Promise<void> {
    this.container.innerHTML = '';
    WordState.VOCABULARY = false;
    WordState.isStudiedPage = true;
    Preloader.showPreloader();
    this.wordsList = await wordService.getWords(page, group);
    if (this.wordsList) {
      let userWords: IUserWordsResponse[] | undefined;
      if (logInData.isAutorizated) {
        userWords = await userWordsService.getUserWords(logInData.userId!, logInData.token!);
      }
      this.wordsList.forEach((el) => {
        const cardItem = new WordItem(el);
        cardItem.render();
        if (userWords) {
          const word = userWords.find((wordEl) => wordEl.wordId == el.id);
          if (word) {
            cardItem.container.classList.add(word.difficulty);
            cardItem.complicatedWord.innerHTML = word.difficulty == 'hard' ? 'Удалить из сложных' : 'Добвить в сложные';
            cardItem.studiedWord.innerHTML = word.difficulty == 'easy' ? 'Удалить из изученных' : 'Добвить в изученные';
          }
        }
        if (!cardItem.container.classList.contains('hard') && !cardItem.container.classList.contains('easy')) {
          WordState.isStudiedPage = false;
        }
        this.container.append(cardItem.container);
      });
      Preloader.hidePreloader();
      if (WordState.isStudiedPage) {
        document.querySelector('.page-navigation__current')?.classList.add('studied-page');
        this.container.style.border = '2px solid green';
        document.querySelectorAll('.game-button').forEach((el) => {
          el.setAttribute('disabled', 'true');
        });
      } else {
        document.querySelector('.page-navigation__current')?.classList.remove('studied-page');
        this.container.style.border = 'none';
        document.querySelectorAll('.game-button').forEach((el) => {
          el.removeAttribute('disabled');
        });
      }
    }
  }
}
