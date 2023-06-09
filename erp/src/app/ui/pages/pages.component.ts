import { Component, OnDestroy } from '@angular/core';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { AppStateService, IAppState } from '../services/app-state.service';
import { PageRoutes, PageTitle, PageIcon } from './pages-info.config';

export interface IPageInfo {
  pageHeader: string;
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
  hideBreadcrumbRoutes = [PageRoutes.LOGIN, PageRoutes.RESET_PASSWORD];

  info: IPageInfo = {
    pageHeader: PageTitle.HOME,
    icon: PageIcon.HOME,
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
          icon: PageIcon.HOME,
        };
        break;
      case PageRoutes.USERS:
      case PageRoutes.USERS_LIST:
      case PageRoutes.USERS_ONLINE:
        this.info = {
          pageHeader: PageTitle.USERS,
          icon: PageIcon.USERS,
        };
        break;
      case PageRoutes.PARTNERS:
      case PageRoutes.PARTNERS_LIST:
      case PageRoutes.PARTNER_DETAILS:
        this.info = {
          pageHeader: PageTitle.PARTNERS,
          icon: PageIcon.PARTNERS,
        };
        break;
      case PageRoutes.PRODUCTS:
      case PageRoutes.PRODUCTS_LIST:
      case PageRoutes.PRODUCTS_STATISTICS:
        this.info = {
          pageHeader: PageTitle.PRODUCTS,
          icon: PageIcon.PRODUCTS,
        };
        break;
    }
  }
}
