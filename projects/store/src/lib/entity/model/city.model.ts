import { IEntity } from '../entity.model';

export interface ICity extends IEntity {
    name: string;
    thumbnail: string;
    addressCode: string;
}
