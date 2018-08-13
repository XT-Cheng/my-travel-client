import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { ObjectID } from 'bson';
import { denormalize, normalize, schema } from 'normalizr';
import { Epic } from 'redux-observable';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  catchError,
  combineLatest,
  concat,
  filter,
  map,
  mapTo,
  mergeMap,
  race,
  skip,
  startWith,
  switchMap,
  take,
} from 'rxjs/operators';
import * as ImmutableProxy from 'seamless-immutable';

const Immutable = (<any>ImmutableProxy).default || ImmutableProxy;

import { isArray } from 'util';

import { IBiz } from '../bizModel/biz.model';
import {
  dirtyAddAction,
  dirtyRemoveAction,
  DirtyTypeEnum,
  IDirtyActionPayload,
} from '../dirty/dirty.action';
import {
  EntityAction,
  EntityActionPhaseEnum,
  EntityActionTypeEnum,
  entityDeleteAction,
  entityInsertAction,
  entityUpdateAction,
  getEntityKey,
  getUIKey,
  IEntityActionPayload,
} from '../entity/entity.action';
import { EntityTypeEnum, IEntities, IEntity } from '../entity/entity.model';
import { IAppState, STORE_KEY } from '../store.model';
import { STORE_UI_COMMON_KEY } from '../ui/ui.model';
import { FilterEx } from '../utils/filterEx';
import { ErrorService } from './error.service';
import { FetchService } from './fetch.service';
import { UIService } from './ui.service';
import { FluxStandardAction } from 'flux-standard-action';
import { IActionMetaInfo } from '../store.action';
import { StoreConfig } from '../store.config';

export abstract class EntityService<
  T extends IEntity,
  U extends IBiz
