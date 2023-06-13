import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IFees } from 'src/app/partners/domain/fees';
import { IPartner } from 'src/app/partners/domain/partner';

@Component({
  selector: 'app-partner-history',
  templateUrl: './partner-history.component.html',
  styleUrls: ['./partner-history.component.scss'],
})
export class PartnerHistoryComponent implements OnInit {
  @Input('fees') fees: IFees[] = [];
  @Input('partner') partner: IPartner[] = [];
  modalRef!: NgbActiveModal;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {
    this.modalRef = this.modal;
  }

  close(result: boolean) {
    this.modalRef.close(result);
  }
}