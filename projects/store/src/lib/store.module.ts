import { NgReduxModule } from '@angular-redux/store';
import { HttpClientModule } from '@angular/common/http';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';

import { EntityEpics } from './entity/entity.epic';
import { CityService } from './providers/city.service';
import { CityUIService } from './providers/city.ui.service';
import { DataFlushService } from './providers/dataFlush.service';
import { ErrorService } from './providers/error.service';
import { FilterCategoryService } from './providers/filterCategory.service';
import { MasterDataService } from './providers/masterData.service';
import { TransportationCategoryService } from './providers/transportationCategory.service';
import { TravelAgendaService } from './providers/travelAgenda.service';
import { TravelAgendaUIService } from './providers/travelAgenda.ui.service';
import { UserService } from './providers/user.service';
import { ViewPointService } from './providers/viewPoint.service';
import { ViewPointUIService } from './providers/viewPoint.ui.service';
import { ViewPointCategoryService } from './providers/viewPointCategory.service';
import { RootEpics } from './store.epic';
import { SearchService } from './providers/search.service';

const PROVIDERS = [
  ErrorService,
  RootEpics,
  EntityEpics,
  CityService,
  ViewPointService,
  UserService,
  FilterCategoryService,
  MasterDataService,
  TravelAgendaService,
  TravelAgendaUIService,
  ViewPointCategoryService,
  TransportationCategoryService,
  CityUIService,
  ViewPointUIService,
  DataFlushService,
  SearchService,
];

function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
  if (parentModule) {
    throw new Error(
      `${moduleName} has already been loaded. Import ${moduleName} in the AppModule only.`,
    );
  }
}

@NgModule({
  imports: [NgReduxModule, HttpClientModule],
})
export class StoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: StoreModule,
  ) {
    throwIfAlreadyLoaded(parentModule, 'StoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: StoreModule,
      providers: [...PROVIDERS],
    };
  }
}
