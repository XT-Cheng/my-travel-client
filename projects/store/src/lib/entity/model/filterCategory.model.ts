import { IEntity } from '../entity.model';

export interface IFilterCriteria extends IEntity {
    name: string;
    criteria: string;
}

export interface IFilterCategory extends IEntity {
    name: string;
    criteries: string[];
    filterFunction: string;
    filterType: string;
}
