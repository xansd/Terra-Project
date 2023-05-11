import { AppSettings } from '../../services/app-settings.service';
import { Component } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.html',
})
export class HomePage {
  constructor(private appSettings: AppSettings) {}
  ngOnInit() {
    this.appSettings.appSidebarNone = false;
    this.appSettings.appHeaderNone = false;
    this.appSettings.appContentClass = '';
  }

  ngOnDestroy() {
    this.appSettings.appSidebarNone = false;
    this.appSettings.appHeaderNone = false;
    this.appSettings.appContentClass = '';
  }
}
