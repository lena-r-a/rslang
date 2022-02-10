'use strict';
import { Game } from '../Game';
import { IWord } from '../../../services/WordsService';

export class GameSprintPage extends Game {
  constructor(id: string, data?: IWord[]){
    const TITLE = `GameSprintPage`;
    super(id, TITLE, data);
  }
  startGame(items: IWord[]): void {
    
  }
}
