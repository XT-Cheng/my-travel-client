import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { denormalize } from 'normalizr';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs/operators';
import * as ImmutableProxy from 'seamless-immutable';

const Immutable = (<any>ImmutableProxy).default || ImmutableProxy;
import { FilterTypeEnum, IFilterCategoryBiz } from '../bizModel/model/filterCategory.biz.model';
import { EntityTypeEnum } from '../entity/entity.model';
import { filterCategorySchema } from '../entity/entity.schema';
import { IFilterCategory } from '../entity/model/filterCategory.model';
import { IAppState } from '../store.model';
import { EntityService } from './entity.service';
import { ErrorService } from './error.service';
import { StoreConfig } from '../store.config';

@Injectable()
export class FilterCategoryService extends EntityService<IFilterCategory, IFilterCategoryBiz> {

    //#region Constructor
    constructor(protected _http: HttpClient, protected _errorService: ErrorService,
        protected _store: NgRedux<IAppState>, protected _config: StoreConfig) {
        super(_http, _store, EntityTypeEnum.FILTERCATEGORY, filterCategorySchema, `filterCategories`, _errorService, null, _config);
    }
    //#endregion

    //#region Public methods

    public byType(type: FilterTypeEnum): IFilterCategoryBiz[] {
        return this._all.filter((cat) => cat.filterType === type);
    }

    public byId(id: string): IFilterCategoryBiz {
        return denormalize(id, filterCategorySchema, Immutable(this._store.getState().entities).asMutable({ deep: true }));
    }

    public getFilters(filterIds: Observable<string[]>): Observable<IFilterCategoryBiz[]> {
        return filterIds.pipe(
            combineLatest(this._all$, (v1, v2) => {
                return this.buildCurrentFilterCategories(v1, v2);
            })
        );
    }

    //#endregion

    //#region Private methods

    private buildCurrentFilterCategories(checkIds: string[], categories: IFilterCategoryBiz[]) {
        categories.forEach(category => {
            category.criteries.forEach(criteria => {
                criteria.isChecked = !!checkIds.find(id => id === criteria.id);
            });
        });

        return categories;
    }

    //#endregion
}
