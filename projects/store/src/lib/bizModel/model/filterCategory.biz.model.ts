import { IBiz } from '../biz.model';

export enum FilterTypeEnum {
    ViewPoint = 'ViewPoint'
}

export interface IFilterCriteriaBiz extends IBiz {
    name: string;
    criteria: string;
    isChecked: boolean;
}

export interface IFilterCategoryBiz extends IBiz {
    name: string;
    criteries: IFilterCriteriaBiz[];
    filterFunction: string;
    filterType: FilterTypeEnum;
}
