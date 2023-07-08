import { AfterViewInit, Component, Input } from '@angular/core';
import {
  FormGroup,
  UntypedFormBuilder,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { CustomErrorStateMatcher } from '../../shared/helpers/custom-error-state-macher';
import { FormsHelperService } from '../../shared/helpers/forms-helper.service';
import { UpdatePayments } from 'src/app/payments/application/update-payments.use-case';
import { PaymentType } from 'src/app/payments/domain/payments';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss'],
})
export class MakePaymentComponent implements AfterViewInit {
  @Input('id') id!: string;
  @Input('pending') pending!: number;
  matcher = new CustomErrorStateMatcher();
  paymentForm = this.fb.group({
    amount: [
      '',
      [
        Validators.required,
        Validators.min(0.01),
        Validators.max(this.pending!),
      ],
    ],
  });
  private destroy$ = new Subject();
  constructor(
    private fb: UntypedFormBuilder,
    public modal: NgbActiveModal,
    private notifier: NotificationAdapter,
    private formsHelperService: FormsHelperService,
    private errorHandler: ErrorHandlerService,
    private paymentService: UpdatePayments
  ) {}

  ngAfterViewInit(): void {
    console.log(this.pending);
    this.paymentForm = this.fb.group({
      amount: [
        '',
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(this.pending!),
        ],
      ],
    });
  }

  submit(form: FormGroup) {
    if (!form.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(form);
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    }

    const paymentObject = this.formsHelperService.createPaymentFormData(
      this.paymentForm,
      PaymentType.PAGO,
      this.id
    );
    this.paymentService
      .create(paymentObject)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.notifier.showNotification('success', 'Pago contabilizado');
            this.modal.close(true);
          } else {
            this.errorHandler.handleUnkonwError(res);
          }
        },
      });
  }

  close(result: boolean) {
    if (result) this.submit(this.paymentForm);
    else this.modal.close(false);
  }

  get amount(): AbstractControl {
    return this.paymentForm.controls['amount'];
  }
}
