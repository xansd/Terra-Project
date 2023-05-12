import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { DomainValidationError } from 'src/app/shared/domain/domain-validation.exception';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { CreateUserUseCase } from 'src/app/users/application/use-cases/create-user.use-case';
import { Roles } from 'src/app/users/domain/roles';
import { Email } from 'src/app/users/domain/value-objects/email.value-object';
import { User } from 'src/app/users/domain/user';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent {
  createUserForm: UntypedFormGroup = this.formBuilder.group({
    email: [null, Validators.required],
    rol: [null, Validators.required],
  });
  roles = Object.values(Roles).filter((value) => typeof value === 'string');
  constructor(
    public modal: NgbActiveModal,
    private formBuilder: UntypedFormBuilder,
    private notifier: NotificationAdapter,
    private createUserService: CreateUserUseCase,
    private errorHandler: ErrorHandlerService
  ) {}

  close(result: boolean): void {
    if (!result) {
      this.modal.close(false);
      return;
    }

    const email = Email.create(this.createUserForm.value.email);
    const rol = this.createUserForm.value.rol;

    this.createUser(email, rol).subscribe({
      next: (res: any) => {
        if (res && res.email && res.role_id) {
          this.notifier.showNotification('success', 'Usuario creado');
          this.modal.close(res);
        } else if (res.statusCode) {
          this.errorHandler.handleAPIKnowError(res);
        }
      },
      error: (error: any) => {
        if (error instanceof DomainValidationError) {
          this.errorHandler.handleDomainError(error);
          console.error(error);
        } else {
          this.errorHandler.handleUnkonwError(error);
          console.error(error);
        }
      },
    });
  }

  createUser(email: Email, role_id: Roles): Observable<void> {
    return this.createUserService.createUser(email, role_id);
  }
}
