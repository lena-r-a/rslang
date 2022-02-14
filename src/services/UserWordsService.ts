export interface IUserWord {
  difficulty: string;
  optional?: Record<string, unknown>;
}

export interface IUserWordsResponse {
  difficulty: string;
  id: string;
  wordId: string;
}

//this is optional interface - depends on task
export interface IOptional {
  testFieldString: string;
  testFieldBoolean: boolean;
}

export interface INewWord {
  difficulty: string; //here need enum
  optional?: Record<string, unknown>;
}

export interface INewWordRequest {
  userId: string;
  wordId: string;
  word?: INewWord;
}

class UserWordsService {
  private baseURL = 'https://rslang-js.herokuapp.com';

  public async getUserWords(id: string, token: string): Promise<IUserWordsResponse[] | undefined> {
    const fullURL = `${this.baseURL}/users/${id}/words`;
    try {
      const response = await fetch(fullURL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      return result;
    } catch {
      () => console.log('Bad request');
    }
  }

  public createUserWord = async (newWord: INewWordRequest, token: string) => {
    try {
      const response = await fetch(`${this.baseURL}/users/${newWord.userId}/words/${newWord.wordId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWord.word),
      });
      const result = await response.json();
      return result;
    } catch {
      () => console.log('Bad request');
    }
  };

  public getUserWordByID = async (newWord: INewWordRequest, token: string) => {
    try {
      const response = await fetch(`${this.baseURL}/${newWord.userId}/words/${newWord.wordId}`, {
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
  };

  public editUserWord = async (newWord: INewWordRequest, token: string) => {
    try {
      const response = await fetch(`${this.baseURL}/users/${newWord.userId}/words/${newWord.wordId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWord.word),
      });
      const result = await response.json();
      return result;
    } catch {
      () => console.log('Bad request');
    }
  };

  public deleteUserWordByID = async (newWord: INewWordRequest, token: string) => {
    try {
      const response = await fetch(`${this.baseURL}/users/${newWord.userId}/words/${newWord.wordId}`, {
        method: 'DELETE',
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
  };
}

export const userWordsService = new UserWordsService();
