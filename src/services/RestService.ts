export interface QueryParams {
  [key: string]: string | number | undefined;
}

export class RestService {
  public baseURL = 'https://rslang-js.herokuapp.com';

  public async get(url: string, queryParams: QueryParams): Promise<Response> {
    const fullURL = this.createUrl(url, queryParams);
    return fetch(fullURL);
  }

  public async getById(url: string, id: string): Promise<Response> {
    const fullURL = `${this.baseURL}${url}/${id}`;
    return fetch(fullURL);
  }

  public async post<T>(url: string, data: T): Promise<Response> {
    const fullURL = this.createUrl(url);
    return fetch(fullURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  public async put<T>(url: string, data: T): Promise<Response> {
    const fullURL = this.createUrl(url);
    return fetch(fullURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  public async delete(url: string): Promise<Response> {
    const fullURL = this.createUrl(url);
    return fetch(fullURL, { method: 'DELETE' });
  }

  public createUrl(url: string, queryParams?: QueryParams): string {
    let URL = `${this.baseURL}${url}`;
    if (queryParams) {
      URL += Object.keys(queryParams).reduce((acc: string, key: string, id: number) => `${acc}${id === 0 ? '' : '&'}${key}=${queryParams[key]}`, '?');
    }
    return URL;
  }
}
