import { Injectable } from '@angular/core';
import { PageIcon, PageRoutes, PageTitle } from '../pages/pages-info.config';
@Injectable({
  providedIn: 'root',
})
export class AppMenuService {
  getAppMenus() {
    return [
      { text: 'General', is_header: true },
      { path: PageRoutes.HOME, icon: PageIcon.HOME, text: PageTitle.HOME },
      { is_divider: true },
      { text: 'Asociación', is_header: true },
      {
        path: PageRoutes.PARTNERS,
        icon: PageIcon.PARTNERS,
        text: PageTitle.PARTNERS,
      },
      {
        path: PageRoutes.VARIETIES,
        icon: PageIcon.VARIETIES,
        text: PageTitle.VARIETIES,
      },
      {
        path: PageRoutes.HARVESTS,
        icon: PageIcon.HARVESTS,
        text: PageTitle.HARVESTS,
      },
      {
        path: PageRoutes.CULTIVATORS,
        icon: PageIcon.CULTIVATORS,
        text: PageTitle.CULTIVATORS,
      },

      { text: 'Terceros', is_header: true },
      {
        path: PageRoutes.PRODUCTS,
        icon: PageIcon.PRODUCTS,
        text: PageTitle.PRODUCTS,
      },
      {
        path: PageRoutes.PURCHASES,
        icon: PageIcon.PURCHASES,
        text: PageTitle.PURCHASES,
      },
      {
        path: PageRoutes.PROVIDERS,
        icon: PageIcon.PROVIDERS,
        text: PageTitle.PROVIDERS,
      },
      { is_divider: true },
      { text: 'Contabilidad', is_header: true },
      {
        path: PageRoutes.RECORDS,
        icon: PageIcon.RECORDS,
        text: PageTitle.RECORDS,
      },
      {
        path: PageRoutes.BALANCE,
        icon: PageIcon.BALANCE,
        text: PageTitle.BALANCE,
      },
      { is_divider: true },
      { text: 'Ajustes', is_header: true },
      { path: PageRoutes.USERS, icon: PageIcon.USERS, text: PageTitle.USERS },
    ];
  }
}
