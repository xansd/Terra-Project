// Core Module
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// App Component
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';

// Third Party Modules
import { JwtModule, JwtModuleOptions } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { NotifierService } from 'angular-notifier';
import { NotificationAdapter } from '../shared/infraestructure/notifier.adapter';
import { ErrorCatchingInterceptor } from './interceptors/error.interceptor';
import { UserIORepository } from '../users/infrastructure/user-io.repository';

// Notifier configuration
const notifierDefaultOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12,
    },
    vertical: {
      position: 'top',
      distance: 12,
      gap: 10,
    },
  },
  theme: 'material',
  behaviour: {
    autoHide: 6000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 10,
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease',
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50,
    },
    shift: {
      speed: 300,
      easing: 'ease',
    },
    overlap: 150,
  },
};

@NgModule({
  declarations: [AppComponent],

  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    JsonPipe,
    HttpClientModule,
    BrowserAnimationsModule,
    PagesModule,
    ComponentsModule,
    JwtModule.forRoot(AppModule.JWT_Module_Options),
    NotifierModule.withConfig(notifierDefaultOptions),
    NgbModule,
  ],
  exports: [],
  providers: [
    NotificationAdapter,
    { provide: 'notifier', useExisting: NotifierService },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorCatchingInterceptor,
      multi: true,
    },
    { provide: 'usersIO', useClass: UserIORepository },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  title: string = 'TerraERP';
  constructor(
    private router: Router,
    private titleService: Title,
    private route: ActivatedRoute
  ) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if (
          this.route.snapshot.firstChild &&
          this.route.snapshot.firstChild.data['title']
        ) {
          this.title =
            'TerraERP | ' + this.route.snapshot.firstChild.data['title'];
        }
        this.titleService.setTitle(this.title);

        var elm = document.getElementById('app');
        if (elm) {
          elm.classList.remove('app-sidebar-mobile-toggled');
        }
      }
    });
  }

  static JWT_Module_Options: JwtModuleOptions = {
    config: {
      tokenGetter: AppModule.tokenGetter,
      allowedDomains: environment.ALLOWED_DOMAINS.replace(' ', '').split(','),
      disallowedRoutes: [],
    },
  };

  static tokenGetter() {
    return localStorage.getItem('authToken');
  }
}
