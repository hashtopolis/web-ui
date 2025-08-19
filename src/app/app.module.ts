import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { StoreModule } from '@ngrx/store';
import { DataTablesModule } from 'angular-datatables';
import { MomentModule } from 'ngx-moment';

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Injector, NgModule, inject, provideAppInitializer } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppInitService } from '@services/app-init.service';
import { ConfigService } from '@services/shared/config.service';
import { ThemeService } from '@services/shared/theme.service';

import { CoreComponentsModule } from '@components/core-components.module';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { AuthModule } from '@src/app/auth/auth.module';
import { AuthInterceptorService } from '@src/app/core/_interceptors/auth-interceptor.service';
import { HttpResInterceptor } from '@src/app/core/_interceptors/http-res.interceptor';
import { configReducer } from '@src/app/core/_store/config.reducer';
import { AppPreloadingStrategy } from '@src/app/core/app_preloading_strategy';
import { ErrorPageComponent } from '@src/app/layout/error-page/error-page.component';
import { FooterComponent } from '@src/app/layout/footer/footer.component';
import { HeaderComponent } from '@src/app/layout/header/header.component';
import { PageNotFoundComponent } from '@src/app/layout/page-not-found/page-not-found.component';
import { ScreenSizeDetectorComponent } from '@src/app/layout/screen-size-detector/screen-size-detector.component';
import { BreadcrumbComponent } from '@src/app/shared/breadcrumb/breadcrumb.component';
import { ComponentsModule } from '@src/app/shared/components.module';
import { DirectivesModule } from '@src/app/shared/directives.module';
import { PipesModule } from '@src/app/shared/pipes.module';
import { ScrollYTopComponent } from '@src/app/shared/scrollytop/scrollytop.component';

@NgModule({
  declarations: [
    ScreenSizeDetectorComponent,
    PageNotFoundComponent,
    ScrollYTopComponent,
    BreadcrumbComponent,
    ErrorPageComponent,
    HeaderComponent,
    FooterComponent,
    AppComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DirectivesModule,
    DataTablesModule,
    ComponentsModule,
    BrowserModule,
    CommonModule,
    MomentModule,
    PipesModule,
    FormsModule,
    AuthModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatTooltipModule,
    MatSnackBarModule,
    CoreComponentsModule,
    NgbModule,
    AppRoutingModule, // Main routes for the App
    NgIdleKeepaliveModule.forRoot(),
    StoreModule.forRoot({ configList: configReducer })
  ],
  providers: [
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpResInterceptor,
      multi: true
    },
    provideAppInitializer(() => inject(AppInitService).initializeApp()),
    ThemeService,
    AppPreloadingStrategy,
    ConfigService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500, verticalPosition: 'top' }
    },
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppModule {
  static injector: Injector;
  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}
