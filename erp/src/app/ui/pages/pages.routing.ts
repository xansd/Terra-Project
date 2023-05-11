import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { HomePage } from './home/home';
import { LoginPage } from './login/page-login';
import { RegisterPage } from './register/page-register';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { UserStatisticsComponent } from './users/user-statistics/user-statistics.component';
const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'inicio',
        component: HomePage,
      },
      {
        path: 'login',
        component: LoginPage,
      },
      {
        path: 'registro',
        component: RegisterPage,
      },
      {
        path: 'usuarios',
        children: [
          {
            path: 'listado',
            component: ListUsersComponent,
          },
          {
            path: 'estadisticas',
            component: UserStatisticsComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
