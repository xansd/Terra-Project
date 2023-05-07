import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CountdownConfig } from 'ngx-countdown';
import { AppSettings } from '../../service/app-settings.service';

@Component({
  selector: 'page-coming-soon',
  templateUrl: './page-coming-soon.html',
  styleUrls: ['./page-coming.component.scss'],
})
export class ComingSoonPage {
  constructor(private router: Router, private appSettings: AppSettings) {}

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
    this.appSettings.appContentClass = 'p-7';
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
