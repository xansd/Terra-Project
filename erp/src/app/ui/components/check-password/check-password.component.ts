import { Component } from '@angular/core';
import {
  FormGroup,
  Validators,
  AbstractControl,
  UntypedFormBuilder,
} from '@angular/forms';
import { FormsHelperService } from '../../shared/helpers/forms-helper.service';
import { CustomErrorStateMatcher } from '../../shared/helpers/custom-error-state-macher';
import CONFIG from '../../../config/client.config';
import { PageRoutes } from '../../pages/pages-info.config';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CheckPasswordUseCase } from 'src/app/auth/application/use-cases/check-password.use-case';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { AuthToken } from 'src/app/auth/domain/token';
import { TokenInvalidError } from 'src/app/auth/domain/auth.exceptions';

@Component({
  selector: 'app-check-password',
  templateUrl: './check-password.component.html',
  styleUrls: ['./check-password.component.scss'],
})
export class CheckPasswordComponent {
  matcher = new CustomErrorStateMatcher();
  config = CONFIG;
  public pageRoutes = PageRoutes;
  checkPasswordForm: FormGroup = this.fb.group({
    password: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(CONFIG.VALIDATION.PASSWORD_MIN),
        Validators.maxLength(CONFIG.VALIDATION.PASSWORD_MAX),
        Validators.pattern(CONFIG.REGEX.PASSWORD),
      ]),
    ],
  });

  constructor(
    private fb: UntypedFormBuilder,
    private formsHelperService: FormsHelperService,
    private chekPasswordService: CheckPasswordUseCase,
    private errorHandler: ErrorHandlerService,
    private notifier: NotificationAdapter,
    private router: Router,
    public modal: NgbActiveModal,
    private tokenService: AuthToken
  ) {}

  close(result: boolean) {
    if (result) this.submit(this.checkPasswordForm);
    else this.modal.close(result);
  }

  submit(form: FormGroup) {
    let username = '';
    if (!form.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(form);
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    }
    try {
      username = this.tokenService.getUserName();
    } catch (error) {
      if (error instanceof TokenInvalidError) {
        this.notifier.showNotification('error', '[401] - No autorizado');
        this.router.navigate([PageRoutes.LOGIN]);
        throw error;
      }
    }
    const password = form.controls['password'].value;
    this.chekPasswordService.checkPassword(username, password).subscribe({
      next: (res: any) => {
        if (res.statusCode) {
          if (res.statusCode === 403) {
            this.notifier.showNotification(
              'error',
              'La contraseña es incorrecta'
            );
          } else this.errorHandler.handleAPIKnowError(res);
        } else {
          this.tokenService.saveToken(res);
          this.modal.close(true);
          this.router.navigateByUrl(PageRoutes.RESET_PASSWORD);
        }
      },
    });
  }

  get password(): AbstractControl {
    return this.checkPasswordForm.controls['password'];
  }
}
