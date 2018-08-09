import { NgModule } from '@angular/core';
import { RouteRoutingModule } from './routes-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { UserLoginComponent } from './passport/login/login.component';

const COMPONENTS = [DashboardComponent, UserLoginComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [RouteRoutingModule, SharedModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class RoutesModule {}
