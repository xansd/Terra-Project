import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface ISettings {
  appMode?: string;
  appTheme?: string;
  appCover?: string;
  appBoxedLayout?: boolean;
  appHeaderNone?: boolean;
  appFooter?: boolean;
  appSidebarNone?: boolean;
  appSidebarCollapsed?: boolean;
  appContentClass?: string;
  appContentFullHeight?: boolean;
  appContentFullWidth?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AppSettings {
  settings: ISettings = {
    appMode: '',
    appTheme: '',
    appCover: '',
    appContentClass: '',
    appBoxedLayout: false,
    appHeaderNone: false,
    appFooter: false,
    appSidebarNone: false,
    appSidebarCollapsed: false,
    appContentFullHeight: false,
    appContentFullWidth: false,
  };
  private appSettingsSubject: BehaviorSubject<ISettings> =
    new BehaviorSubject<ISettings>(this.settings);

  getAppSettings() {
    return this.settings;
  }

  updateAppSettings(update: ISettings) {
    this.settings = { ...this.settings, ...update };
    this.appSettingsSubject.next(this.settings);
  }

  getAppSettingsChanges() {
    return this.appSettingsSubject.asObservable();
  }
}
