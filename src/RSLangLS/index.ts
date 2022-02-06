import { IUserLogin } from '../services/UsersService';

const LSData = {
  userData: 'RSLangUser',
};

export class RSLangLS {
  static saveUserData(data: IUserLogin): void {
    window.localStorage[LSData.userData] = JSON.stringify(data);
  }

  static getUserDataJSON(): string | null {
    return localStorage.getItem(LSData.userData);
  }

  static removeUserData() {
    localStorage.removeItem(LSData.userData);
  }

  static getUserData(key: keyof IUserLogin): string | undefined {
    const res: string | null = RSLangLS.getUserDataJSON();
    if (res) {
      return JSON.parse(res)[key];
    }
  }
}
