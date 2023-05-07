import { CountdownConfig } from 'ngx-countdown';
import { AppSettings } from '../../service/app-settings.service';
import { Component } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.html',
})
export class HomePage {
  constructor(private appSettings: AppSettings) {}
  countdownConfig: CountdownConfig = {
    leftTime: 100000 * 10,
    format: 'dd:HH:mm:ss',
    prettyText: (text) => {
      var timeHtml = text
        .split(':')
        .map((v, i) => {
          let period = '';
          switch (i) {
            case 0:
              period = 'Days';
              break;
            case 1:
              period = 'Hours';
              break;
            case 2:
              period = 'Minutes';
              break;
            case 3:
              period = 'Seconds';
              break;
          }
          return `<div class="countdown-section">
                  <div class="countdown-amount">${v}</div>
                  <div class="countdown-period">${period}</div>
                </div>`;
        })
        .join('');

      return (
        '<div class="is-countdown text-center"><div class="countdown-row countdown-show4">' +
        timeHtml +
        '</div></div>'
      );
    },
  };
  ngOnInit() {
    this.appSettings.appSidebarNone = false;
    this.appSettings.appHeaderNone = false;
    this.appSettings.appContentClass = 'p-4';
  }

  ngOnDestroy() {
    this.appSettings.appSidebarNone = false;
    this.appSettings.appHeaderNone = false;
    this.appSettings.appContentClass = '';
  }
}
