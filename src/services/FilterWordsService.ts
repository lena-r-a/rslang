import { IWord } from './WordsService';

export interface IFilter {
  optional: Record<string, unknown>;
}

export class FilterWordsService {
  private baseURL = 'https://rslang-js.herokuapp.com';

  public async getAggregatedWords(
    userId: string,
    token: string,
    group: number,
    page: number,
    wordsPerPage: number,
    filter: IFilter,
  ): Promise<IWord[] | undefined> {
    const fullURL = `${this.baseURL}/users/${userId}/aggregatedWords?group=${group}}&page=${page}&wordsPerPage=${wordsPerPage}&
    filter=${JSON.stringify(filter)}`;
    try {
      const response = await fetch(fullURL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const result = await response.json();
      return result;
    } catch {
      () => console.log('Bad request');
    }
  }

  public async getWordByID(userId: string, wordId: string, token: string): Promise<IWord | undefined> {
    const fullURL = `${this.baseURL}/users/${userId}/aggregatedWords/${wordId}`;
    try {
      const response = await fetch(fullURL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const result = await response.json();
      return result;
    } catch {
      () => console.log('Bad request');
    }
  }
}
