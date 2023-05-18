import { IPartnerRepository } from "../../domain/partner.repository";

export interface IManagePartnersDocumentation {
  uploadPartnerDocument(partnerId: string, file: File): Promise<void>;
  deletePartnerDocument(partnerId: string, documentId: string): Promise<void>;
  getPartnerDocument(partnerId: string, documentId: string): Promise<File>;
  getPartnerDocuments(partnerId: string): Promise<File[]>;
}

export class ManagePartnersDocumentation
  implements IManagePartnersDocumentation
{
  constructor(private readonly userRepository: IPartnerRepository) {}
  uploadPartnerDocument(partnerId: string, file: File): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deletePartnerDocument(partnerId: string, documentId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getPartnerDocument(partnerId: string, documentId: string): Promise<File> {
    throw new Error("Method not implemented.");
  }
  getPartnerDocuments(partnerId: string): Promise<File[]> {
    throw new Error("Method not implemented.");
  }
}
