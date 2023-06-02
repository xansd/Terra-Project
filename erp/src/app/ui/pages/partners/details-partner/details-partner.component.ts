import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject, take, takeUntil } from 'rxjs';
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
import { FeesUseCases } from 'src/app/partners/application/fees.use-case';
import { FeesVariants, IFees, IFeesType } from 'src/app/partners/domain/fees';
import { UpdateAccessCodeComponent } from 'src/app/ui/components/update-access-code/update-access-code.component';
import { FeesTypes } from 'src/app/partners/domain/fees';
import { DatetimeHelperService } from 'src/app/shared/application/datetime.helper.service';
import { CreatePartnerComponent } from '../create-partner/create-partner.component';

const modalEditOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
  size: 'xl',
};
const modalOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
};

@Component({
  selector: 'app-details-partner',
  templateUrl: './details-partner.component.html',
  styleUrls: ['./details-partner.component.scss'],
})
export class DetailsPartnerComponent implements OnInit, OnDestroy {
  partner!: IPartner;
  id!: string;
  fees: IFees[] = [];
  lastCuotaFee!: IFees;
  lastInscriptionFee!: IFees;
  feesType: IFeesType[] = [];
  inscriptionsType: IFeesType[] = [];
  options: Partial<IPartner[]> = [];
  searchTypes: { label: string; value: PartnersSearchTypes }[] =
    searchConfig.PARTNERS_TYPES;
  selectInProgress = false;
  isLoading: boolean = true;

  private destroy$ = new Subject();

  constructor(
    private partnerService: GetPartnerUseCase,
    private feesService: FeesUseCases,
    private partnerLeavesService: TogglePartnerActivationUseCase,
    private modalService: NgbModal,
    private activeEntityService: ActiveEntityService,
    private notifier: NotificationAdapter
  ) {}

  ngOnInit(): void {
    // Carga el buscador
    this.getPartnerList();
    if (this.id) this.getPartner();
  }

  ngOnDestroy(): void {
    this.activeEntityService.clearActiveEntity();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /*************************************CARGA SOCIO**************************************/

  getPartner() {
    if (!this.checkPartnerSelected()) return;
    this.partnerService
      .getPartner(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (partner: IPartner) => {
          this.id = partner.partner_id!;
          this.partner = partner;
          this.activeEntityService.setActiveEntity(this.partner, this.id);
          this.getFeesType();
        },
      });
  }

