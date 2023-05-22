import { IPartner, IPartnersType } from "./partner";

export interface IPartnerRepository {
  getById(partnerId: string): Promise<IPartner>;
  getAll(): Promise<IPartner[]>;
  getTypes(): Promise<IPartnersType[]>;
  getPartnerLastNumber(): Promise<number>;
  create(partner: IPartner): Promise<IPartner>;
  update(partner: IPartner): Promise<IPartner>;
  delete(partnerId: string): Promise<void>;
  makeActive(partnerId: string): Promise<void>;
  makeInactive(partnerId: string): Promise<void>;
  // uploadPartnerDocument(partnerId: string, file: File): Promise<void>;
  // getPartnerDocument(partnerId: string): Promise<File>;
  // getAllPartnerDocuments(partnerId: string): Promise<File[]>;
  // deletePartnerDocument(documentId: string): Promise<void>;
  checkPartnerExistenceByEmail(email: string): Promise<boolean>;
}
