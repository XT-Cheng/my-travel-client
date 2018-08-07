import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { ObjectID } from 'bson';
import { normalize, schema } from 'normalizr';
import { Epic } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, startWith } from 'rxjs/operators';
import { isArray } from 'util';

import { WEBAPI_HOST } from '../constants';
import {
  EntityAction,
  entityActionFailed,
  EntityActionPhaseEnum,
  entityActionStarted,
  entityActionSucceeded,
  EntityActionTypeEnum,
  entityLoadAction,
  IPagination,
  IQueryCondition,
  IEntityActionPayload,
} from '../entity/entity.action';
import { EntityTypeEnum, IEntities } from '../entity/entity.model';
import { IAppState } from '../store.model';
import { FluxStandardAction } from 'flux-standard-action';
import { IActionMetaInfo } from 'store/lib/store.action';
import { IError } from '../error/error.model';

export abstract class FetchService {
  private DEFAULT_PAGE = 0;
  private DEFAULT_LIMIT = 50;

  //#region Constructor
  constructor(
    protected _http: HttpClient,
    protected _store: NgRedux<IAppState>,
    protected _entityType: EntityTypeEnum,
    protected _entitySchema: any,
    protected _url: string,
  ) {}
  //#endregion

  //#region Actions

  protected startedAction: (
    actionType: EntityActionTypeEnum,
  ) => FluxStandardAction<
    IEntityActionPayload,
    IActionMetaInfo
  > = entityActionStarted(this._entityType);

  protected succeededAction: (
    actionType: EntityActionTypeEnum,
    entities: IEntities,
  ) => FluxStandardAction<
    IEntityActionPayload,
    IActionMetaInfo
  > = entityActionSucceeded(this._entityType);

  protected failedAction: (
    actionType: EntityActionTypeEnum,
    error: IError,
    actionId: string,
  ) => FluxStandardAction<
    IEntityActionPayload,
    IActionMetaInfo
  > = entityActionFailed(this._entityType);

  protected loadAction: (
    pagination: IPagination,
    queryCondition: IQueryCondition,
    actionId: string,
  ) => FluxStandardAction<
    IEntityActionPayload,
    IActionMetaInfo
  > = entityLoadAction(this._entityType);

  //#endregion

  //#region Epic
  public createEpic(): Epic<EntityAction, EntityAction, IAppState>[] {
    return [this.createEpicOfLoad()];
  }

  private createEpicOfLoad(): Epic<EntityAction, EntityAction, IAppState> {
    return (action$, store$) =>
      action$.ofType(EntityActionTypeEnum.LOAD).pipe(
        filter(
          action =>
            action.payload.entityType === this._entityType &&
            action.payload.phaseType === EntityActionPhaseEnum.TRIGGER,
        ),
        mergeMap(action =>
          this.load(
            action.payload.pagination,
            action.payload.queryCondition,
          ).pipe(
            map(data => this.succeededAction(EntityActionTypeEnum.LOAD, data)),
            catchError((errResponse: any) => {
              return of(
                this.failedAction(
                  EntityActionTypeEnum.LOAD,
                  errResponse.actionError,
                  action.payload.actionId,
                ),
              );
            }),
            startWith(this.startedAction(EntityActionTypeEnum.LOAD)),
          ),
        ),
      );
  }

  //#endregion

  //#region Public methods

  //#endregion

  //#region Protected methods

  protected loadEntities(
    pagination: IPagination = {
      page: this.DEFAULT_PAGE,
      limit: this.DEFAULT_LIMIT,
    },
    queryCondition: IQueryCondition = {},
  ): string {
    const actionId = new ObjectID().toHexString();
    this._store.dispatch(this.loadAction(pagination, queryCondition, actionId));
    return actionId;
  }

  protected get schema(): any {
    return [this._entitySchema];
  }

  protected afterReceive(record: any): any {
    return Object.assign({}, record);
  }

  protected afterReceiveInner(record: any): any {
    if (isArray(record)) {
      const ret = [];
      Array.from(record).forEach(item => {
        ret.push(this.afterReceive(item));
      });
      return ret;
    } else {
      return this.afterReceive(record);
    }
  }

  //#endregion

  //#region Private methods
  private load(
    pagination: IPagination,
    queryCondition: IQueryCondition,
  ): Observable<IEntities> {
    return this._http.get(`${WEBAPI_HOST}/${this._url}`).pipe(
      map(records => {
        return normalize(this.afterReceiveInner(records), this.schema).entities;
      }),
    );
  }

  //#endregion

  //#region Public methods

  public fetch(): string {
    return this.loadEntities();
  }

  //#endregion
}
