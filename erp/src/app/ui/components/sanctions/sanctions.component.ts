import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { IPartner } from 'src/app/partners/domain/partner';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { FormsHelperService } from '../../shared/helpers/forms-helper.service';
import { CreatePartnerUseCase } from 'src/app/partners/application/create-partner.use-case';
import { Subject, scan, takeUntil } from 'rxjs';
import config from '../../../config/client.config';
import { ISanctions } from 'src/app/partners/domain/sanctions';
import { DatetimeHelperService } from 'src/app/shared/application/datetime.helper.service';
import { DeletePartnerUseCase } from 'src/app/partners/application/delete-user.case-use';

@Component({
  selector: 'app-sanctions',
  templateUrl: './sanctions.component.html',
  styleUrls: ['./sanctions.component.scss'],
})
export class SanctionsComponent implements OnInit {
  @Input('partner') partner!: IPartner;
  @Output() sanctionModified: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  severities: { name: string; level: number }[] = config.SEVERITY;
  sanctionForm: UntypedFormGroup = this.formBuilder.group({
    severity: [this.severities[0].level, [Validators.required]],
    description: ['', [Validators.required]],
  });
  private destroy$ = new Subject();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private formsHelperService: FormsHelperService,
    private createService: CreatePartnerUseCase,
    private deleteService: DeletePartnerUseCase,
    private notifier: NotificationAdapter
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    console.log(this.partner);
  }

  addSanction(form: FormGroup) {
    if (!form.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(form);
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    }
    const sanction = this.formsHelperService.createSanctionFormData(
      form,
      this.partner
    );
    this.createService
      .createSanction(sanction)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.notifier.showNotification('success', 'Sanción registrada');
          this.sanctionModified.emit(true);
          this.addInLocal(res);
        },
      });
    this.sanctionForm.get('description')?.setValue('');
  }

  deleteSanction(index: number) {
    this.deleteService
      .deletePartnerSanction(this.partner.sanctions![index].sanction_id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.notifier.showNotification('success', 'Sanción eliminada');
          this.sanctionModified.emit(true);
          this.subsInTLocal(index);
        },
      });
  }

  addInLocal(sanction: ISanctions) {
    sanction.created_at = DatetimeHelperService.dateToString(new Date());
    this.partner.sanctions?.push(sanction);
  }

  subsInTLocal(index: number) {
    this.partner.sanctions?.splice(index, 1);
  }

  getNameOfSeverityLevel(level: number): string {
    switch (level) {
      case 1:
        return this.severities[level - 1].name;
      case 2:
        return this.severities[level - 1].name;
      case 3:
        return this.severities[level - 1].name;
    }
    return '';
  }
}
