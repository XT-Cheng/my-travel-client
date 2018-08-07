import { IEntity } from '../entity.model';

export interface IUser extends IEntity {
  name: string;
  nick: string;
  picture: string;
}
