import { IWord } from './WordsService';
import { IUserWord } from './UserWordsService';
import { refreshUserToken } from '../states/logInData';

export interface IAgregatedWord extends IWord {
  userWord: IUserWord;
}

export interface IAggr {
  paginatedResults: IAgregatedWord[];
  totalCount: [];
}

export class FilterWordsService {
  private baseURL = 'https://rslang-js.herokuapp.com';

  public async getAggregatedWords(
    userId: string,
    token: string,
    filter: string,
    wordsPerPage: number,
    group?: number,
    page?: number,
  ): Promise<IAggr[] | undefined> {
    const string = `${group ? 'group=' + group + '&' : ''}${page ? 'page=' + page + '&' : ''}${wordsPerPage ? 'wordsPerPage=' + wordsPerPage + '&' : ''}`;
    const fullURL = `${this.baseURL}/users/${userId}/aggregatedWords?${string}filter=${filter}`;
    try {
      let response = await fetch(fullURL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (response.status === 401) {
        await refreshUserToken();
        response = await fetch(fullURL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      }
      const result = await response.json();
      return result;
    } catch {
      () => console.log('Bad request');
    }
  }

  public async getWordByID(userId: string, wordId: string, token: string): Promise<IAgregatedWord[]> {
    const fullURL = `${this.baseURL}/users/${userId}/aggregatedWords/${wordId}`;
    let response = await fetch(fullURL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (response.status === 401) {
      await refreshUserToken();
      response = await fetch(fullURL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
    }
    const result = await response.json();
    return result;
  }
}

export const filterWordService = new FilterWordsService();
