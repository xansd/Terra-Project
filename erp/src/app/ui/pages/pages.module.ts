import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthToken } from 'src/app/auth/domain/token';
import { LocalStorageRepository } from 'src/app/shared/infraestructure/local-storage-adapter';
import { SharedModule } from '../shared/shared.module';
import { JwtTokenDecoder } from 'src/app/auth/infrastructure/jwtTokenDecoder.adapter';
import { ComponentsModule } from '../components/components.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyPipe } from '@angular/common';

// Components
import { HomePage } from './home/home';
import { PagesComponent } from './pages.component';
import { LoginPage } from './login/page-login';
import { ErrorPage } from './error/page-error';
import { PartnersComponent } from './partners/partners.component';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { UserStatisticsComponent } from './users/user-statistics/user-statistics.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { AuthAPIAdapter } from 'src/app/auth/infrastructure/auth-api.adapter';
import { ClickOutsideDirective } from '../directives/click-outside.directive';
import { getSpaninhPaginatorIntl } from '../shared/helpers/mat-paginator-esp.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { RestorePasswordComponent } from './restore-password/restore-password.component';
import { UsersComponent } from './users/users.component';
import { UsersAPIRepository } from 'src/app/users/infrastructure/user-api.repository';
import { RegisterActiveUserUseCase } from 'src/app/users/application/socket-io/register-user-io.case-use';
import { UnRegisterActiveUserUseCase } from 'src/app/users/application/socket-io/unregister-user-io.use-case';
import { ListPartnersComponent } from './partners/list-partners/list-partners.component';
import { CreatePartnerComponent } from './partners/create-partner/create-partner.component';
import { EditPartnerComponent } from './partners/edit-partner/edit-partner.component';
import { DetailsPartnerComponent } from './partners/details-partner/details-partner.component';
import { PartnerAPIRepository } from 'src/app/partners/infrastructure/partner-api.repository';
import { ProductAPIRepository } from 'src/app/products/infrastructure/products-api.repository';
import { PartnersStatisticsComponent } from './partners/partners-statistics/partners-statistics.component';
import { VarietiesComponent } from './varieties/varieties.component';
import { CreateVarietiesComponent } from './varieties/create-varieties/create-varieties.component';
import { EditVarietiesComponent } from './varieties/edit-varieties/edit-varieties.component';
import { ListVarietiesComponent } from './varieties/list-varieties/list-varieties.component';
import { VarietiesDetailsComponent } from './varieties/varieties-details/varieties-details.component';
import { VarietiesStatisticsComponent } from './varieties/varieties-statistics/varieties-statistics.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { ListProductsComponent } from './products/list-products/list-products.component';
import { ProductsDetailsComponent } from './products/products-details/products-details.component';
import { ProductsStatisticsComponent } from './products/products-statistics/products-statistics.component';
import { ProductsComponent } from './products/products.component';
import { TransactionsAPIRepository } from 'src/app/transactions/infrastructure/transactions-api.repository';
import { PaymentsAPIRepository } from 'src/app/payments/infrastructure/payments-api.repository';
import { PurchasesAPIRepository } from 'src/app/purchases/infrastructure/purchases-api.repository';
import { SalesAPIRepository } from 'src/app/sales/infrastructure/sales-api.repository';
import { ProvidersAPIRepository } from 'src/app/providers/infrastructure/providers-api.repository';
import { PurchasesComponent } from './purchases/purchases.component';
import { HarvestsComponent } from './harvests/harvests.component';
import { CreateHarvestComponent } from './harvests/create-harvest/create-harvest.component';
import { EditHarvestComponent } from './harvests/edit-harvest/edit-harvest.component';
import { ListHarvestsComponent } from './harvests/list-harvests/list-harvests.component';
import { DetailsHarvestsComponent } from './harvests/details-harvests/details-harvests.component';
import { StatisticsHarvestsComponent } from './harvests/statistics-harvests/statistics-harvests.component';
import { ListPurchasesComponent } from './purchases/list-purchases/list-purchases.component';
import { StatisticsPurchasesComponent } from './purchases/statistics-purchases/statistics-purchases.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from '../shared/material.module';
import { ProvidersComponent } from './providers/providers.component';
import { CultivatorsComponent } from './cultivators/cultivators.component';
import { CreateCultivatorComponent } from './cultivators/create-cultivator/create-cultivator.component';
import { EditCultivatorComponent } from './cultivators/edit-cultivator/edit-cultivator.component';
import { ListCultivatorComponent } from './cultivators/list-cultivator/list-cultivator.component';
import { DetailsCultivatorComponent } from './cultivators/details-cultivator/details-cultivator.component';
import { CreateProviderComponent } from './providers/create-provider/create-provider.component';
import { EditProviderComponent } from './providers/edit-provider/edit-provider.component';
import { ListProviderComponent } from './providers/list-provider/list-provider.component';
import { StatisticsProviderComponent } from './providers/statistics-provider/statistics-provider.component';
import { StatisticsCultivatorComponent } from './cultivators/statistics-cultivator/statistics-cultivator.component';
import { CreatePurchaseComponent } from './purchases/create-purchase/create-purchase.component';
import { EditPurchaseComponent } from './purchases/edit-purchase/edit-purchase.component';
import { DetailsProviderComponent } from './providers/details-provider/details-provider.component';
import { DetailsPurchasesComponent } from './purchases/details-purchases/details-purchases.component';
import { ListTransactionsComponent } from './transactions/list-transactions/list-transactions.component';
import { BalanceComponent } from './transactions/balance/balance.component';
import { AccountsComponent } from './transactions/accounts/accounts.component';
import { CreateTransactionComponent } from './transactions/create-transaction/create-transaction.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { DetailsTransactionsComponent } from './transactions/details-transactions/details-transactions.component';
import { StatisticsTransactionsComponent } from './transactions/statistics-transactions/statistics-transactions.component';

