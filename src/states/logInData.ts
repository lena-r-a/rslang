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
