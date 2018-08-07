import { Injectable } from '@angular/core';
import { combineEpics } from 'redux-observable';

import { CityService } from '../providers/city.service';
import { DataFlushService } from '../providers/dataFlush.service';
import { FilterCategoryService } from '../providers/filterCategory.service';
import { MasterDataService } from '../providers/masterData.service';
import { TransportationCategoryService } from '../providers/transportationCategory.service';
import { TravelAgendaService } from '../providers/travelAgenda.service';
import { UserService } from '../providers/user.service';
import { ViewPointService } from '../providers/viewPoint.service';
import { ViewPointCategoryService } from '../providers/viewPointCategory.service';

@Injectable()
export class EntityEpics {
  constructor(private _cityService: CityService, private _viewPointService: ViewPointService,
    private _userService: UserService, private _filterCategoryService: FilterCategoryService,
    private _masterDataService: MasterDataService, private _travelAgendaService: TravelAgendaService,
    private _viewPointCategoryService: ViewPointCategoryService, private _flushService: DataFlushService,
    private _transportationCategoryService: TransportationCategoryService) { }

  public createEpics() {
    return [combineEpics(
      ...this._cityService.createEpic(),
      ...this._viewPointService.createEpic(),
      ...this._userService.createEpic(),
      ...this._filterCategoryService.createEpic(),
      ...this._masterDataService.createEpic(),
      ...this._travelAgendaService.createEpic(),
      ...this._viewPointCategoryService.createEpic(),
      ...this._transportationCategoryService.createEpic(),
      ...this._flushService.createEpic()
    )];
  }
}