> extends FetchService {
  //#region Entity Actions

  protected updateAction: (
    id: string,
    bizModel: U,
    files: Map<string, any[]>,
    dirtyMode: boolean,
    actionId: string,
  ) => FluxStandardAction<
    IEntityActionPayload,
    IActionMetaInfo
  > = entityUpdateAction<U>(this._entityType);

  protected insertAction: (
    id: string,
    bizModel: U,
    files: Map<string, any[]>,
    dirtyMode: boolean,
    actionId: string,
  ) => FluxStandardAction<
    IEntityActionPayload,
    IActionMetaInfo
  > = entityInsertAction<U>(this._entityType);

  protected deleteAction: (
    id: string,
    bizModel: U,
    dirtyMode: boolean,
    actionId: string,
  ) => FluxStandardAction<
    IEntityActionPayload,
    IActionMetaInfo
  > = entityDeleteAction<U>(this._entityType);

  protected addDirtyAction: (
    id: string,
    dirtyType: DirtyTypeEnum,
  ) => FluxStandardAction<
    IDirtyActionPayload,
    IActionMetaInfo
  > = dirtyAddAction(this._entityType);

  protected removeDirtyAction: (
    id: string,
    dirtyType?: DirtyTypeEnum,
  ) => FluxStandardAction<
    IDirtyActionPayload,
    IActionMetaInfo
  > = dirtyRemoveAction(this._entityType);

  //#endregion

  //#region UI Actions

  //#endregion

  //#region Constructor

  constructor(
    protected _http: HttpClient,
    protected _store: NgRedux<IAppState>,
    protected _entityType: EntityTypeEnum,
    protected _entitySchema: schema.Entity,
    protected _url: string,
    protected _errorService: ErrorService,
    protected _uiService: UIService<T, U> = null,
    protected _config: StoreConfig,
  ) {
    super(_http, _store, _entityType, _entitySchema, _url, _config);

    this.getAll(this._store).subscribe(value => {
      this._all = value;
      this._all$.next(value);
    });

    this.getSelected(this._store).subscribe(value => {
      this._selected = value;
      this._selected$.next(value);
    });

    if (this._uiService) {
      this.getSearched(this._store).subscribe(value => {
        this._searched$.next(value);
      });

      this.getFiltered(this._store).subscribe(value => {
        this._filtered = value;
        this._filtered$.next(value);
      });

      this.getFilteredAndSearched(this._store).subscribe(value => {
        this._filteredAndSearched = value;
        this._filteredAndSearched$.next(value);
      });
    }
  }

  //#endregion

  //#region Protected member

  protected _all$: BehaviorSubject<U[]> = new BehaviorSubject([]);
  protected _all: U[] = [];

  protected _selected: U;
  protected _selected$: BehaviorSubject<U> = new BehaviorSubject(null);

  protected _searched: U[];
  protected _searched$: BehaviorSubject<U[]> = new BehaviorSubject(null);

  protected _filtered: U[];
  protected _filtered$: BehaviorSubject<U[]> = new BehaviorSubject(null);

  protected _filteredAndSearched: U[];
  protected _filteredAndSearched$: BehaviorSubject<U[]> = new BehaviorSubject(
    null,
  );

  //#endregion

  //#region Entity Selector

  private getById(id: string): Observable<U> {
    return this._store
      .select<T>([STORE_KEY.entities, getEntityKey(this._entityType), id])
      .pipe(
        map(ct => {
          return ct
            ? denormalize(
                ct.id,
                this._entitySchema,
                Immutable(this._store.getState().entities).asMutable({
                  deep: true,
                }),
              )
            : null;
        }),
      );
  }

  private getAll(store: NgRedux<IAppState>): Observable<U[]> {
    return store
      .select<{ [id: string]: T }>([
        STORE_KEY.entities,
        getEntityKey(this._entityType),
      ])
      .pipe(
        map(data => {
          return denormalize(
            Object.keys(data),
            [this._entitySchema],
            Immutable(store.getState().entities).asMutable({ deep: true }),
          );
        }),
      );
  }

  private getSelectedId(store: NgRedux<IAppState>): Observable<string> {
    return store.select<string>([
      STORE_KEY.ui,
      getUIKey(this._entityType),
      STORE_UI_COMMON_KEY.selectedId,
    ]);
  }

  private getSelected(store: NgRedux<IAppState>): Observable<U> {
    return this.getSelectedId(store).pipe(
      switchMap(id => {
        return store.select<T>([
          STORE_KEY.entities,
          getEntityKey(this._entityType),
          id,
        ]);
      }),
      map(ct => {
        return ct
          ? denormalize(
              ct.id,
              this._entitySchema,
              Immutable(store.getState().entities).asMutable({ deep: true }),
            )
          : null;
      }),
    );
  }

  private getSearched(store: NgRedux<IAppState>): Observable<U[]> {
    return this.all$.pipe(
      combineLatest(this._uiService.searchKey$, (cities, searchKey) => {
        return cities.filter(c => {
          let matchSearchKey = true;
          if (searchKey !== '') {
            matchSearchKey = this.search(c, searchKey);
          }

          return matchSearchKey;
        });
      }),
    );
  }

  private getFiltered(store: NgRedux<IAppState>): Observable<U[]> {
    return this._uiService.filters$.pipe(
      combineLatest(this.all$, (filterCategories, viewPoints) => {
        return viewPoints.filter(vp => {
          const isFiltered = filterCategories.every(category => {
            return category.criteries.every(criteria => {
              if (criteria.isChecked && FilterEx[category.filterFunction]) {
                return FilterEx[category.filterFunction](vp, criteria);
              }
              return true;
            });
          });

          return isFiltered;
        });
      }),
    );
  }

  private getFilteredAndSearched(store: NgRedux<IAppState>): Observable<U[]> {
    return this._uiService.filters$.pipe(
      combineLatest(
        this.all$,
        this._uiService.searchKey$,
        (filterCategories, bizModels, searchKey) => {
          return bizModels.filter(bizModel => {
            const isFiltered = filterCategories.every(category => {
              return category.criteries.every(criteria => {
                if (criteria.isChecked && FilterEx[category.filterFunction]) {
                  return FilterEx[category.filterFunction](bizModel, criteria);
                }
                return true;
              });
            });

            let matchSearchKey = true;
            if (searchKey !== '') {
              matchSearchKey = this.search(bizModel, searchKey);
            }

            return isFiltered && matchSearchKey;
          });
        },
      ),
    );
  }

  //#endregion

  //#region Entity Selector

  public get all$(): Observable<U[]> {
    return this._all$.asObservable();
  }

  public get selected$(): Observable<U> {
    return this._selected$.asObservable();
  }

  public get selected(): U {
    return this._selected;
  }

  public get searched$(): Observable<U[]> {
    return this._searched$.asObservable();
  }

  public get filtered(): U[] {
    return this._filtered;
  }

  public get filtered$(): Observable<U[]> {
    return this._filtered$.asObservable();
  }

  public get filteredAndSearched$(): Observable<U[]> {
    return this._filteredAndSearched$.asObservable();
  }

  //#endregion

  //#region Epic
  public createEpic(): Epic<EntityAction, EntityAction, IAppState>[] {
    return [
      ...super.createEpic(),
      this.createEpicOfDML(),
      this.createEpicOfDMLForDirtyMode(),
    ];
  }

  private createEpicOfDML(): Epic<EntityAction, EntityAction, IAppState> {
    return (action$, store$) =>
      action$
        .ofType(
          EntityActionTypeEnum.INSERT,
          EntityActionTypeEnum.DELETE,
          EntityActionTypeEnum.UPDATE,
        )
        .pipe(
          filter(
            action =>
              action.payload.entityType === this._entityType &&
              action.payload.phaseType === EntityActionPhaseEnum.TRIGGER &&
              !action.payload.dirtyMode,
          ),
          mergeMap(action => {
            const bizModel = <U>action.payload.bizModel;
            const bizModelId = action.payload.bizModelId;
            let ret: Observable<IEntities>;
            switch (action.type) {
              case EntityActionTypeEnum.INSERT: {
                ret = this.insert(bizModel, action.payload.files);
                break;
              }
              case EntityActionTypeEnum.DELETE: {
                ret = this.delete(bizModelId);
                break;
              }
              case EntityActionTypeEnum.UPDATE: {
                ret = this.update(bizModel, action.payload.files);
                break;
              }
            }
            return ret.pipe(
              map(data =>
                this.succeededAction(<EntityActionTypeEnum>action.type, data),
              ),
              catchError((errResponse: any) => {
                return of(
                  this.failedAction(
                    <EntityActionTypeEnum>action.type,
                    errResponse.actionError,
                    action.payload.actionId,
                  ),
                );
              }),
              startWith(this.startedAction(<EntityActionTypeEnum>action.type)),
            );
          }),
        );
  }

  private createEpicOfDMLForDirtyMode(): Epic<
    EntityAction,
    EntityAction,
    IAppState
  > {
    return (action$, store$) =>
      action$
        .ofType(
          EntityActionTypeEnum.INSERT,
          EntityActionTypeEnum.DELETE,
          EntityActionTypeEnum.UPDATE,
        )
        .pipe(
          filter(
            action =>
              action.payload.entityType === this._entityType &&
              action.payload.phaseType === EntityActionPhaseEnum.TRIGGER &&
              action.payload.dirtyMode,
          ),
          mergeMap(action => {
            const bizModel = <U>action.payload.bizModel;
            const bizModelId = action.payload.bizModelId;
            let dirtyType: DirtyTypeEnum;
            let ret: Observable<IEntities>;
            switch (action.type) {
              case EntityActionTypeEnum.INSERT: {
                dirtyType = DirtyTypeEnum.CREATED;
                ret = this.insert(bizModel, action.payload.files);
                break;
              }
              case EntityActionTypeEnum.DELETE: {
                dirtyType = DirtyTypeEnum.DELETED;
                ret = this.delete(bizModelId);
                break;
              }
              case EntityActionTypeEnum.UPDATE: {
                dirtyType = DirtyTypeEnum.UPDATED;
                ret = this.update(bizModel, action.payload.files);
                break;
              }
            }
            return ret.pipe(
              map(data =>
                this.succeededAction(<EntityActionTypeEnum>action.type, data),
              ),
              catchError((errResponse: any) => {
                const entities = normalize(
                  [this.afterReceiveInner(bizModel)],
                  this.schema,
                ).entities;
                return of(this.addDirtyAction(bizModel.id, dirtyType)).pipe(
                  concat(
                    of(
                      this.succeededAction(
                        <EntityActionTypeEnum>action.type,
                        entities,
                      ),
                      this.failedAction(
                        <EntityActionTypeEnum>action.type,
                        errResponse.actionError,
                        action.payload.actionId,
                      ),
                    ),
                  ),
                );
              }),
              startWith<any>(
                this.startedAction(<EntityActionTypeEnum>action.type),
                this.removeDirtyAction(bizModel.id),
              ),
            );
          }),
        );
  }
  //#endregion

  //#region Protected methods

  protected insertEntity(
    bizModel: U,
    files: Map<string, any[]>,
    dirtyMode: boolean = false,
  ): Observable<U> {
    const actionId = new ObjectID().toHexString();
    this._store.dispatch(
      this.insertAction(bizModel.id, bizModel, files, dirtyMode, actionId),
    );

    return this.getById(bizModel.id).pipe(
      filter(found => !!found),
      race(
        this._errorService.getActionError$(actionId).pipe(
          map(err => {
            throw err;
          }),
        ),
      ),
      take(1),
    );
  }

  protected updateEntity(
    bizModel: U,
    files: Map<string, any[]>,
    dirtyMode: boolean = false,
  ): Observable<U> {
    if (dirtyMode && this.isDirtyExist(bizModel.id, DirtyTypeEnum.CREATED)) {
      return this.insertEntity(bizModel, files, dirtyMode);
    } else {
      const actionId = new ObjectID().toHexString();
      this._store.dispatch(
        this.updateAction(bizModel.id, bizModel, files, dirtyMode, actionId),
      );

      return this.getById(bizModel.id).pipe(
        skip(1),
        race(
          this._errorService.getActionError$(actionId).pipe(
            map(err => {
              throw err;
            }),
          ),
        ),
        take(1),
      );
    }
  }

  protected deleteEntity(
    bizModel: U | IBiz,
    dirtyMode: boolean = false,
  ): Observable<U> {
    if (dirtyMode && this.isDirtyExist(bizModel.id, DirtyTypeEnum.CREATED)) {
      const entities = normalize(
        this.afterReceiveInner(<U>bizModel),
        this._entitySchema,
      ).entities;
      this._store.dispatch(this.removeDirtyAction(bizModel.id));
      this._store.dispatch(
        this.succeededAction(
          <EntityActionTypeEnum>EntityActionTypeEnum.DELETE,
          entities,
        ),
      );

      return this.getById(bizModel.id).pipe(
        filter(found => !found),
        mapTo(<U>bizModel),
        take(1),
      );
    } else {
      const actionId = new ObjectID().toHexString();
      this._store.dispatch(
        this.deleteAction(bizModel.id, <U>bizModel, dirtyMode, actionId),
      );

      return this.getById(bizModel.id).pipe(
        filter(found => !found),
        mapTo(<U>bizModel),
        race(
          this._errorService.getActionError$(actionId).pipe(
            map(err => {
              throw err;
            }),
          ),
        ),
        take(1),
      );
    }
  }

  protected beforeSend(bizModel: U): any {
    return Object.assign({}, bizModel);
  }

  protected beforeSendInner(record: U | U[]): any[] {
    if (isArray(record)) {
      const ret = [];
      (<U[]>record).forEach(item => {
        ret.push(this.beforeSend(<U>item));
      });
      return ret;
    } else {
      return [this.beforeSend(<U>record)];
    }
  }

  protected search(bizModel: U, searchKey: any): boolean {
    return false;
  }

  //#endregion

  //#region Private methods

  private isDirtyExist(dirtyId: string, dirtyType: DirtyTypeEnum): boolean {
    let found = false;
    const dirtyIds = this._store.getState().dirties.dirtyIds[
      getEntityKey(this._entityType)
    ];

    if (dirtyIds && dirtyIds[dirtyType]) {
      Object.keys(dirtyIds[dirtyType]).forEach(key => {
        if (dirtyIds[dirtyType][key] === dirtyId) {
          found = true;
        }
      });
    }

    return found;
  }

  private insert(
    bizModel: U,
    files: Map<string, any[]>,
  ): Observable<IEntities> {
    const formData: FormData = new FormData();

    formData.append(
      getEntityKey(this._entityType),
      JSON.stringify(this.beforeSendInner(bizModel)),
    );

    if (files && files.size > 0) {
      for (const key of Array.from(files.keys())) {
        for (let i = 0; i < files.get(key).length; i++) {
          formData.append(
            `${key}${i}`,
            files.get(key)[i],
            files.get(key)[i].filename,
          );
        }
      }
    }

    return this._http
      .post(`${this._config.api_host}/${this._url}`, formData)
      .pipe(
        map(records => {
          return normalize(this.afterReceiveInner(records), this.schema)
            .entities;
        }),
      );
  }

  private update(
    bizModel: U,
    files: Map<string, any[]>,
  ): Observable<IEntities> {
    const formData: FormData = new FormData();

    formData.append(
      getEntityKey(this._entityType),
      JSON.stringify(this.beforeSendInner(bizModel)),
    );

    if (files && files.size > 0) {
      for (const key of Array.from(files.keys())) {
        for (let i = 0; i < files.get(key).length; i++) {
          formData.append(
            `${key}${i}`,
            files.get(key)[i],
            files.get(key)[i].name,
          );
        }
      }
    }

    return this._http
      .put(`${this._config.api_host}/${this._url}`, formData)
      .pipe(
        map(records => {
          return normalize(this.afterReceiveInner(records), this.schema)
            .entities;
        }),
      );
  }

  private delete(id: string): Observable<IEntities> {
    return this._http
      .delete(`${this._config.api_host}/${this._url}/${id}`)
      .pipe(
        map(records => {
          return normalize(this.afterReceiveInner(records), this.schema)
            .entities;
        }),
      );
  }
  //#endregion

  //#region Public methdos

  public add(biz: U, files: Map<string, any[]> = null): Observable<U> {
    return this.insertEntity(biz, files);
  }

  public change(biz: U, files: Map<string, any[]> = null): Observable<U> {
    return this.updateEntity(biz, files);
  }

  public remove(biz: U): Observable<U> {
    return this.deleteEntity(biz);
  }

  public addById(id: string) {
    const toAdd = this.byId(id);
    if (!toAdd) {
      throw new Error(`${this._entityType} Id ${id} not exist!`);
    }

    this.insertEntity(toAdd, null, true);
  }

  public changeById(id: string) {
    const toChange = this.byId(id);
    if (!toChange) {
      throw new Error(`${this._entityType} Id ${id} not exist!`);
    }

    this.updateEntity(toChange, null, true);
  }

  public removeById(id: string) {
    this.deleteEntity({ id: id }, true);
  }

  public byId(id: string): U {
    return denormalize(
      id,
      this._entitySchema,
      Immutable(this._store.getState().entities).asMutable({ deep: true }),
    );
  }
  //#endregion
}
