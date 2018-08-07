import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';

import { IViewPointBiz } from '../bizModel/model/viewPoint.biz.model';
import { EntityTypeEnum } from '../entity/entity.model';
import { IViewPoint } from '../entity/model/viewPoint.model';
import { IAppState } from '../store.model';
import { STORE_UI_KEY } from '../ui/ui.model';
import { FilterCategoryService } from './filterCategory.service';
import { UIService } from './ui.service';

@Injectable()
export class ViewPointUIService extends UIService<IViewPoint, IViewPointBiz> {

    //#region Constructor

    constructor(protected _store: NgRedux<IAppState>, protected _filterCategoryService: FilterCategoryService) {
        super(_store, EntityTypeEnum.VIEWPOINT, STORE_UI_KEY.viewPoint, _filterCategoryService);
    }
    //#endregion

}
