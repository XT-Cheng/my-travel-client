import { FluxStandardAction } from 'flux-standard-action';
import * as ImmutableProxy from 'seamless-immutable';

const Immutable = (<any>ImmutableProxy).default || ImmutableProxy;
import { EntityTypeEnum } from '../../entity/entity.model';
import { IActionMetaInfo } from '../../store.action';
import { INIT_UI_TRAVELAGENDA_STATE, ITravelAgendaUI, STORE_UI_TRAVELAGENDA_KEY } from '../model/travelAgenda.model';
import { IUIActionPayload } from '../ui.action';
import { shareUIReducer } from './share.reducer';

interface IUITravelAgendaActionPayload extends IUIActionPayload {
    selectedDailyTripId: string;
    selectedTravelViewPointId: string;
}

const defaultUIAgendaActionPayload: IUITravelAgendaActionPayload = {
    searchKey: '',
    selectedId: '',
    selectedDailyTripId: '',
    selectedTravelViewPointId: '',
    error: null,
    entityType: null,
    actionId: '',
    filter: null
};

type UITravelAgendaAction = FluxStandardAction<IUITravelAgendaActionPayload, IActionMetaInfo>;

enum UITravelAgendaActionTypeEnum {
    SELECT_DAILYTRIP = 'UI:TRAVELAGENDA:SELECT_DAILYTRIP',
    SELECT_TRAVELVIEWPOINT = 'UI:TRAVELAGENDA:SELECT_TRAVELVIEWPOINT'
}

export function travelAgendaReducer(state = INIT_UI_TRAVELAGENDA_STATE, action: UITravelAgendaAction): ITravelAgendaUI {
    if (!action.payload || action.payload.entityType !== EntityTypeEnum.TRAVELAGENDA) { return state; }

    state = shareUIReducer(state, action);

    switch (action.type) {
        case UITravelAgendaActionTypeEnum.SELECT_DAILYTRIP: {
            return Immutable(state).set(STORE_UI_TRAVELAGENDA_KEY.selectedDailyTripId, action.payload.selectedDailyTripId);
        }
        case UITravelAgendaActionTypeEnum.SELECT_TRAVELVIEWPOINT: {
            return Immutable(state).set(STORE_UI_TRAVELAGENDA_KEY.selectedTravelViewPointId, action.payload.selectedTravelViewPointId);
        }
    }
    return state;
}
