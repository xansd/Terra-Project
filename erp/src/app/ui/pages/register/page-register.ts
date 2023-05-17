import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AppSettings, ISettings } from '../../services/app-settings.service';
import { PageRoutes } from '../pages-info.config';

@Component({
  selector: 'page-register',
  templateUrl: './page-register.html',
})
export class RegisterPage implements OnInit {
  public pageRoutes = PageRoutes;
  constructor(
    private router: Router,
    private appSettings: AppSettings,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.updateAppSettingsOnInint();
      this.cdref.detectChanges();
    });
  }

  ngOnDestroy() {
    this.updateAppSettingsOnDestroy();
    this.cdref.detectChanges();
  }

  updateAppSettingsOnInint() {
    const updatedSettings: ISettings = {
      appHeaderNone: true,
      appSidebarNone: true,
      appContentClass: 'p-0',
    };
    this.appSettings.updateAppSettings(updatedSettings);
  }

  updateAppSettingsOnDestroy() {
    const updatedSettings: ISettings = {
      appSidebarNone: false,
      appHeaderNone: false,
      appContentClass: '',
    };
    this.appSettings.updateAppSettings(updatedSettings);
  }

  formSubmit(f: NgForm) {
    this.router.navigate(['/']);
  }
}
