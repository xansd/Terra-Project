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
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule,
    SharedModule,
    NgbModule,
  ],
  providers: [
    AuthToken,
    { provide: 'LocalRepository', useClass: LocalStorageRepository },
    { provide: 'JwtTokenDecoder', useClass: JwtTokenDecoder },
    { provide: 'authAPI', useClass: AuthAPIAdapter },
    { provide: 'usersAPI', useClass: UsersAPIRepository },
    { provide: 'partnersAPI', useClass: PartnerAPIRepository },
    { provide: 'productsAPI', useClass: ProductAPIRepository },
    { provide: 'authToken', useClass: AuthToken },
    { provide: 'registerUserIO', useClass: RegisterActiveUserUseCase },
    { provide: 'unRegisterUserIO', useClass: UnRegisterActiveUserUseCase },
    { provide: MatPaginatorIntl, useValue: getSpaninhPaginatorIntl() },
  ],
})
export class PagesModule {}
