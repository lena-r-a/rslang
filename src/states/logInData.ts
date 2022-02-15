import { App } from '../app';
import { Preloader } from '../common/preloader';
import { RSLangLS } from '../RSLangLS';
import { UserService, IUserLogin } from '../services/UsersService';

export let logInData: IUserLogin = {
  isAutorizated: false,
};

export function clearUserLogInData() {
  logInData = {
    isAutorizated: false,
  };
}

export function refreshUserLogInData(newData: IUserLogin) {
  logInData.userId = newData.userId;
  logInData.message = newData.message;
  logInData.name = newData.name;
  logInData.token = newData.token;
  logInData.refreshToken = newData.refreshToken;
  logInData.isAutorizated = true;
}

export function refreshTokenInUserLogInData(newData: IUserLogin) {
  logInData.token = newData.token;
  logInData.refreshToken = newData.refreshToken;
}

export async function refreshUserToken() {
  const user = new UserService();
  const response: Response = await user.getUserNewToken(logInData.userId!, logInData.refreshToken!);
  if (response.status === 200) {
    const res: IUserLogin = await response.json();
    refreshTokenInUserLogInData(res);
    RSLangLS.saveUserData(logInData);
    // console.log('token was refreshed');
  } else {
    alert('Ошибка авторизации. Войдите в аккаунт повторно.');
    RSLangLS.removeUserData();
    const app = new App();
    app.runToAutorizationPage();
    Preloader.hidePreloader();
    throw new Error('Bad request');
  }
}