@NgModule({
  declarations: [
    HomePage,
    PagesComponent,
    LoginPage,
    ErrorPage,
    PartnersComponent,
    UserStatisticsComponent,
    ListUsersComponent,
    EditUserComponent,
    CreateUserComponent,
    ClickOutsideDirective,
    RestorePasswordComponent,
    UsersComponent,
    ListPartnersComponent,
    CreatePartnerComponent,
    EditPartnerComponent,
    DetailsPartnerComponent,
    ListProductsComponent,
    CreateProductComponent,
    EditProductComponent,
    ProductsComponent,
    ProductsStatisticsComponent,
    ProductsDetailsComponent,
    PartnersStatisticsComponent,
    VarietiesComponent,
    CreateVarietiesComponent,
    EditVarietiesComponent,
    ListVarietiesComponent,
    VarietiesDetailsComponent,
    VarietiesStatisticsComponent,
    PurchasesComponent,
    HarvestsComponent,
    CreateHarvestComponent,
    EditHarvestComponent,
    ListHarvestsComponent,
    DetailsHarvestsComponent,
    StatisticsHarvestsComponent,
    ListPurchasesComponent,
    StatisticsPurchasesComponent,
    ProvidersComponent,
    CultivatorsComponent,
    CreateCultivatorComponent,
    EditCultivatorComponent,
    ListCultivatorComponent,
    DetailsCultivatorComponent,
    CreateProviderComponent,
    EditProviderComponent,
    ListProviderComponent,
    StatisticsProviderComponent,
    StatisticsCultivatorComponent,
    CreatePurchaseComponent,
    EditPurchaseComponent,
    DetailsProviderComponent,
    DetailsPurchasesComponent,
    ListTransactionsComponent,
    BalanceComponent,
    AccountsComponent,
    CreateTransactionComponent,
    TransactionsComponent,
    DetailsTransactionsComponent,
    StatisticsTransactionsComponent,
  ],
  imports: [
    NgxPaginationModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule,
    SharedModule,
    NgbModule,
    MaterialModule,
  ],
  providers: [
    AuthToken,
    { provide: 'LocalRepository', useClass: LocalStorageRepository },
    { provide: 'JwtTokenDecoder', useClass: JwtTokenDecoder },
    { provide: 'authAPI', useClass: AuthAPIAdapter },
    { provide: 'usersAPI', useClass: UsersAPIRepository },
    { provide: 'partnersAPI', useClass: PartnerAPIRepository },
    { provide: 'productsAPI', useClass: ProductAPIRepository },
    { provide: 'transactionsAPI', useClass: TransactionsAPIRepository },
    { provide: 'paymentsAPI', useClass: PaymentsAPIRepository },
    { provide: 'purchasesAPI', useClass: PurchasesAPIRepository },
    { provide: 'salesAPI', useClass: SalesAPIRepository },
    { provide: 'providersAPI', useClass: ProvidersAPIRepository },
    { provide: 'authToken', useClass: AuthToken },
    { provide: 'registerUserIO', useClass: RegisterActiveUserUseCase },
    { provide: 'unRegisterUserIO', useClass: UnRegisterActiveUserUseCase },
    { provide: MatPaginatorIntl, useValue: getSpaninhPaginatorIntl() },
  ],
})
export class PagesModule {}
