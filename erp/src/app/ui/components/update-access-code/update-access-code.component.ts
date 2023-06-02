import { Component, Input, OnDestroy } from '@angular/core';
import { CustomErrorStateMatcher } from '../../shared/helpers/custom-error-state-macher';
import {
  FormGroup,
  Validators,
  UntypedFormBuilder,
  AbstractControl,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdatePartnerUseCase } from 'src/app/partners/application/update-partner.use.case';
import { Subject, takeUntil } from 'rxjs';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { FormsHelperService } from '../../shared/helpers/forms-helper.service';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';

@Component({
  selector: 'app-update-access-code',
  templateUrl: './update-access-code.component.html',
  styleUrls: ['./update-access-code.component.scss'],
})
export class UpdateAccessCodeComponent implements OnDestroy {
  @Input('uid') uid!: string;
  matcher = new CustomErrorStateMatcher();
  accessPasswordForm: FormGroup = this.fb.group({
    code: ['', Validators.compose([Validators.required])],
  });

  private destroy$ = new Subject();

  constructor(
    private fb: UntypedFormBuilder,
    public modal: NgbActiveModal,
    private partnerService: UpdatePartnerUseCase,
    private notifier: NotificationAdapter,
    private formsHelperService: FormsHelperService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  get code(): AbstractControl {
    return this.accessPasswordForm.controls['code'];
  }

  submit(form: FormGroup) {
    if (!form.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(form);
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    }
    if (!this.uid) {
      this.notifier.showNotification(
        'error',
        'No se ha encontrado el identificador del socio'
      );
      return;
    }

    const code = form.controls['code'].value;
    this.partnerService
      .updateAccessCode(code, this.uid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.affectedRows > 0) {
            this.modal.close(true);
          } else {
            this.errorHandler.handleUnkonwError(res);
          }
        },
      });
  }

  close(result: boolean) {
    if (result) this.submit(this.accessPasswordForm);
    else this.modal.close(false);
  }
}
