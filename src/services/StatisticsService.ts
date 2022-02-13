// export interface IStatistic {
//   learnedWords: number;
//   optional: Record<string, unknown>;
// }

export type StatDataType = {
  id?: string;
  learnedWords: number; // количество изученных слов за день
  optional: {
    [prop: string]: StatDataOptionalType;
  };
};

export type StatDataOptionalType = {
  learned: number;
  sprint: StatDataGameType;
  challenge: StatDataGameType;
};

export type StatDataGameType = {
  newWords: number; // количество новых слов, использованных в игре за день
  rightAnsw: number; // количество правильных ответов за день
  questions: number; // количество отвеченных вопросов за день
  session: number; // самая длинная сессия (количество слов) за день
};

export class StatisticService {
  private baseURL = 'https://rslang-js.herokuapp.com';

  public async getStatistics(id: string, token: string): Promise<Response> {
    const fullURL = `${this.baseURL}/users/${id}/statistics`;
    const response: Response = await fetch(fullURL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    return response;
  }

  public async upsertStatistics(id: string, token: string, data: StatDataType) {
    const fullURL = `${this.baseURL}/users/${id}/statistics`;
    try {
      await fetch(fullURL, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch {
      () => console.log('Bad request');
    }
  }
}
