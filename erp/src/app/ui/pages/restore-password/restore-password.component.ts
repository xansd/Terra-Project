import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { AppSettings, ISettings } from '../../services/app-settings.service';
import { CustomErrorStateMatcher } from '../../shared/helpers/custom-error-state-macher';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import CONFIG from '../../../config/client.config';
import { PageRoutes } from '../pages-info.config';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import {
  FormGroup,
  Validators,
  AbstractControl,
  UntypedFormBuilder,
} from '@angular/forms';
import { FormsHelperService } from '../../shared/helpers/forms-helper.service';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { UpdatePasswordUseCase } from 'src/app/auth/application/use-cases/update-password.use-case';
import { AuthToken } from 'src/app/auth/domain/token';
import { Router } from '@angular/router';
import { TokenInvalidError } from 'src/app/auth/domain/auth.exceptions';
import { SignoutUseCase } from 'src/app/auth/application/use-cases/signout.use-case';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss'],
})
export class RestorePasswordComponent implements OnInit {
  matcher = new CustomErrorStateMatcher();
  config = CONFIG;
  public pageRoutes = PageRoutes;
  passwordForm: FormGroup = this.fb.group(
    {
      password1: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(CONFIG.VALIDATION.PASSWORD_MIN),
          Validators.maxLength(CONFIG.VALIDATION.PASSWORD_MAX),
          Validators.pattern(CONFIG.REGEX.PASSWORD),
        ]),
      ],
      password2: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(CONFIG.VALIDATION.PASSWORD_MIN),
          Validators.maxLength(CONFIG.VALIDATION.PASSWORD_MAX),
          Validators.pattern(CONFIG.REGEX.PASSWORD),
        ]),
      ],
    },
    {
      validator: this.matchPasswords,
    }
  );

  constructor(
    private fb: UntypedFormBuilder,
    private appSettings: AppSettings,
    private formsHelperService: FormsHelperService,
    private notifier: NotificationAdapter,
    private updatePasswordService: UpdatePasswordUseCase,
    private sigoutUseCase: SignoutUseCase,
    private tokenService: AuthToken,
    private cdref: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.updateAppSettingsOnInint();
      this.cdref.detectChanges();
    });
  }

  ngOnDestroy() {
    this.updateAppSettingsOnDestroy();
    this.cdref.detectChanges();
  }

  updateAppSettingsOnInint() {
    const updatedSettings: ISettings = {
      appHeaderNone: true,
      appSidebarNone: true,
      appContentClass: 'p-0',
    };
    this.appSettings.updateAppSettings(updatedSettings);
  }

  updateAppSettingsOnDestroy() {
    const updatedSettings: ISettings = {
      appSidebarNone: false,
      appHeaderNone: false,
      appContentClass: '',
    };
    this.appSettings.updateAppSettings(updatedSettings);
  }

  submit(form: FormGroup) {
    let uid = '';
    if (!form.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(form);
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    }

    try {
      uid = this.tokenService.getUserID();
    } catch (error) {
      if (error instanceof TokenInvalidError) {
        this.notifier.showNotification('error', '[401] - No autorizado');
        this.router.navigate([PageRoutes.LOGIN]);
        throw error;
      }
    }

    const password = form.controls['password1'].value;
    this.updatePasswordService.updatePassword(uid, password).subscribe({
      next: (res: any) => {
        if (res.affectedRows > 0) {
          this.notifier.showNotification('success', 'Password actualizado');
          this.notifier.showNotification(
            'success',
            'Debes autenticarte con tus nuevas credenciales'
          );
          this.router.navigate([PageRoutes.LOGIN]);
        }
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }

  matchPasswords(form: FormGroup) {
    const password1 = form.get('password1')?.value;
    const password2 = form.get('password2')?.value;

    if (password1 !== password2) {
      return { passwordsDoNotMatch: true };
    }

    return null;
  }

  onPasswordChange() {
    if (this.password2.value == this.password1.value) {
      this.password2.setErrors(null);
    } else {
      this.password2.setErrors({ matchPasswords: true });
    }
  }

  cancel() {
    this.sigoutUseCase.signout();
    this.router.navigateByUrl(PageRoutes.LOGIN);
  }

  get password1(): AbstractControl {
    return this.passwordForm.controls['password1'];
  }
  get password2(): AbstractControl {
    return this.passwordForm.controls['password2'];
  }
}
