import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IViewPointBiz } from '../bizModel/model/viewPoint.biz.model';
import { EntityTypeEnum } from '../entity/entity.model';
import { viewPointSchema } from '../entity/entity.schema';
import { IViewPoint } from '../entity/model/viewPoint.model';
import { IAppState } from '../store.model';
import { EntityService } from './entity.service';
import { ErrorService } from './error.service';
import { ViewPointUIService } from './viewPoint.ui.service';

@Injectable()
export class ViewPointService extends EntityService<IViewPoint, IViewPointBiz> {

    //#region Constructor
    constructor(protected _http: HttpClient, protected _errorService: ErrorService,
        protected _store: NgRedux<IAppState>, private _viewPointUISrv: ViewPointUIService) {
        super(_http, _store, EntityTypeEnum.VIEWPOINT, viewPointSchema, `viewPoints`, _errorService, _viewPointUISrv);
    }
    //#endregion

    //#region Protected methods

    protected beforeSend(bizModel: IViewPointBiz) {
        const thumbnail = (bizModel.thumbnail.startsWith(`data:image`)) ? `` : bizModel.thumbnail;
        const images = bizModel.images.filter((img) => !img.startsWith(`data:image`));

        return Object.assign({}, bizModel, {
            city: bizModel.city.id,
            category: bizModel.category.id,
            thumbnail: thumbnail,
            images: images
        });
    }

    protected search(bizModel: IViewPointBiz, searchKey: any): boolean {
        return bizModel.name.indexOf(searchKey) !== -1 ||
            bizModel.tags.findIndex((value) => value === searchKey) !== -1;
    }

    //#endregion

}
