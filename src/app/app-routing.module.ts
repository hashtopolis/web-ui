
import { NgModule } from '@angular/core';
import { AppPreloadingStrategy } from './core/app_preloading_strategy';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './layout/page-not-found/page-not-found.component';
import { ErrorPageComponent } from './layout/error-page/error-page.component';
import { AuthGuard } from './core/_guards/auth.guard';

const appRoutes: Routes = [
    {path: '', component: HomeComponent, data: { breadcrumb: 'Home'}, canActivate: [AuthGuard] },
    {
      path: 'agents',
      loadChildren: () => import('./agents/agent.module').then(m => m.AgentsModule),
      data: { preload: true, delay: false }
    },
    {
      path: 'tasks',
      loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule),
      data: { preload: true, delay: false }
    },
    {
      path: 'hashlists',
      loadChildren: () => import('./hashlists/hashlists.module').then(m => m.HashlistModule),
      data: { preload: true, delay: true }
    },
    {
      path: 'files',
      loadChildren: () => import('./files/files.module').then(m => m.FilesModule),
      data: { preload: false, delay: false }
    },
    {
      path: 'account',
      loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
      data: { preload: false, delay: false }
    },
    {
      path: 'users',
      loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
      data: { preload: false, delay: false }
    },
    {
      path: 'config',
      loadChildren: () => import('./config/config.module').then(m => m.ConfigModule),
      data: { preload: false, delay: false }
    },
    {path: 'error', component: ErrorPageComponent, data:{message: 'Page Not Found!'} ,canActivate: [AuthGuard] },
    {path: 'not-found', component: PageNotFoundComponent ,canActivate: [AuthGuard] },
    {path: '**', redirectTo: 'not-found'}  // Note: Always the last route
  ];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
          preloadingStrategy: AppPreloadingStrategy,
          relativeLinkResolution: 'corrected',
          useHash: true  // Old browsers could have issues but can be fix with hash
      })
    ],
    exports:[
        RouterModule
    ]
})

export class AppRoutingModule{}
