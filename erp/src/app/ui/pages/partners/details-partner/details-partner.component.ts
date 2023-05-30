import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { GetPartnerUseCase } from 'src/app/partners/application/get-partners.use-case';
import { IPartner } from 'src/app/partners/domain/partner';
import searchConfig, {
  PartnersSearchTypes,
} from 'src/app/ui/components/searcher/search.config';
import { ActiveEntityService } from 'src/app/ui/services/active-entity-service.service';
import { EditPartnerComponent } from '../edit-partner/edit-partner.component';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { ConfirmDialogComponent } from 'src/app/ui/shared/components/confirm-dialog/confirm-dialog.component';
import { TogglePartnerActivationUseCase } from 'src/app/partners/application/partner-toggle-activation.use-case';

const modalOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
  size: 'xl',
};

@Component({
  selector: 'app-details-partner',
  templateUrl: './details-partner.component.html',
  styleUrls: ['./details-partner.component.scss'],
})
export class DetailsPartnerComponent implements OnInit, OnDestroy {
  partner!: IPartner;
  id!: string;
  options: Partial<IPartner[]> = [];
  searchTypes: { label: string; value: PartnersSearchTypes }[] =
    searchConfig.PARTNERS_TYPES;
  selectInProgress = false;
  isLoading: boolean = true;

  private destroy$ = new Subject();

  constructor(
    private partnerService: GetPartnerUseCase,
    private partnerLeavesService: TogglePartnerActivationUseCase,
    private modalService: NgbModal,
    private activeEntityService: ActiveEntityService,
    private notifier: NotificationAdapter
  ) {}

  ngOnInit(): void {
    this.getPartnerList();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  handleOptionSelected(option: any): void {
    if (!this.selectInProgress) {
      this.selectInProgress = true;
      this.getPartner(option.partner_id);

      setTimeout(() => {
        this.selectInProgress = false;
      }, 100);
    }
  }

  getPartner(id: string) {
    this.partnerService
      .getPartner(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (partner: IPartner) => {
          this.id = partner.partner_id!;
          this.partner = partner;
          this.isLoading = false;
        },
      });
  }

  getPartnerList() {
    this.partnerService
      .getAllPartnersFiltered()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (partnerList: Partial<IPartner[]>) => {
          this.options = partnerList;
          const lastID = this.getLastPartner(partnerList);
          if (lastID) this.getPartner(lastID!);
        },
      });
  }

  getLastPartner(partnerList: Partial<IPartner[]>): string | undefined {
    if (partnerList && partnerList.length > 0) {
      const lastPartner = partnerList[partnerList.length - 1];
      const lastPartnerId = lastPartner!.partner_id;
      return lastPartnerId;
    }
    return undefined;
  }

  partnerLeaves(id: string) {
    this.partnerLeavesService
      .partnerLeaves(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.affectedRows > 0) {
            this.notifier.showNotification('success', 'Socio dado de baja');
          }
        },
      });
  }

  openEditPartnerDialog() {
    if (!this.partner || !this.id) {
      this.notifier.showNotification('warning', 'Elige un socio primero');
      return;
    }
    this.activeEntityService.setActiveEntity(this.partner, this.id);
    const modalRef = this.modalService.open(EditPartnerComponent, modalOptions);
    modalRef.componentInstance.uid = this.id;
    modalRef.result
      .then((result) => {
        if (result) {
          this.isLoading = true;
          this.getPartner(this.id);
          this.activeEntityService.clearActiveEntity();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openConfirmDialog(): void {
    if (!this.id) {
      this.notifier.showNotification('warning', 'Elige un socio primero');
      return;
    }
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.message = 'El socio será dado de baja';
    modalRef.result
      .then((result) => {
        if (result) {
          this.partnerLeaves(this.id!);
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }
}
