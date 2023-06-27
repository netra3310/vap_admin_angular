import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
// import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { environment } from 'src/environments/environment';
import { PermissionService, loadPermissionsFactory } from "./shared/services/permission.service";
import { AuthInterceptor } from './Service/auth.interceptor';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { SharedModule } from './shared/shared.module';
import { GlobalErrorHandler } from './global-error-handler';
import { ServerErrorInterceptor } from './server-error.interceptor';
// import { registerLocaleData } from '@angular/common';
// import localeFrCa from '@angular/common/locales/fr-CA';
// import localeFrCaExtra from '@angular/common/locales/extra/fr-CA';

// registerLocaleData(localeFrCa, localeFrCaExtra);

function appInitializer(authService: AuthService) {
  return () => false
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    NgxPermissionsModule.forRoot(),
    SharedModule,
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      deps: [PermissionService],
      useFactory: loadPermissionsFactory,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
