import * as ImmutableProxy from 'seamless-immutable';

const Immutable = (<any>ImmutableProxy).default || ImmutableProxy;
import { UIAction, UIActionTypeEnum } from '../ui.action';
import { STORE_UI_COMMON_KEY } from '../ui.model';

export function shareUIReducer(state, action: UIAction) {
    switch (action.type) {
        case UIActionTypeEnum.SELECT: {
            return Immutable(state).set(STORE_UI_COMMON_KEY.selectedId, action.payload.selectedId);
        }
        case UIActionTypeEnum.SEARCH: {
            return Immutable(state).set(STORE_UI_COMMON_KEY.searchKey, action.payload.searchKey);
        }
        case UIActionTypeEnum.FILTER: {
            const filter = action.payload.filter;
            let filterIds;
            if (filter) {
                if (filter.unSelectedCriteriaIds) {
                    filterIds = state[STORE_UI_COMMON_KEY.filterIds]
                        .filter(id => !filter.unSelectedCriteriaIds.find(removed => removed === id));
                } else {
                    filterIds = state[STORE_UI_COMMON_KEY.filterIds];
                }

                if (filter.selectedCriteriaId) {
                    filterIds = filterIds.concat(filter.selectedCriteriaId);
                }
                return Immutable(state).set(STORE_UI_COMMON_KEY.filterIds, filterIds);
            }
        }
    }
    return state;
}
