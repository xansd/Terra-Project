import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AppSettings } from '../../service/app-settings.service';
import { PagesRoutes } from '../pages-routes.enum';

@Component({
  selector: 'page-login',
  templateUrl: './page-login.html',
  styleUrls: ['./page-login.scss'],
})
export class LoginPage {
  public pageRoutes = PagesRoutes;
  constructor(private router: Router, private appSettings: AppSettings) {}

  ngOnInit() {
    this.appSettings.appSidebarNone = true;
    this.appSettings.appHeaderNone = true;
    this.appSettings.appContentClass = 'p-0';
  }

  ngOnDestroy() {
    this.appSettings.appSidebarNone = false;
    this.appSettings.appHeaderNone = false;
    this.appSettings.appContentClass = '';
  }

  formSubmit(f: NgForm) {
    this.router.navigate(['/']);
  }
}
