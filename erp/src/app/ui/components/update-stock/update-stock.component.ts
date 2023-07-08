import { Component, Input } from '@angular/core';
import {
  UntypedFormBuilder,
  FormGroup,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { UpdateHarvests } from 'src/app/purchases/application/update-harvests.use-case';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { CustomErrorStateMatcher } from '../../shared/helpers/custom-error-state-macher';
import { FormsHelperService } from '../../shared/helpers/forms-helper.service';
import { StockOperations } from 'src/app/products/domain/products';
import { UpdateProductUseCase } from 'src/app/products/application/update.use-cases';

export enum StockType {
  HARVEST = 'HARVEST',
  PRODUCT = 'PRODUCT',
}
@Component({
  selector: 'app-update-stock',
  templateUrl: './update-stock.component.html',
  styleUrls: ['./update-stock.component.scss'],
})
export class UpdateStockComponent {
  @Input('id') id!: string;
  @Input('type') type!: StockType;

  matcher = new CustomErrorStateMatcher();
  stockForm = this.fb.group({
    amount: ['', [Validators.required, Validators.min(0)]],
  });
  private destroy$ = new Subject();
  constructor(
    private fb: UntypedFormBuilder,
    public modal: NgbActiveModal,
    private notifier: NotificationAdapter,
    private formsHelperService: FormsHelperService,
    private errorHandler: ErrorHandlerService,
    private updateHarvestServcie: UpdateHarvests,
    private updateProductServcie: UpdateProductUseCase
  ) {}

  ngAfterViewInit(): void {
    this.stockForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
    });
  }

  submit(form: FormGroup) {
    if (!form.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(form);
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    }
    if (this.type === StockType.HARVEST) this.updateHarvest();
    if (this.type === StockType.PRODUCT) this.updateProduct();
  }

  updateHarvest() {
    this.updateHarvestServcie
      .updateHarvestStock(
        this.id,
        this.stockForm.get('amount')?.value,
        StockOperations.UPDATE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.notifier.showNotification(
              'success',
              'Stock del cultivo modificado'
            );
            this.modal.close(true);
          } else {
            this.errorHandler.handleUnkonwError(res);
          }
        },
      });
  }

  updateProduct() {
    this.updateProductServcie
      .updateProductStock(
        this.id,
        this.stockForm.get('amount')?.value,
        StockOperations.UPDATE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.notifier.showNotification(
              'success',
              'Stock del producto modificado'
            );
            this.modal.close(true);
          } else {
            this.errorHandler.handleUnkonwError(res);
          }
        },
      });
  }

  close(result: boolean) {
    if (result) this.submit(this.stockForm);
    else this.modal.close(false);
  }

  get amount(): AbstractControl {
    return this.stockForm.controls['amount'];
  }
}
