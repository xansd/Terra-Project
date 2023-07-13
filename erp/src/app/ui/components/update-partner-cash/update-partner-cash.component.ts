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
import { IAccount } from 'src/app/payments/domain/payments';
import { GetPayments } from 'src/app/payments/application/get-payments.use-cases';

@Component({
  selector: 'app-update-partner-cash',
  templateUrl: './update-partner-cash.component.html',
  styleUrls: ['./update-partner-cash.component.scss'],
})
export class UpdatePartnerCashComponent {
  @Input('partner') partner!: IPartner;
  @Input('operation') operation!: OperationPartnerCash;
  accounts: IAccount[] = [];
  cashOperation = OperationPartnerCash;
  matcher = new CustomErrorStateMatcher();
  cashUpdateForm: FormGroup = this.fb.group({
    amount: ['', Validators.compose([Validators.required])],
    account_id: ['', Validators.required],
  });
  private destroy$ = new Subject();
  constructor(
    private fb: UntypedFormBuilder,
    public modal: NgbActiveModal,
    private partnerService: UpdatePartnerUseCase,
    private notifier: NotificationAdapter,
    private formsHelperService: FormsHelperService,
    private errorHandler: ErrorHandlerService,
    private getAccountService: GetPayments
  ) {}

  ngOnInit(): void {
    this.getAccounts();
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
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
      account_id: [null, Validators.required],
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

  patchAccount(): void {
    let patchAccount = this.accounts[0].account_id;
    this.cashUpdateForm.patchValue({
      account_id: patchAccount?.toString(),
    });
  }

  submit(form: FormGroup) {
    if (!form.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(form);
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    }

    const amount = form.controls['amount'].value;
    const account = form.controls['account_id'].value;
    this.partnerService
      .updatePartnersCash({
        amount: amount,
        operation: this.operation,
        partner: this.partner,
        account: account,
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
  get account(): AbstractControl {
    return this.cashUpdateForm.controls['account_id'];
  }
}
