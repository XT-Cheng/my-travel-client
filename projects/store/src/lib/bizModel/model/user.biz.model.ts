import { IBiz } from '../biz.model';

export interface IUserBiz extends IBiz {
  name: string;
  nick: string;
  picture: string;
}
