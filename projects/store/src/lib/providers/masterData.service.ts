import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EntityTypeEnum } from '../entity/entity.model';
import {
  citySchema,
  transportationCategorySchema,
  viewPointCategorySchema,
} from '../entity/entity.schema';
import { IAppState } from '../store.model';
import { FetchService } from './fetch.service';
import { StoreConfig } from '../store.config';

@Injectable()
export class MasterDataService extends FetchService {
  //#region Constructor
  constructor(
    protected _http: HttpClient,
    protected _store: NgRedux<IAppState>,
    protected _config: StoreConfig,
  ) {
    super(
      _http,
      _store,
      EntityTypeEnum.MASTER_DATA,
      {
        viewPointCategories: [viewPointCategorySchema],
        transportationCategories: [transportationCategorySchema],
        cities: [citySchema],
      },
      `masterData`,
      _config,
    );
  }
  //#endregion

  //#region protected methods
  protected get schema(): any {
    return this._entitySchema;
  }
  //#endregion
}
