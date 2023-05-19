import { Component, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DomainValidationError } from 'src/app/shared/domain/domain-validation.exception';
import { Email } from 'src/app/shared/domain/value-objects/email.value-object';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { FormsHelperService } from 'src/app/ui/shared/helpers/forms-helper.service';
import { CreateUserUseCase } from 'src/app/users/application/create-user.use-case';
import { Roles } from 'src/app/users/domain/roles';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnDestroy {
  createUserForm: UntypedFormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    rol: [null, Validators.required],
  });
  roles = Object.values(Roles).filter((value) => typeof value === 'string');

  private destroy$ = new Subject();

  constructor(
    public modal: NgbActiveModal,
    private formBuilder: UntypedFormBuilder,
    private notifier: NotificationAdapter,
    private createUserService: CreateUserUseCase,
    private errorHandler: ErrorHandlerService,
    private formsHelperService: FormsHelperService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  close(result: boolean): void {
    if (!result) {
      this.modal.close(false);
      return;
    }
    if (!this.createUserForm.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(
        this.createUserForm
      );
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    } else this.createUser();
  }

  createUser(): void {
    let email!: Email;
    try {
      email = Email.create(this.createUserForm.value.email);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        this.errorHandler.handleDomainError(error);
      } else this.errorHandler.handleUnkonwError(error);
    }
    const rol = this.createUserForm.value.rol;

    this.apiCreteUserCall(email, rol)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.notifier.showNotification('success', 'Usuario creado');
            this.modal.close(res);
          }
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  apiCreteUserCall(email: Email, role_id: Roles): Observable<void> {
    return this.createUserService.createUser(email, role_id);
  }
}
