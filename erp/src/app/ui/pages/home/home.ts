import { AppSettings, ISettings } from '../../services/app-settings.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.html',
})
export class HomePage {
  constructor(
    private appSettings: AppSettings,
    private cdref: ChangeDetectorRef
  ) {}
  // ngOnInit() {
  //   setTimeout(() => {
  //     this.updateAppSettingsOnInint();
  //     this.cdref.detectChanges();
  //   });
  // }

  // ngOnDestroy() {
  //   this.updateAppSettingsOnDestroy();
  //   this.cdref.detectChanges();
  // }

  // updateAppSettingsOnInint() {
  //   const updatedSettings: ISettings = {
  //     appHeaderNone: false,
  //     appSidebarNone: false,
  //     appContentClass: '',
  //   };
  //   this.appSettings.updateAppSettings(updatedSettings);
  // }

  // updateAppSettingsOnDestroy() {
  //   const updatedSettings: ISettings = {
  //     appSidebarNone: false,
  //     appHeaderNone: false,
  //     appContentClass: '',
  //   };
  //   this.appSettings.updateAppSettings(updatedSettings);
  // }
}
