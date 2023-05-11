export enum PageRoutes {
  HOME = '/inicio',
  LOGIN = '/login',
  REGISTER = '/registro',
  USERS_LIST = '/usuarios/listado',
  USERS_STATS = '/usuarios/estadisticas',
}

export enum PageTitle {
  HOME = 'Inicio',
  USERS_LIST = 'Listado de usuarios',
  USER_STATS = 'Estadísticas de usuarios',
}

export enum PageIcon {
  HOME = 'bi bi-house-fill',
  USERS = 'bi bi-people-fill',
  USERS_LIST = USERS,
  STATISTICS = 'bi bi-bar-chart-fill',
}

export const BREADCRUMB_CONFIG = {
  HOME: {
    icon: PageIcon.HOME,
    breadcrumbPath: 'General',
    children: ['inicio'],
  },
  USERS: {
    breadcrumbPath: 'Usuarios',
    icon: PageIcon.USERS,
    children: ['listado', 'estadisticas'],
  },
};
