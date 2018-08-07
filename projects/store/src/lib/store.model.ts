import { IDirties, INIT_DIRTY_STATE } from './dirty/dirty.model';
import { IEntities, INIT_ENTITY_STATE } from './entity/entity.model';
import { IErrorHub, INIT_ERROR_STATE } from './error/error.model';
import { INIT_UI_STATE, IUIState } from './ui/ui.model';

export enum STORE_KEY {
    entities = 'entities',
    error = 'error',
    ui = 'ui',
    dirties = 'dirties'
}


export interface IAppState {
    entities: IEntities;
    dirties: IDirties;
    ui: IUIState;
    error: IErrorHub;
    progress: IProgress;
}

export interface IProgress {
    progressing: boolean;
}

export const INIT_APP_STATE: IAppState = {
    entities: INIT_ENTITY_STATE,
    dirties: INIT_DIRTY_STATE,
    ui: INIT_UI_STATE,
    error: INIT_ERROR_STATE,
    progress: { progressing: false }
};
