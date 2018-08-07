import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ITransportationCategoryBiz } from '../bizModel/model/travelAgenda.biz.model';
import { EntityTypeEnum } from '../entity/entity.model';
import { transportationCategorySchema } from '../entity/entity.schema';
import { ITransportationCategory } from '../entity/model/travelAgenda.model';
import { IAppState } from '../store.model';
import { EntityService } from './entity.service';
import { ErrorService } from './error.service';

@Injectable()
export class TransportationCategoryService extends EntityService<ITransportationCategory, ITransportationCategoryBiz> {
    //#region private member

    private _default: ITransportationCategoryBiz;

    //#endregion

    //#region Constructor
    constructor(protected _http: HttpClient, protected _errorService: ErrorService,
        protected _store: NgRedux<IAppState>) {
        super(_http, _store, EntityTypeEnum.TRANSPORTATIONCATEGORY, transportationCategorySchema,
            `transportationCategories`, _errorService);

        this.all$.subscribe((value) => {
            this._default = value.find(tpc => tpc.isDefault);
        });
    }
    //#endregion

    //#region Public methods

    public get default(): ITransportationCategoryBiz {
        return this._default;
    }

    //#endregion
}
