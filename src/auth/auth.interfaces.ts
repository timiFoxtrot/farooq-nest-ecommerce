import { Request } from 'express';

export enum USER_ROLES {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IReqUser {
  id: string;
  name: string;
  email: string;
  password: boolean;
  role: string;
}

export interface RequestWithUser extends Request {
  user: IReqUser;
}
