import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { HomePage } from './home/home';
import { LoginPage } from './login/page-login';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { UserStatisticsComponent } from './users/user-statistics/user-statistics.component';
import { RestorePasswordComponent } from './restore-password/restore-password.component';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from 'src/app/users/domain/roles';
import { UsersComponent } from './users/users.component';
import { PartnersComponent } from './partners/partners.component';
import { ListPartnersComponent } from './partners/list-partners/list-partners.component';
import { DetailsPartnerComponent } from './partners/details-partner/details-partner.component';
const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'inicio',
        component: HomePage,
        canActivate: [AuthGuard],
        data: { roles: [Roles.ADMIN, Roles.USER] },
      },
      {
        path: 'usuarios',
        component: UsersComponent,
        children: [
          {
            path: '',
            redirectTo: 'listado',
            pathMatch: 'full',
          },
          {
            path: 'listado',
            component: ListUsersComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN] },
          },
          {
            path: 'online',
            component: UserStatisticsComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN] },
          },
        ],
      },
      {
        path: 'socios',
        component: PartnersComponent,
        children: [
          {
            path: '',
            redirectTo: 'listado',
            pathMatch: 'full',
          },
          {
            path: 'listado',
            component: ListPartnersComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'detalles',
            component: DetailsPartnerComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'reset-password',
    component: RestorePasswordComponent,
    data: { roles: [Roles.ADMIN, Roles.USER] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
