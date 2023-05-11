import { Component, OnDestroy } from '@angular/core';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { AppStateService, IAppState } from '../services/app-state.service';
import {
  PageRoutes,
  PageTitle,
  PageIcon,
  BREADCRUMB_CONFIG,
} from './pages-info.config';

export interface IPageInfo {
  pageHeader: string;
  breadcrumbPath: string;
  breadcrumbActive: string;
  icon: string;
  description?: string;
}

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnDestroy {
  activeRoute$: Subscription;
  private destroy$ = new Subject();
  activeRoute = PageRoutes.LOGIN;
  hideBreadcrumbRoutes = [PageRoutes.LOGIN];

  info: IPageInfo = {
    pageHeader: PageTitle.HOME,
    icon: PageIcon.HOME,
    breadcrumbPath: BREADCRUMB_CONFIG.HOME.breadcrumbPath,
    breadcrumbActive: BREADCRUMB_CONFIG.HOME.children[0],
  };

  constructor(private appStateService: AppStateService) {
    this.activeRoute$ = this.appStateService
      .getState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: IAppState) => {
        this.activeRoute = state.activeRoute as PageRoutes;
        this.generatePageInfo(state.activeRoute);
      });
  }

  ngAfterViewInit() {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Configura la informacion de la página en base a la ruta actual
   * @param {string} route ruta actual
   */
  generatePageInfo(route: string): void {
    switch (route) {
      case PageRoutes.HOME:
        this.info = {
          pageHeader: PageTitle.HOME,
          breadcrumbPath: BREADCRUMB_CONFIG.HOME.breadcrumbPath,
          breadcrumbActive: BREADCRUMB_CONFIG.HOME.children[0],
          icon: PageIcon.HOME,
        };
        break;
      case PageRoutes.USERS_LIST:
        this.info = {
          pageHeader: PageTitle.USERS_LIST,
          breadcrumbPath: BREADCRUMB_CONFIG.USERS.breadcrumbPath,
          breadcrumbActive: BREADCRUMB_CONFIG.USERS.children[0],
          icon: PageIcon.USERS,
        };
        break;
      case PageRoutes.USERS_STATS:
        this.info = {
          pageHeader: PageTitle.USER_STATS,
          breadcrumbPath: BREADCRUMB_CONFIG.USERS.breadcrumbPath,
          breadcrumbActive: BREADCRUMB_CONFIG.USERS.children[1],
          icon: PageIcon.USERS,
        };
    }
  }
}
