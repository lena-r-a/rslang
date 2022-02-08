import { RestService } from './RestService';

export interface IWord {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

class WordServise {
  restService: RestService;

  constructor() {
    this.restService = new RestService();
  }

  public async getWords(page: number, group: number): Promise<IWord[] | undefined> {
    const queryParams = {
      page: page,
      group: group,
    };
    try {
      const response = await this.restService.get('/words', queryParams);
      const result = await response.json();
      return result;
    } catch {
      () => console.log('Bad request');
    }
  }

  public async getWordByID(id: string): Promise<IWord | undefined> {
    try {
      const response = await this.restService.getById('/words', id);
      return await response.json();
    } catch {
      () => console.log('Bad request');
    }
  }
}

export const wordService = new WordServise();
