import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { HomePage } from './home/home';
import { LoginPage } from './login/page-login';
import { RegisterPage } from './register/page-register';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
