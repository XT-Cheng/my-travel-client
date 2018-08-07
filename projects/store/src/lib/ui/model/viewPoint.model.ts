import { ICommonUI } from '../ui.model';

export const INIT_UI_VIEWPOINT_STATE: IViewPointUI = {
  selectedId: '',
  searchKey: '',
  filterIds: []
};

export interface IViewPointUI extends ICommonUI {
  filterIds: string[];
}
