import { ICommonUI } from '../ui.model';

export enum STORE_UI_TRAVELAGENDA_KEY {
  selectedDailyTripId = 'selectedDailyTripId',
  selectedTravelViewPointId = 'selectedTravelViewPointId'
}

export const INIT_UI_TRAVELAGENDA_STATE: ITravelAgendaUI = {
  searchKey: '',
  selectedId: '',
  selectedDailyTripId: '',
  selectedTravelViewPointId: '',
  filterIds: []
};

export interface ITravelAgendaUI extends ICommonUI {
  selectedDailyTripId: string;
  selectedTravelViewPointId: string;
}
