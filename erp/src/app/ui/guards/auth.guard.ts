import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { SignoutUseCase } from 'src/app/auth/application/use-cases/signout.use-case';
import { TokenInvalidError } from 'src/app/auth/domain/auth.exceptions';
import { AuthToken } from 'src/app/auth/domain/token';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { PageRoutes } from '../pages/pages-info.config';
import { AppStateService } from '../services/app-state.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthToken,
    private signoutService: SignoutUseCase,
    private notifier: NotificationAdapter,
    private stateService: AppStateService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let isLogged = false;
    try {
      isLogged = this.authService.isLogged();
    } catch (error) {
      if (error instanceof TokenInvalidError) {
        this.unauthorizedKickOut();
        return false;
      }
    }

    if (isLogged) {
      if (
        route.data['roles'] &&
        route.data['roles'].indexOf(this.authService.getUserRole()) === -1
      ) {
        this.uShallNotPass();
        return false;
      } else if (this.authService.getUserHasToReset()) {
        this.userHasToReset();
        return false;
      }
    }
    return true;
  }

  uShallNotPass(): void {
    const lastRoute = this.stateService.state.lastRoute;
    this.router.navigate([lastRoute]);
    this.notifier.showNotification(
      'error',
      '[403] No puede acceder a ese recurso'
    );
  }

  unauthorizedKickOut(): void {
    this.signoutService.signout();
    this.router.navigate([PageRoutes.LOGIN]);
    this.notifier.showNotification('error', '[401] No autorizado');
  }

  userHasToReset(): void {
    this.router.navigate([PageRoutes.RESET_PASSWORD]);
    this.notifier.showNotification(
      'error',
      '[499] El usuario debe resetear la contraseña'
    );
  }
}
