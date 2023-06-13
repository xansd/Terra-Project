import { ILocalFileHandler } from "../../../files/domain/file.repository";
import { DocumentTypes, IPartner } from "../../domain/partner";
import { IODTGenerator } from "../../domain/partner.repository";

export class PartnerDocumentsService {
  constructor(
    private readonly odtGenerator: IODTGenerator,
    private readonly localFileHandler: ILocalFileHandler
  ) {}

  async generateDocument(partner: IPartner, documentType: DocumentTypes) {
    let src, out, type;
    switch (documentType) {
      case DocumentTypes.ALTA:
        src = "alta_socio.docx";
        out = "nueva_alta_socio.docx";
        type = DocumentTypes.ALTA;
        await this.odtGenerator.generateDocument(partner, src, out, type);
        return out;
      case DocumentTypes.CULTIVO:
        src = "contrato_cultivo_mancomunado.docx";
        out = "nuevo_contrato_cultivo_mancomunado.docx";
        type = DocumentTypes.CULTIVO;
        await this.odtGenerator.generateDocument(partner, src, out, type);
        return out;
      case DocumentTypes.RECIBO_ALTA:
        src = "recibo_alta.docx";
        out = "nuevo_recibo_alta.docx";
        type = DocumentTypes.RECIBO_ALTA;
        await this.odtGenerator.generateDocument(partner, src, out, type);
        return out;
      case DocumentTypes.RECIBO_CUOTA:
        src = "recibo_cuota.docx";
        out = "nuevo_recibo_cuota.docx";
        type = DocumentTypes.RECIBO_CUOTA;
        await this.odtGenerator.generateDocument(partner, src, out, type);
        return out;
    }
  }

  async downloadDocument(out: string): Promise<any> {
    return this.localFileHandler.downloadFile(out);
  }
}
