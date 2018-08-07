import { ICommonUI } from '../ui.model';

export const INIT_UI_CITY_STATE: ICityUI = {
  selectedId: '',
  searchKey: '',
  filterIds: []
};

export interface ICityUI extends ICommonUI {
}
