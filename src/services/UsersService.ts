import { RestService } from './RestService';

export interface IUserCreate {
  name?: string;
  email: string;
  password: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface IUserLogin {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export class UserService {
  restService: RestService;

  constructor() {
    this.restService = new RestService();
  }

  public async createUser(user: IUserCreate): Promise<Response> {
    const response = await this.restService.post<IUserCreate>('/users', user);
    return response;
  }

  public async loginUser(user: IUserCreate): Promise<Response> {
    const response = await this.restService.post<IUserCreate>('/signin', user);
    return response;
  }

  public async getUser(id: string, token: string): Promise<IUserCreate | undefined> {
    const fullURL = `${this.restService.baseURL}/users/${id}`;
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

  public async editUser(id: string, token: string, data: IUserCreate): Promise<IUserCreate | undefined> {
    const fullURL = `${this.restService.baseURL}/users/${id}`;
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

  public async deleteUser(id: string, token: string): Promise<IUserCreate | undefined> {
    const fullURL = `${this.restService.baseURL}/users/${id}`;
    try {
      const response = await fetch(fullURL, {
        method: 'DELETE',
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

  public async getUserToken(id: string): Promise<IUserLogin | undefined> {
    const fullURL = `${this.restService.baseURL}/users/${id}/tokens`;
    try {
      const response = await fetch(fullURL, {
        method: 'GET',
        headers: {
          // 'Authorization': `Bearer ${token}`,
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
}
