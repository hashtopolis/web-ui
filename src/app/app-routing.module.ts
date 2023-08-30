import { AppPreloadingStrategy } from './core/app_preloading_strategy';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PageNotFoundComponent } from './layout/page-not-found/page-not-found.component';
import { ErrorPageComponent } from './layout/error-page/error-page.component';
import { IsAuth } from './core/_guards/auth.guard';

const appRoutes: Routes = [
    {path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
      data: { preload: true, delay: false }
    },
    {
      path: 'projects',
      loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule),
      data: { preload: true, delay: false }
    },
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
    {path: 'error', component: ErrorPageComponent, data:{message: 'Page Not Found!'} ,canActivate: [IsAuth] },
    {path: 'access-denied', component: ErrorPageComponent, data:{message: 'Sorry, You are not allowed to access this page!'} ,canActivate: [IsAuth] },
    {path: 'not-found', component: PageNotFoundComponent ,canActivate: [IsAuth] },
    {path: '**', redirectTo: 'not-found'}  // Note: Always the last route. Don't change position.
  ];

@NgModule({
    imports: [
        RouterModule.forRoot(
          appRoutes,
          {
    // enableTracing: false, // <-- Debugging purposes only
    preloadingStrategy: AppPreloadingStrategy,
    // When useHash is set to true, Angular uses the # symbol to append the route to the base URL.
    // If it is set false, the route is appended to the URL as a path. This would require server-side configuration.
    // For direct access to URLs, the server needs to be configured to return the index.html file for all requested URLs.
    useHash: true
})
    ],
    exports:[
        RouterModule
    ]
})

export class AppRoutingModule{}
