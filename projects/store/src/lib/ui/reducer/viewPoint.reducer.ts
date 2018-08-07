import { FluxStandardAction } from 'flux-standard-action';

import { EntityTypeEnum } from '../../entity/entity.model';
import { IActionMetaInfo } from '../../store.action';
import { INIT_UI_VIEWPOINT_STATE, IViewPointUI } from '../model/viewPoint.model';
import { IUIActionPayload } from '../ui.action';
import { shareUIReducer } from './share.reducer';

interface IUIViewPointActionPayload extends IUIActionPayload {
}

const defaultUIViewPointActionPayload: IUIViewPointActionPayload = {
    searchKey: '',
    selectedId: '',
    error: null,
    entityType: null,
    actionId: '',
    filter: null
};

type UIViewPointAction = FluxStandardAction<IUIViewPointActionPayload, IActionMetaInfo>;

export function viewPointReducer(state = INIT_UI_VIEWPOINT_STATE, action: UIViewPointAction): IViewPointUI {
    if (!action.payload || action.payload.entityType !== EntityTypeEnum.VIEWPOINT) { return state; }

    return shareUIReducer(state, action);
}
