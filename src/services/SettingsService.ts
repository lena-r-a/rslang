export interface ISettings {
  wordsPerDay: number;
  optional: Record<string, unknown>;
}

export class SettingsService {
  private baseURL = 'https://rslang-js.herokuapp.com';

  public async getSettings(id: string, token: string): Promise<ISettings | undefined> {
    const fullURL = `${this.baseURL}/users/${id}/settings`;
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

  public async upsertSettings(id: string, token: string, data: ISettings) {
    const fullURL = `${this.baseURL}/users/${id}/settings`;
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
