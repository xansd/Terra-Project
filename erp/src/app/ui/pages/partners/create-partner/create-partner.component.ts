import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CreatePartnerUseCase } from 'src/app/partners/application/create-partner.use-case';
import { IPartner } from 'src/app/partners/domain/partner';
import { DomainValidationError } from 'src/app/shared/domain/domain-validation.exception';
import { Email } from 'src/app/shared/domain/value-objects/email.value-object';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { FormsHelperService } from 'src/app/ui/shared/helpers/forms-helper.service';

@Component({
  selector: 'app-create-partner',
  templateUrl: './create-partner.component.html',
  styleUrls: ['./create-partner.component.scss'],
})
export class CreatePartnerComponent {
  partnerNumber: number = 0;

  constructor(
    public modal: NgbActiveModal,
    private formBuilder: UntypedFormBuilder,
    private notifier: NotificationAdapter,
    private errorHandler: ErrorHandlerService,
    private formsHelperService: FormsHelperService,
    private createPartnerService: CreatePartnerUseCase
  ) {}

  createPartnerForm: UntypedFormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    rol: [null, Validators.required],
  });
  private destroy$ = new Subject();

  createPartner(partner: IPartner): void {
    let email!: Email;
    try {
      partner.email = Email.create(this.createPartnerForm.value.email);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        this.errorHandler.handleDomainError(error);
      } else this.errorHandler.handleUnkonwError(error);
    }

    this.apiCreatePartner(partner)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.notifier.showNotification('success', 'Socio creado');
            this.modal.close(res);
          }
        },
      });
  }
  apiCreatePartner(partner: IPartner): Observable<void> {
    return this.createPartnerService.createPartner(partner);
  }
}
