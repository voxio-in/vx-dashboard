import { IUser } from "./user.types";

export interface IAuthUser extends IUser {
  // the logged in user, includes resolved config
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: IAuthUser;
  message: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}
