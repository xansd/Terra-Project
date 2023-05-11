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
import { RegisterPage } from './register/page-register';
import { ErrorPage } from './error/page-error';
import { PartnersComponent } from './partners/partners.component';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { UserStatisticsComponent } from './users/user-statistics/user-statistics.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { ActivateUserUseCase } from 'src/app/users/application/use-cases/activate-user.use-case';
import { BlockUserUseCase } from 'src/app/users/application/use-cases/block-user.use-case';
import { updateRoleUserUseCase } from 'src/app/users/application/use-cases/update-rol.case-use';
import { AuthAPIAdapter } from 'src/app/auth/infrastructure/auth-api.adapter';
import { UsersAPIAdapter } from 'src/app/users/infrastructure/user-api.adapter';

@NgModule({
  declarations: [
    HomePage,
    PagesComponent,
    LoginPage,
    RegisterPage,
    ErrorPage,
    PartnersComponent,
    UserStatisticsComponent,
    ListUsersComponent,
    EditUserComponent,
    CreateUserComponent,
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
    { provide: 'usersAPI', useClass: UsersAPIAdapter },
  ],
})
export class PagesModule {}
