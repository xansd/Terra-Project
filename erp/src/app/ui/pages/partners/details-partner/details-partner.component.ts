import { Component, OnInit } from '@angular/core';
import { GetPartnerUseCase } from 'src/app/partners/application/get-partners.use-case';
import { IPartner } from 'src/app/partners/domain/partner';

@Component({
  selector: 'app-details-partner',
  templateUrl: './details-partner.component.html',
  styleUrls: ['./details-partner.component.scss'],
})
export class DetailsPartnerComponent implements OnInit {
  partner!: IPartner;
  id!: string;
  options: Partial<IPartner[]> = [];
  constructor(private partnerService: GetPartnerUseCase) {}

  ngOnInit(): void {
    this.getPartnerList();
  }

  getPartnerList() {
    this.partnerService.getAllPartnersFiltered().subscribe({
      next: (partnerList: Partial<IPartner[]>) => {
        this.options = partnerList;
      },
    });
  }
}
