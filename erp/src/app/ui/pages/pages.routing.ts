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
import { PartnersStatisticsComponent } from './partners/partners-statistics/partners-statistics.component';
import { VarietiesComponent } from './varieties/varieties.component';
import { VarietiesDetailsComponent } from './varieties/varieties-details/varieties-details.component';
import { ListVarietiesComponent } from './varieties/list-varieties/list-varieties.component';
import { VarietiesStatisticsComponent } from './varieties/varieties-statistics/varieties-statistics.component';
import { ProductsComponent } from './products/products.component';
import { ListProductsComponent } from './products/list-products/list-products.component';
import { ProductsStatisticsComponent } from './products/products-statistics/products-statistics.component';
import { HarvestsComponent } from './harvests/harvests.component';
import { DetailsHarvestsComponent } from './harvests/details-harvests/details-harvests.component';
import { ListHarvestsComponent } from './harvests/list-harvests/list-harvests.component';
import { StatisticsHarvestsComponent } from './harvests/statistics-harvests/statistics-harvests.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { ListPurchasesComponent } from './purchases/list-purchases/list-purchases.component';
import { StatisticsPurchasesComponent } from './purchases/statistics-purchases/statistics-purchases.component';
import { ProvidersComponent } from './providers/providers.component';
import { StatisticsProviderComponent } from './providers/statistics-provider/statistics-provider.component';
import { ListProviderComponent } from './providers/list-provider/list-provider.component';
import { CultivatorsComponent } from './cultivators/cultivators.component';
import { DetailsCultivatorComponent } from './cultivators/details-cultivator/details-cultivator.component';
import { ListCultivatorComponent } from './cultivators/list-cultivator/list-cultivator.component';
import { StatisticsCultivatorComponent } from './cultivators/statistics-cultivator/statistics-cultivator.component';
import { DetailsProviderComponent } from './providers/details-provider/details-provider.component';
import { ProductsDetailsComponent } from './products/products-details/products-details.component';
import { DetailsPurchasesComponent } from './purchases/details-purchases/details-purchases.component';
import { AccountingDetailsComponent } from './accounting/accounting-details/accounting-details.component';
import { AccountingComponent } from './accounting/accounting.component';
import { ListTransactionsComponent } from './accounting/list-transactions/list-transactions.component';
import { ListPaymentsComponent } from './accounting/list-payments/list-payments.component';
import { BalanceComponent } from './accounting/balance/balance.component';
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
        component: VarietiesComponent,
        children: [
          {
            path: '',
            redirectTo: 'detalles',
            pathMatch: 'full',
          },
          {
            path: 'detalles',
            component: VarietiesDetailsComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'listado',
            component: ListVarietiesComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'estadisticas',
            component: VarietiesStatisticsComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
        ],
      },
      {
        path: 'productos',
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
      {
        path: 'cultivos',
        component: HarvestsComponent,
        children: [
          {
            path: '',
            redirectTo: 'detalles',
            pathMatch: 'full',
          },
          {
            path: 'detalles',
            component: DetailsHarvestsComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'listado',
            component: ListHarvestsComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'estadisticas',
            component: StatisticsHarvestsComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
        ],
      },
      {
        path: 'compras',
        component: PurchasesComponent,
        children: [
          {
            path: '',
            redirectTo: 'detalles',
            pathMatch: 'full',
          },
          {
            path: 'detalles',
            component: DetailsPurchasesComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'listado',
            component: ListPurchasesComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'estadisticas',
            component: StatisticsPurchasesComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
        ],
      },
      {
        path: 'proveedores',
        component: ProvidersComponent,
        children: [
          {
            path: '',
            redirectTo: 'detalles',
            pathMatch: 'full',
          },
          {
            path: 'listado',
            component: ListProviderComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'detalles',
            component: DetailsProviderComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'estadisticas',
            component: StatisticsProviderComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
        ],
      },
      {
        path: 'cultivadores',
        component: CultivatorsComponent,
        children: [
          {
            path: '',
            redirectTo: 'detalles',
            pathMatch: 'full',
          },
          {
            path: 'detalles',
            component: DetailsCultivatorComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'listado',
            component: ListCultivatorComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'estadisticas',
            component: StatisticsCultivatorComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
        ],
      },
      {
        path: 'registros-contables',
        component: AccountingComponent,
        children: [
          {
            path: '',
            redirectTo: 'detalles',
            pathMatch: 'full',
          },
          {
            path: 'detalles',
            component: AccountingDetailsComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'transacciones/listado',
            component: ListTransactionsComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'pagos/listado',
            component: ListPaymentsComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
          {
            path: 'balance',
            component: BalanceComponent,
            canActivate: [AuthGuard],
            data: { roles: [Roles.ADMIN, Roles.USER] },
          },
        ],
      },
      {
        path: 'balance',
        component: BalanceComponent,
        canActivate: [AuthGuard],
        data: { roles: [Roles.ADMIN, Roles.USER] },
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
