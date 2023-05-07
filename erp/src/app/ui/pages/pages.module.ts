import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthToken } from 'src/app/auth/domain/token';
import { LocalStorageRepository } from 'src/app/shared/infraestructure/local-storage-adapter';
import { SharedModule } from '../shared/shared.module';
import { JwtTokenDecoder } from 'src/app/auth/infrastructure/jwtTokenDecoder.adapter';
import { ComponentsModule } from '../components/components.module';
import { CountdownModule } from 'ngx-countdown';

// Components
import { HomePage } from './home/home';
import { PagesComponent } from './pages.component';
import { LoginPage } from './login/page-login';
import { RegisterPage } from './register/page-register';
import { ErrorPage } from './error/page-error';
import { ComingSoonPage } from './coming-soon/page-coming-soon';

@NgModule({
  declarations: [
    HomePage,
    PagesComponent,
    LoginPage,
    RegisterPage,
    ErrorPage,
    ComingSoonPage,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule,
    SharedModule,
    CountdownModule,
  ],
  providers: [
    AuthToken,
    { provide: 'LocalRepository', useClass: LocalStorageRepository },
    { provide: 'JwtTokenDecoder', useClass: JwtTokenDecoder },
  ],
})
export class PagesModule {}
