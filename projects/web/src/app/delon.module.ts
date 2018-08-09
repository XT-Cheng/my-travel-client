import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders,
} from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule, ReuseTabStrategy, ReuseTabService } from '@delon/abc';
import { RouteReuseStrategy } from '@angular/router';
import { throwIfAlreadyLoaded } from './core/core.module';
import { DelonAuthModule, JWTInterceptor, DelonAuthConfig } from '@delon/auth';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export function delonAuthConfig(): DelonAuthConfig {
  return Object.assign(new DelonAuthConfig(), <DelonAuthConfig>{
    login_url: '/login',
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
