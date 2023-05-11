import { Component, EventEmitter } from '@angular/core';
import { AppSettings } from './services/app-settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'TeERP';
  appEvent = new EventEmitter<string>();
  appLoaded: boolean = false;

  constructor(public appSettings: AppSettings) {}

  handleSetCover(coverClass: string) {
    var htmlElm = document.querySelector('html');
    if (htmlElm) {
      for (var x = 0; x < document.documentElement.classList.length; x++) {
        var targetClass = document.documentElement.classList[x];
        if (targetClass.search('bg-cover-') > -1) {
          htmlElm.classList.remove(targetClass);
        }
      }
      htmlElm.classList.add(coverClass);
    }
  }

  handleSetMode(mode: string) {
    document.documentElement.setAttribute('data-bs-theme', mode);
    this.appEvent.emit('theme-reload');
  }

  handleSetTheme(themeClass: string) {
    for (var x = 0; x < document.body.classList.length; x++) {
      var targetClass = document.body.classList[x];
      if (targetClass.search('theme-') > -1) {
        document.body.classList.remove(targetClass);
      }
    }
    document.body.classList.add(themeClass);
    this.appEvent.emit('theme-reload');
  }

  ngOnInit() {
    var elm = document.body;
    if (elm) {
      elm.classList.add('app-init');
    }

    if (this.appSettings.appMode) {
      this.handleSetMode(this.appSettings.appMode);
    }
    if (this.appSettings.appTheme) {
      this.handleSetTheme(this.appSettings.appTheme);
    }
    if (this.appSettings.appCover) {
      this.handleSetCover(this.appSettings.appCover);
    }
  }

  ngAfterViewInit() {
    this.appLoaded = true;
  }
}
