import { RSLangLS } from '../RSLangLS';
import { UserService, IUserLogin } from '../services/UsersService';

export const logInData: LogInDataType = {
  isAutorizated: false,
};

export type LogInDataType = {
  isAutorizated: boolean;
  name?: string;
  message?: string;
  token?: string;
  refreshToken?: string;
  userId?: string;
};

export function refreshUserLogInData(newData: IUserLogin) {
  logInData.userId = newData.userId;
  logInData.message = newData.message;
  logInData.name = newData.name;
  logInData.token = newData.token;
  logInData.refreshToken = newData.refreshToken;
  logInData.isAutorizated = true;
}

export async function refreshUserToken() {
  const user = new UserService();
  const newData = await user.getUserNewToken(logInData.userId!, logInData.refreshToken!);
  if (newData) {
    refreshUserLogInData(newData);
    RSLangLS.saveUserData(newData);
  }
}
