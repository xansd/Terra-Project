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

@Component({
  selector: 'app-update-manicured',
  templateUrl: './update-manicured.component.html',
  styleUrls: ['./update-manicured.component.scss'],
})
export class UpdateManicuredComponent {
  @Input('id') id!: string;
  matcher = new CustomErrorStateMatcher();
  manicuredForm = this.fb.group({
    amount: ['', [Validators.required, Validators.min(0)]],
  });
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
    this.manicuredForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
    });
  }

  submit(form: FormGroup) {
    if (!form.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(form);
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    }

    this.updateServcie
      .updateHarvestManicured(this.id, this.manicuredForm.get('amount')?.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.notifier.showNotification(
              'success',
              'Manicurado del cultivo modificado'
            );
            this.modal.close(true);
          } else {
            this.errorHandler.handleUnkonwError(res);
          }
        },
      });
  }

  close(result: boolean) {
    if (result) this.submit(this.manicuredForm);
    else this.modal.close(false);
  }

  get amount(): AbstractControl {
    return this.manicuredForm.controls['amount'];
  }
}
