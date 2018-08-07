import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';

import { ICityBiz } from '../bizModel/model/city.biz.model';
import { EntityTypeEnum } from '../entity/entity.model';
import { ICity } from '../entity/model/city.model';
import { IAppState } from '../store.model';
import { STORE_UI_KEY } from '../ui/ui.model';
import { FilterCategoryService } from './filterCategory.service';
import { UIService } from './ui.service';

@Injectable()
export class CityUIService extends UIService<ICity, ICityBiz> {

    //#region Constructor

    constructor(protected _store: NgRedux<IAppState>, protected _filterCategoryService: FilterCategoryService) {
        super(_store, EntityTypeEnum.CITY, STORE_UI_KEY.city, _filterCategoryService);
    }

    //#endregion

}
