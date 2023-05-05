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

@NgModule({
  declarations: [HomePage, PagesComponent, LoginPage, RegisterPage, ErrorPage],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule,
  ],
})
export class PagesModule {}
