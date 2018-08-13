import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { DelonABCModule, ReuseTabService, ReuseTabStrategy } from '@delon/abc';
import { DelonAuthConfig, DelonAuthModule, JWTInterceptor } from '@delon/auth';
import { AlainThemeModule } from '@delon/theme';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { throwIfAlreadyLoaded } from 'utils';

export function delonAuthConfig(): DelonAuthConfig {
  return Object.assign(new DelonAuthConfig(), <DelonAuthConfig>{
    login_url: '/auth/login',
  });
}

@NgModule({
  imports: [
    NgZorroAntdModule.forRoot(),
    AlainThemeModule.forRoot(),
    DelonABCModule.forRoot(),
    DelonAuthModule.forRoot(),
  ],
})
export class DelonModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: DelonModule,
  ) {
    throwIfAlreadyLoaded(parentModule, 'DelonModule');
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DelonModule,
      providers: [
        {
          provide: RouteReuseStrategy,
          useClass: ReuseTabStrategy,
          deps: [ReuseTabService],
        },
        { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
        { provide: DelonAuthConfig, useFactory: delonAuthConfig },
      ],
    };
  }
}
