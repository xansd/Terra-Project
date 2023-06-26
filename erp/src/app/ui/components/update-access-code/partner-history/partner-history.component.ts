import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FeesUseCases } from 'src/app/partners/application/fees.use-case';
import { FeesVariants, IFees } from 'src/app/partners/domain/fees';
import { IPartner } from 'src/app/partners/domain/partner';

@Component({
  selector: 'app-partner-history',
  templateUrl: './partner-history.component.html',
  styleUrls: ['./partner-history.component.scss'],
})
export class PartnerHistoryComponent implements OnInit {
  @Input('fees') fees: IFees[] = [];
  @Input('partner') partner!: IPartner;
  modalRef!: NgbActiveModal;
  sanctionsModified = false;

  constructor(
    public modal: NgbActiveModal,
    private feesService: FeesUseCases
  ) {}

  ngOnInit(): void {
    this.modalRef = this.modal;
  }

  onSanctionModified() {
    this.sanctionsModified = true;
  }

  close(result: boolean) {
    if (this.sanctionsModified) result = true;
    this.modalRef.close(result);
  }

  getFeesType(feesType: FeesVariants) {
    return this.feesService.getFeesTypeString(feesType);
  }
}
