import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AppSettings, ISettings } from './services/app-settings.service';
import { UserIOAdapter } from '../users/infrastructure/user-io.adapter';
import { SignoutUseCase } from '../auth/application/use-cases/signout.use-case';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { PageRoutes } from './pages/pages-info.config';
import { AuthToken } from '../auth/domain/token';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Terra ERP';
  appEvent = new EventEmitter<string>();
  appLoaded: boolean = false;
  private destroy$ = new Subject();
  public appSettings!: ISettings;

  constructor(
    private appSettingsService: AppSettings,
    @Inject('usersIO') private readonly userIOAdapter: UserIOAdapter,
    private signoutService: SignoutUseCase,
    private router: Router,
    private cdref: ChangeDetectorRef,
    private authTokenService: AuthToken
  ) {
    this.userIOAdapter.createServer();
    this.getKicked();
  }

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
    this.checkTokenOnInit();
    this.appSettings = this.appSettingsService.getAppSettings();
    this.appSettingsService.getAppSettingsChanges().subscribe((settings) => {
      this.appSettings = settings;
      this.cdref.detectChanges();
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

      this.appLoaded = true;
      this.cdref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.userIOAdapter.closeServer();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getKicked(): void {
    this.userIOAdapter
      .removeToken()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: string) => {
          if (res) {
            const result = this.signoutService.signoutFromRemote(res);
            if (result) {
              this.router.navigateByUrl(PageRoutes.LOGIN);
            }
          }
        },
      });
  }

  checkTokenOnInit() {
    const token = this.authTokenService.getToken();
    if (token) {
      const uid = this.authTokenService.getUserID();
      this.userIOAdapter.registerActiveUser(uid);
    }
  }
}
