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
import { IAccount, PaymentType } from 'src/app/payments/domain/payments';
import { GetPayments } from 'src/app/payments/application/get-payments.use-cases';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss'],
})
export class MakePaymentComponent implements AfterViewInit {
  @Input('id') id!: string;
  @Input('pending') pending!: number;
  accounts: IAccount[] = [];
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
    account_id: ['', Validators.required],
  });
  private destroy$ = new Subject();
  constructor(
    private fb: UntypedFormBuilder,
    public modal: NgbActiveModal,
    private notifier: NotificationAdapter,
    private formsHelperService: FormsHelperService,
    private errorHandler: ErrorHandlerService,
    private paymentService: UpdatePayments,
    private getAccountService: GetPayments
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getAccounts();
  }

  ngAfterViewInit(): void {
    this.paymentForm = this.fb.group({
      amount: [
        '',
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(this.pending!),
        ],
      ],
      account_id: [this.accounts[0].account_id, Validators.required],
    });
  }

  patchAccount(): void {
    let patchAccount = this.accounts[0].account_id;
    this.paymentForm.patchValue({
      account_id: patchAccount?.toString(),
    });
  }

  getAccounts() {
    this.getAccountService
      .getAllAccounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (accounts) => {
          this.accounts = accounts;
          this.patchAccount();
        },
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

  get account(): AbstractControl {
    return this.paymentForm.controls['account_id'];
  }
}