  getFeesType(): void {
    this.feesService
      .getTypes()
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (types: IFeesType[]) => {
          const feesType: IFeesType[] = [];
          const inscriptionsType: IFeesType[] = [];

          types.forEach((type: IFeesType) => {
            if (type.type === FeesTypes.FEES) {
              feesType.push(type);
            } else if (type.type === FeesTypes.INSCRIPTION) {
              inscriptionsType.push(type);
            }
          });

          this.feesType = feesType;
          this.inscriptionsType = inscriptionsType;
          this.getPartnersFees();
        },
      });
  }

  // Obtener cuotas e inscripciones
  getPartnersFees() {
    if (!this.checkPartnerSelected()) return;
    this.feesService
      .getPartnersFees(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (fees: IFees[]) => {
          this.fees = fees;
          // Filtrar por tipo de fees
          const cuotaFees = fees.filter((fee) => this.isFee(fee));
          const inscripcionFees = fees.filter((fee) => this.isInscription(fee));
          // Obtener el último de cada tipo
          this.lastCuotaFee = this.getLastFee(cuotaFees)!;
          this.lastInscriptionFee = this.getLastFee(inscripcionFees)!;

          this.isLoading = false;
        },
      });
  }

  getLastFee(fees: IFees[]): IFees | undefined {
    if (fees.length === 0) {
      return undefined;
    }
    fees.sort((a, b) => {
      const dateA = a.created_at || '';
      const dateB = b.created_at || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    return fees[0];
  }

  /*************************************CARGA SOCIO**************************************/

  /***************************************ACCIONES***************************************/

  // Alta
  openCreatePartnerDialog() {
    const modalRef = this.modalService.open(
      CreatePartnerComponent,
      modalEditOptions
    );
    modalRef.result
      .then((result) => {
        if (result) {
          this.getPartnerList();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  // Baja
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

  // Actualizar el codigo de acceso
  updateAccessCode() {
    if (!this.checkPartnerSelected()) return;
    const modalRef = this.modalService.open(
      UpdateAccessCodeComponent,
      modalOptions
    );
    modalRef.componentInstance.uid = this.id;
    modalRef.result
      .then((result) => {
        if (result) {
          this.notifier.showNotification('success', 'Codigo actualizado');
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  // Editar socio
  openEditPartnerDialog() {
    if (!this.checkPartnerSelected()) return;
    const modalRef = this.modalService.open(
      EditPartnerComponent,
      modalEditOptions
    );
    modalRef.componentInstance.uid = this.id;
    modalRef.result
      .then((result) => {
        if (result) {
          this.isLoading = true;
          this.getPartner();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  // Dialogo confiramción baja socio
  partnersLeavesConfirm(): void {
    if (!this.checkPartnerSelected()) return;
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

  // Dialogo confirmación pago cuotas e inscripciones
  payFeeConfirm(fee: IFees): void {
    if (!this.checkPartnerSelected()) return;
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    if (this.isFee(fee))
      modalRef.componentInstance.message = '¿Abonar cuota de socio?';
    else if (this.isInscription(fee))
      modalRef.componentInstance.message = '¿Abonar inscripción de socio?';
    modalRef.result
      .then((result) => {
        if (result) {
          this.payFee(fee);
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  // Pagar cuotas e inscripciones
  payFee(fee: IFees) {
    this.feesService
      .payFee(fee)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (fee: any) => {
          this.notifier.showNotification('success', 'Abono completado');
          this.getPartner();
        },
      });
  }

  isFee(fee: IFees): boolean {
    return this.feesService.isFee(fee);
  }
  isInscription(fee: IFees): boolean {
    return this.feesService.isInscription(fee);
  }

  isFeeExent(fee: IFees): boolean {
    return this.feesService.isFeeExent(fee);
  }

  isInscriptionExent(fee: IFees): boolean {
    return this.feesService.isInscriptionExent(fee);
  }

  checkPartnerSelected(): boolean {
    if (!this.id) {
      this.notifier.showNotification('warning', 'Elige un socio primero');
      return false;
    }
    return true;
  }

  /***************************************ACCIONES***************************************/

  /*********************************CONDUCTA************************************/

  conduct: number = 0;
  // Codigo de colores de conducta
  getIconClasses() {
    let classes = [];

    switch (this.conduct) {
      case 0:
        classes.push('text-success border-success');
        break;
      case 1:
        classes.push('text-primary border-primary');
        break;
      case 2:
        classes.push('text-warning border-warning');
        break;
      case 3:
        classes.push('text-danger border-danger');
        break;
      default:
        classes.push('text-success');
    }

    return classes;
  }

  /*********************************CONDUCTA************************************/

  /*********************************BUSCADOR************************************/

  getPartnerList() {
    this.partnerService
      .getAllPartnersFiltered()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (partnerList: Partial<IPartner[]>) => {
          this.options = partnerList;
          const lastID = this.getLastPartner(partnerList);
          if (lastID && !this.id) {
            this.id = lastID;
            this.getPartner();
          }
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

  handleOptionSelected(option: any): void {
    if (!this.selectInProgress) {
      this.selectInProgress = true;
      this.id = option.partner_id;
      this.getPartner();

      setTimeout(() => {
        this.selectInProgress = false;
      }, 100);
    }
  }
  /*********************************BUSCADOR************************************/

  /*********************************VISTA************************************/

  // Topes sobrepasados
  overMonth = 0;
  overTotal = 0;

  formatDate(date: string): string {
    return DatetimeHelperService.dateToView(date);
  }

  getTotalTopMonth() {
    return (
      Number(this.partner.cannabis_month) +
      Number(this.partner.hash_month) +
      Number(this.partner.extractions_month) +
      Number(this.partner.others_month)
    );
  }

  getFeesTypeString(feesType: FeesVariants): string {
    return this.feesService.getFeesTypeString(feesType);
  }

  isExpired(expiration: string): boolean {
    return this.feesService.isFeeExpired(expiration);
  }

  isCurrentMonth(expiration: string): boolean {
    return this.feesService.isFeesCurrentMonth(expiration);
  }
}
