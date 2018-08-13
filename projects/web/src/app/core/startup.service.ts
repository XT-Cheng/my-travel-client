import { Injectable, Inject } from '@angular/core';
import { createEpicMiddleware } from 'redux-observable';
import { NgRedux } from '@angular-redux/store';
import {
  DataFlushService,
  IAppState,
  rootReducer,
  RootEpics,
  INIT_APP_STATE,
} from 'store';
import { deepExtend } from 'utils';
import * as Immutable from 'seamless-immutable';
import { createLogger } from 'redux-logger';
import { stateTransformer } from 'redux-seamless-immutable';
import {
  DA_STORE_TOKEN,
  IStore,
  DelonAuthConfig,
  DA_SERVICE_TOKEN,
  TokenService,
  JWTTokenModel,
} from '@delon/auth';
import { UserService } from 'store';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable({ providedIn: 'root' })
export class StartupService {
  constructor(
    private _dataService: DataFlushService,
    private _store: NgRedux<IAppState>,
    private _rootEpics: RootEpics,
    private _authConfig: DelonAuthConfig,
    private _userSrv: UserService,
    @Inject(DA_STORE_TOKEN) private _storeSrv: IStore,
    @Inject(DA_SERVICE_TOKEN) private _tokenService: TokenService,
  ) {}

  private viaHttp(resolve: any, reject: any) {
    resolve({});
  }

  // TODO: Retrieve required information from local storage
  private viaLocalStorage(resolve: any, reject: any) {
    const epicMiddleware = createEpicMiddleware();
    this._store.configureStore(
      rootReducer,
      <any>(
        Immutable(deepExtend(INIT_APP_STATE, this._dataService.restoreState()))
      ),
      [createLogger({ stateTransformer: stateTransformer }), epicMiddleware],
    );

    epicMiddleware.run(this._rootEpics.createEpics());

    const jwt = new JWTTokenModel();
    jwt.token = this._storeSrv.get(this._authConfig.store_key).token;

    if (jwt.token && !jwt.isExpired()) {
      const { id, name, nick, picture } = jwt.payload;
      const userBiz = {
        id,
        name,
        nick,
        picture,
      };
      this._userSrv.setCurrentUser(userBiz);
    }

    resolve(null);

    // .then(() => this._storage.get(TokenStorage.TOKEN_KEY))
    // .then(value => this._tokenService.setRaw(value))
    // .then(_ => this._masterService.fetch())
    // .then(_ => {
    // });
  }

  private viaMock(resolve: any, reject: any) {
    resolve({});
  }

  load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.viaLocalStorage(resolve, reject);
    });
  }
}
