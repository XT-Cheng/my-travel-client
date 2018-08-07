import { FluxStandardAction } from 'flux-standard-action';

import { EntityTypeEnum } from '../../entity/entity.model';
import { IActionMetaInfo } from '../../store.action';
import { ICityUI, INIT_UI_CITY_STATE } from '../model/city.model';
import { IUIActionPayload } from '../ui.action';
import { shareUIReducer } from './share.reducer';

interface IUICityActionPayload extends IUIActionPayload {
}

type UICityAction = FluxStandardAction<IUICityActionPayload, IActionMetaInfo>;

export function cityReducer(state = INIT_UI_CITY_STATE, action: UICityAction): ICityUI {
    if (!action.payload || action.payload.entityType !== EntityTypeEnum.CITY) { return state; }

    return shareUIReducer(state, action);
}
