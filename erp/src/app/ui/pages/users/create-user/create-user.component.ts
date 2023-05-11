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
    if (result) {
      let email = this.createUserForm.value.email;
      let rol = this.createUserForm.value.rol;
      try {
        email = Email.create(email);
        this.createUser(email, rol).subscribe({
          next: (res: any) => {
            if (res.statusCode) {
              this.errorHandler.handleKnowError(res);
            } else {
              this.notifier.showNotification('success', 'Usuario creado');
              this.modal.close(true);
            }
          },
        });
      } catch (error: any) {
        if (error instanceof DomainValidationError) {
          this.notifier.showNotification(
            'error',
            'Atención el email no es válido'
          );
        } else {
          this.notifier.showNotification('error', `${error.message}`);
        }
      }
    } else this.modal.close(false);
  }

  createUser(email: Email, role_id: Roles): Observable<void> {
    return this.createUserService.createUser(email, role_id);
  }
}
