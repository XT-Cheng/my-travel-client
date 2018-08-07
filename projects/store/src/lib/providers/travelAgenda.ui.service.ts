import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';

import { ITravelAgendaBiz } from '../bizModel/model/travelAgenda.biz.model';
import { EntityTypeEnum } from '../entity/entity.model';
import { ITravelAgenda } from '../entity/model/travelAgenda.model';
import { IAppState } from '../store.model';
import { STORE_UI_KEY } from '../ui/ui.model';
import { FilterCategoryService } from './filterCategory.service';
import { UIService } from './ui.service';

@Injectable()
export class TravelAgendaUIService extends UIService<ITravelAgenda, ITravelAgendaBiz> {

    //#region Constructor

    constructor(protected _store: NgRedux<IAppState>, protected _filterCategoryService: FilterCategoryService) {
        super(_store, EntityTypeEnum.TRAVELAGENDA, STORE_UI_KEY.travelAgenda, _filterCategoryService);
    }

    //#endregion

}
