import { Injectable } from '@angular/core';
import { PageIcon } from '../pages/pages-info.config';

@Injectable({
  providedIn: 'root',
})
export class AppMenuService {
  getAppMenus() {
    return [
      { text: 'General', is_header: true },
      { path: '/inicio', icon: PageIcon.HOME, text: 'Inicio' },
      { is_divider: true },
      { text: 'Usuarios', is_header: true },
      { path: '/usuarios/listado', text: 'Listado', icon: PageIcon.USERS_LIST },
      {
        path: '/usuarios/estadisticas',
        text: 'Estadísticas',
        icon: PageIcon.STATISTICS,
      },
    ];
  }
}
