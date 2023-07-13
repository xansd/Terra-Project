import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { GetPayments } from 'src/app/payments/application/get-payments.use-cases';
import {
  UntypedFormBuilder,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { IAccount } from 'src/app/payments/domain/payments';

@Component({
  selector: 'app-pay-fee',
  templateUrl: './pay-fee.component.html',
  styleUrls: ['./pay-fee.component.scss'],
})
export class PayFeeComponent {
  @Input() message!: string;
  private destroy$ = new Subject();
  accounts: IAccount[] = [];
  paymentForm = this.fb.group({
    account_id: ['', Validators.required],
  });

  constructor(
    public modal: NgbActiveModal,
    private fb: UntypedFormBuilder,
    private getAccountService: GetPayments
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getAccounts();
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

  close(result: any) {
    if (result) {
      this.modal.close(this.paymentForm.controls['account_id'].value);
    }
    this.modal.close(result);
  }

  get account(): AbstractControl {
    return this.paymentForm.controls['account_id'];
  }
}
