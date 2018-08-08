import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { DelonModule } from './delon.module';
import { CoreModule } from './core/core.module';
import { UtilsModule } from 'utils';
import { StartupService } from './core/startup.service';
import { LayoutModule } from './layouts/layout.module';
import { RoutesModule } from './routes/routes.module';
import { SharedModule } from './shared/shared.module';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { I18NService } from './core/i18n/service';
import { TranslateModule } from '@ngx-translate/core';
import { AuthModule } from 'auth';
import { IonicStorageModule } from '@ionic/storage';

export function StartupServiceFactory(
  startupService: StartupService,
): Function {
  return () => startupService.load();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    RoutesModule,
    TranslateModule.forRoot(),
    UtilsModule.forRoot(),
    DelonModule.forRoot(),
    CoreModule.forRoot(),
    AuthModule.forRoot(),
    IonicStorageModule.forRoot(),
    LayoutModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: StartupServiceFactory,
      deps: [StartupService],
      multi: true,
    },
    { provide: ALAIN_I18N_TOKEN, useClass: I18NService, multi: false },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
