import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignoutUseCase } from 'src/app/auth/application/use-cases/signout.use-case';
import { PageRoutes } from '../../../pages/pages-info.config';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { AuthToken } from 'src/app/auth/domain/token';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CheckPasswordComponent } from 'src/app/ui/components/check-password/check-password.component';

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
export class HeaderComponent implements OnInit {
  notificationData: NotificationData[] = [];
  username!: string;

  constructor(
    private useCase: SignoutUseCase,
    private router: Router,
    private notifier: NotificationAdapter,
    private authService: AuthToken,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    try {
      this.username = this.authService.getUserName();
    } catch (error) {
      console.warn('Not logged in');
    }
  }

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

  openCheckPasswordDialog(): void {
    const modalRef = this.modalService.open(CheckPasswordComponent);
    modalRef.result
      .then((result) => {
        if (result) {
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }
}
