import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IViewPointCategoryBiz } from '../bizModel/model/viewPoint.biz.model';
import { EntityTypeEnum } from '../entity/entity.model';
import { viewPointCategorySchema } from '../entity/entity.schema';
import { IViewPointCategory } from '../entity/model/viewPoint.model';
import { IAppState } from '../store.model';
import { EntityService } from './entity.service';
import { ErrorService } from './error.service';
import { StoreConfig } from '../store.config';

@Injectable()
export class ViewPointCategoryService extends EntityService<
  IViewPointCategory,
  IViewPointCategoryBiz
> {
  //#region Constructor
  constructor(
    protected _http: HttpClient,
    protected _errorService: ErrorService,
    protected _store: NgRedux<IAppState>,
    protected _config: StoreConfig,
  ) {
    super(
      _http,
      _store,
      EntityTypeEnum.VIEWPOINTCATEGORY,
      viewPointCategorySchema,
      `viewPointCategories`,
      _errorService,
      null,
      _config,
    );
  }
  //#endregion
}
