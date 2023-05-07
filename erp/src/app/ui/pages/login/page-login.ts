import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AppSettings } from '../../service/app-settings.service';
import { PagesRoutes } from '../pages-routes.enum';
import { AuthAPI } from '../../../auth/infrastructure/auth-api.adapter';
import { AuthToken } from '../../../auth/domain/token';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import CONFIG from '../../../config/client.config';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { FormsHelperService } from '../../shared/forms-helper.service';
import { CustomErrorStateMatcher } from '../../shared/custom-error-state-macher';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';

@Component({
  selector: 'page-login',
  templateUrl: './page-login.html',
  styleUrls: ['./page-login.scss'],
})
export class LoginPage {
  matcher = new CustomErrorStateMatcher();
  config = CONFIG;
  public pageRoutes = PagesRoutes;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(CONFIG.REGEX.EMAIL),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(CONFIG.VALIDATION.PASSWORD_MIN),
      Validators.maxLength(CONFIG.VALIDATION.PASSWORD_MAX),
    ]),
  });

  constructor(
    private router: Router,
    private appSettings: AppSettings,
    private api: AuthAPI,
    private authTokenService: AuthToken,
    private notifier: NotificationAdapter,
    private errorHandler: ErrorHandlerService,
    private formsHelperService: FormsHelperService
  ) {}

  ngOnInit() {
    this.appSettings.appSidebarNone = true;
    this.appSettings.appHeaderNone = true;
    this.appSettings.appContentClass = 'p-0';
  }

  ngOnDestroy() {
    this.appSettings.appSidebarNone = false;
    this.appSettings.appHeaderNone = false;
    this.appSettings.appContentClass = '';
  }

  submit(form: FormGroup) {
    try {
      if (!this.loginForm.valid) {
        const invalidFields = this.formsHelperService.getInvalidFields(form);
        throw new FieldValidationError(invalidFields);
      }
      this.api
        .signin({
          email: form.controls['email'].value,
          password: form.controls['password'].value,
        })
        .subscribe({
          next: (res: any) => {
            if (res.statusCode) {
              this.notifier.showNotification(
                'error',
                `[${res.statusCode}] ${res.message}`
              );
            } else {
              this.authTokenService.saveToken(res);
              this.notifier.showNotification('success', 'Sesión iniciada');
              this.router.navigateByUrl(PagesRoutes.HOME);
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
    } catch (error) {
      this.errorHandler.handleError(error as unknown as Error);
    }
  }

  get emailControl(): AbstractControl {
    return this.loginForm.controls['email'];
  }
  get passwordControl(): AbstractControl {
    return this.loginForm.controls['password'];
  }
}
