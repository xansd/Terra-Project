import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  ISignoutUseCase,
  SignoutUseCase,
} from 'src/app/auth/application/use-cases/signout.use-case';
import { PageRoutes } from '../../pages/pages-info.config';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';

interface NotificationData {
  icon: string;
  title: string;
  time: string;
}

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  host: {
    class: 'app-header',
  },
})
export class HeaderComponent implements ISignoutUseCase {
  notificationData: NotificationData[] = [];
  username: string = 'xantimail@gmail.com';

  constructor(
    private useCase: SignoutUseCase,
    private router: Router,
    private notifier: NotificationAdapter
  ) {}

  /*
	notificationData = [{
		icon: 'bi bi-bag text-theme',
		title: 'NEW ORDER RECEIVED ($1,299)',
		time: 'JUST NOW'
	}]
	*/

  handleAppToggleClass(event: MouseEvent, className: string) {
    event.preventDefault();

    var elm = document.getElementById('app');
    if (elm) {
      elm.classList.toggle(className);
    }
  }

  signout(): void {
    this.useCase.signout();
    this.router.navigateByUrl(PageRoutes.LOGIN);
    this.notifier.showNotification('warning', 'Sesión cerrada');
  }

  notImplemented(): void {
    this.notifier.showNotification('warning', 'Funcionalidad no implementda');
  }
}
