/**
 * Main Modules
 *
*/
import { NgModule } from '@angular/core';
import { AppPreloadingStrategy } from './core/app_preloading_strategy';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Todo PrimeNG

/**
 * App Pages Components
 *
*/
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './layout/page-not-found/page-not-found.component';
import { ErrorPageComponent } from './layout/error-page/error-page.component';
import { AuthInterceptorService } from './core/_interceptors/auth-interceptor.service';
/**
 * App Modules
 *
*/
import { ComponentsModule } from './shared/components.module';
import { AuthModule } from './auth/auth.module';
import { DirectivesModule } from './shared/directives.module';
import { PipesModule } from './shared/pipes.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BreadcrumbComponent,
    BreadcrumbComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    FontAwesomeModule,
    DataTablesModule,
    CommonModule,
    AuthModule,
    DirectivesModule,
    PipesModule,
    ComponentsModule,
    AppRoutingModule  // Main routes for the App

  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}, AppPreloadingStrategy],
  bootstrap: [AppComponent]
})
export class AppModule {

}

