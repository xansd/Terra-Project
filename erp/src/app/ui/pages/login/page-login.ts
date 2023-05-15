import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AppSettings } from '../../services/app-settings.service';
import { PageRoutes } from '../pages-info.config';
import { AuthToken } from '../../../auth/domain/token';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import CONFIG from '../../../config/client.config';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { FormsHelperService } from '../../shared/helpers/forms-helper.service';
import { CustomErrorStateMatcher } from '../../shared/helpers/custom-error-state-macher';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { SigninUseCase } from 'src/app/auth/application/use-cases/signin.use-case';

@Component({
  selector: 'page-login',
  templateUrl: './page-login.html',
  styleUrls: ['./page-login.scss'],
})
export class LoginPage implements AfterViewInit {
  matcher = new CustomErrorStateMatcher();
  config = CONFIG;
  public pageRoutes = PageRoutes;
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
    private signinUseCase: SigninUseCase,
    private authTokenService: AuthToken,
    private notifier: NotificationAdapter,
    private errorHandler: ErrorHandlerService,
    private formsHelperService: FormsHelperService,
    private cdref: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.appSettings.appSidebarNone = true;
    this.appSettings.appHeaderNone = true;
    this.appSettings.appContentClass = 'p-0';
    this.cdref.detectChanges();
  }

  ngOnDestroy() {
    this.appSettings.appSidebarNone = false;
    this.appSettings.appHeaderNone = false;
  }

  submit(form: FormGroup) {
    if (!this.loginForm.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(form);
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    }
    this.signinUseCase
      .signin({
        email: form.controls['email'].value,
        password: form.controls['password'].value,
      })
      .subscribe({
        next: (res: any) => {
          if (res.statusCode) {
            this.errorHandler.handleAPIKnowError(res);
          } else {
            this.authTokenService.saveToken(res);
            this.notifier.showNotification('success', 'Sesión iniciada');
            this.router.navigateByUrl(PageRoutes.HOME);
          }
        },
      });
  }

  get emailControl(): AbstractControl {
    return this.loginForm.controls['email'];
  }
  get passwordControl(): AbstractControl {
    return this.loginForm.controls['password'];
  }
}
