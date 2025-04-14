/**
 * Main Modules
 *
 */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppPreloadingStrategy } from './core/app_preloading_strategy';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { MomentModule } from 'ngx-moment';
/**
 * App Pages Components
 *
 */
import { ScreenSizeDetectorComponent } from './layout/screen-size-detector/screen-size-detector.component';
import { PageNotFoundComponent } from './layout/page-not-found/page-not-found.component';
import { AuthInterceptorService } from './core/_interceptors/auth-interceptor.service';
import { HttpResInterceptor } from './core/_interceptors/http-res.interceptor';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { ErrorPageComponent } from './layout/error-page/error-page.component';
import { TimeoutComponent } from './shared/alert/timeout/timeout.component';
import { ConfigService } from './core/_services/shared/config.service';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
/**
 * App Modules, Reducers
 *
 */
import { ScrollYTopComponent } from './shared/scrollytop/scrollytop.component';
import { ThemeService } from './core/_services/shared/theme.service';
import { ComponentsModule } from './shared/components.module';
import { DirectivesModule } from './shared/directives.module';
import { configReducer } from './core/_store/config.reducer';
import { PipesModule } from './shared/pipes.module';
import { AuthModule } from './auth/auth.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { CoreComponentsModule } from './core/_components/core-components.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule
} from '@angular/material/snack-bar';

@NgModule({ declarations: [
        ScreenSizeDetectorComponent,
        PageNotFoundComponent,
        ScrollYTopComponent,
        BreadcrumbComponent,
        ErrorPageComponent,
        HeaderComponent,
        FooterComponent,
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserAnimationsModule,
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
        StoreModule.forRoot({ configList: configReducer })], providers: [
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
    ] })
export class AppModule {
  static injector: Injector;
  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}
