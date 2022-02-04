export interface IStatistic {
  learnedWords: number;
  optional: Record<string, unknown>;
}

export class StatisticService {
  private baseURL = 'https://rslang-js.herokuapp.com';

  public async getStatistics(id: string, token: string): Promise<IStatistic | undefined> {
    const fullURL = `${this.baseURL}/users/${id}/statistics`;
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

  public async upsertStatistics(id: string, token: string, data: IStatistic) {
    const fullURL = `${this.baseURL}/users/${id}/statistics`;
    try {
      const response = await fetch(fullURL, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch {
      () => console.log('Bad request');
    }
  }
}
