import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { HomePage } from './home/home';
import { PagesComponent } from './pages.component';
import { LoginPage } from './login/page-login';
import { RegisterPage } from './register/page-register';
import { ComponentsModule } from '../components/components.module';
import { ErrorPage } from './error/page-error';
import { AuthToken } from 'src/app/auth/domain/token';
import { LocalStorageRepository } from 'src/app/shared/infraestructure/local-storage-adapter';
import { JwtTokenDecoder } from 'src/app/auth/infrastructure/jwtTokenDecoder';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [HomePage, PagesComponent, LoginPage, RegisterPage, ErrorPage],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule,
    SharedModule,
  ],
  providers: [
    AuthToken,
    { provide: 'LocalRepository', useClass: LocalStorageRepository },
    { provide: 'JwtTokenDecoder', useClass: JwtTokenDecoder },
  ],
})
export class PagesModule {}
