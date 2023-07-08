import { Component, Input } from '@angular/core';
import {
  UntypedFormBuilder,
  FormGroup,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { StockOperations } from 'src/app/products/domain/products';
import { UpdateHarvests } from 'src/app/purchases/application/update-harvests.use-case';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { CustomErrorStateMatcher } from '../../shared/helpers/custom-error-state-macher';
import { FormsHelperService } from '../../shared/helpers/forms-helper.service';
import { InvalidAmountError } from 'src/app/payments/domain/payments.exception';

@Component({
  selector: 'app-update-harvest-loss',
  templateUrl: './update-harvest-loss.component.html',
  styleUrls: ['./update-harvest-loss.component.scss'],
})
export class UpdateHarvestLossComponent {
  @Input('id') id!: string;
  matcher = new CustomErrorStateMatcher();
  adjustForm = this.fb.group({
    amount: ['', [Validators.required]],
  });
  isLoss = true;
  private destroy$ = new Subject();
  constructor(
    private fb: UntypedFormBuilder,
    public modal: NgbActiveModal,
    private notifier: NotificationAdapter,
    private formsHelperService: FormsHelperService,
    private errorHandler: ErrorHandlerService,
    private updateServcie: UpdateHarvests
  ) {}

  ngAfterViewInit(): void {
    this.adjustForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
    });
  }

  submit(form: FormGroup) {
    if (!form.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(form);
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    }
    let value = 0;
    try {
      const formValue = this.adjustForm.get('amount')?.value;
      value = this.updateServcie.getLossValue(formValue, this.isLoss);
    } catch (error) {
      if (error instanceof InvalidAmountError) {
        this.notifier.showNotification(
          'error',
          'Valor no válido calculando pérdida/excedente'
        );
      }
    }

    this.updateServcie
      .updateHarvestLoss(this.id, value, StockOperations.UPDATE_LOSS)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.notifier.showNotification(
              'success',
              'Pérdida/excedente en cultivo modificado'
            );
            this.modal.close(true);
          } else {
            this.errorHandler.handleUnkonwError(res);
          }
        },
      });
  }

  close(result: boolean) {
    if (result) this.submit(this.adjustForm);
    else this.modal.close(false);
  }

  toggleState(): void {
    this.isLoss = !this.isLoss;
  }

  get amount(): AbstractControl {
    return this.adjustForm.controls['amount'];
  }
}
