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
  console.log(logInData);
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
  } else {
    alert('Ошибка авторизации. Выйдите из аккаунта и войдите повторно.');
    throw new Error('Bad request');
  }
}
