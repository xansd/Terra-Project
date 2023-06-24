import { Component, Input } from '@angular/core';
import {
  FormGroup,
  Validators,
  UntypedFormBuilder,
  AbstractControl,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdatePartnerUseCase } from 'src/app/partners/application/update-partner.use.case';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { CustomErrorStateMatcher } from '../../shared/helpers/custom-error-state-macher';
import { FormsHelperService } from '../../shared/helpers/forms-helper.service';
import { Subject, takeUntil } from 'rxjs';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import {
  IPartner,
  OperationPartnerCash,
} from 'src/app/partners/domain/partner';

@Component({
  selector: 'app-update-partner-cash',
  templateUrl: './update-partner-cash.component.html',
  styleUrls: ['./update-partner-cash.component.scss'],
})
export class UpdatePartnerCashComponent {
  @Input('partner') partner!: IPartner;
  @Input('operation') operation!: OperationPartnerCash;
  cashOperation = OperationPartnerCash;
  matcher = new CustomErrorStateMatcher();
  cashUpdateForm: FormGroup = this.fb.group({
    amount: ['', Validators.compose([Validators.required])],
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

  ngAfterViewInit(): void {
    this.cashUpdateForm = this.fb.group({
      amount: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(0.01),
          this.operation === this.cashOperation.REFUND
            ? Validators.max(Number(this.partner.cash))
            : null,
        ]),
      ],
    });
  }

  submit(form: FormGroup) {
    if (!form.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(form);
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    }

    let amount = form.controls['amount'].value;
    this.partnerService
      .updatePartnersCash({
        amount: amount,
        operation: this.operation,
        partner: this.partner,
      })
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
    if (result) this.submit(this.cashUpdateForm);
    else this.modal.close(false);
  }

  get amount(): AbstractControl {
    return this.cashUpdateForm.controls['amount'];
  }
}
