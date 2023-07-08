import { IPartnerSubsetDTO } from "../application/partner.dto";
import { IPartner, IPartnersType, ISanctions } from "./partner";

export interface IPartnerRepository {
  getById(partnerId: string): Promise<IPartner>;
  getAll(): Promise<IPartner[]>;
  getAllFiltered(): Promise<IPartnerSubsetDTO[]>;
  getTypes(): Promise<IPartnersType[]>;
  getPartnerLastNumber(): Promise<number>;
  create(partner: IPartner): Promise<IPartner>;
  update(partner: IPartner): Promise<void>;
  delete(partnerId: string, user: string): Promise<void>;
  makeActive(partnerId: string, user: string): Promise<void>;
  makeInactive(partnerId: string, user: string): Promise<void>;
  partnerLeaves(partnerId: string, user: string): Promise<void>;
  checkPartnerExistenceByEmail(email: string): Promise<boolean>;
  updateAccessCode(
    accessCode: string,
    partnerId: string,
    user: string
  ): Promise<void>;
  updatePartnerCash(
    amount: number,
    partnerId: string,
    user: string
  ): Promise<void>;
  getPartnerCash(partnerId: string): Promise<{ cash: number }>;
  createSanction(sanction: ISanctions, user: string): Promise<ISanctions>;
  deleteSanction(id: string, user: string): Promise<void>;
}

export interface IODTGenerator {
  generateDocument(
    partner: IPartner,
    sourceDoc: string,
    outPutDoc: string,
    type: string
  ): any;
}
