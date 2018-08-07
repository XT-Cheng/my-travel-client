import { NgModule } from '@angular/core';
import { LayoutDefaultComponent } from './default/default.component';
import { SharedModule } from '../shared/shared.module';
import { SidebarComponent } from './default/sidebar/sidebar.component';
import { HeaderComponent } from './default/header/header.component';
import { HeaderUserComponent } from './default/header/components/user.component';
import { HeaderTaskComponent } from './default/header/components/task.component';
import { HeaderSearchComponent } from './default/header/components/search.component';
import { HeaderNotifyComponent } from './default/header/components/notify.component';
import { HeaderIconComponent } from './default/header/components/icon.component';
import { HeaderFullScreenComponent } from './default/header/components/fullscreen.component';

const COMPONENTS = [
  LayoutDefaultComponent,
  SidebarComponent
];

const HEADERCOMPONENTS = [
  HeaderComponent,
  HeaderFullScreenComponent,
  HeaderIconComponent,
  HeaderNotifyComponent,
  HeaderSearchComponent,
  HeaderTaskComponent,
  HeaderUserComponent
];

@NgModule({
  imports: [SharedModule],
  providers: [],
  declarations: [
    ...COMPONENTS,
    ...HEADERCOMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ]
})
export class LayoutModule { }
