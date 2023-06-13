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
import { ListProductsComponent } from './products/list-products/list-products.component';
import { ProductsStatisticsComponent } from './products/products-statistics/products-statistics.component';
import { ProductsComponent } from './products/products.component';
import { ProductsDetailsComponent } from './products/products-details/products-details.component';
import { PartnersStatisticsComponent } from './partners/partners-statistics/partners-statistics.component';
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
        data: { roles: [Roles.ADMIN, Roles.USER, Roles.SYS] },
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
            redirectTo: 'detalles',
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
          {
            path: 'alta',
            component: DetailsPartnerComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'estadisticas',
            component: PartnersStatisticsComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
        ],
      },
      {
        path: 'variedades',
        component: ProductsComponent,
        children: [
          {
            path: '',
            redirectTo: 'detalles',
            pathMatch: 'full',
          },
          {
            path: 'detalles',
            component: ProductsDetailsComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'listado',
            component: ListProductsComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'estadisticas',
            component: ProductsStatisticsComponent,
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
