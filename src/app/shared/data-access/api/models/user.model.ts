export interface User {
  username: string;
  token: string;
  refreshToken: string;
}


export interface UserLogin {
  username: string;
  password: string;
}
