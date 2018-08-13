import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf,
} from '@angular/core';

export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
  if (parentModule) {
    throw new Error(
      `${moduleName} has already been loaded. Import ${moduleName} in the AppModule only.`,
    );
  }
}

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
})
export class UtilsModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: UtilsModule,
  ) {
    throwIfAlreadyLoaded(parentModule, 'UtilsModule');
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UtilsModule,
      providers: [],
    };
  }
}
