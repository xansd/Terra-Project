import { ILocalFileHandler } from "../../../files/domain/file.repository";
import { IPartner } from "../../domain/partner";
import { IODTGenerator } from "../../domain/partner.repository";

export class PartnerDocumentsService {
  constructor(
    private readonly odtGenerator: IODTGenerator,
    private readonly localFileHandler: ILocalFileHandler
  ) {}

  async generateNewRegistrationDocument(partner: IPartner) {
    const src = "alta_socio.odt";
    const out = "nueva_alta_socio.odt";
    const type = "alta";
    this.odtGenerator.generateDocument(partner, src, out, type);
    const result = await this.localFileHandler.downloadFile(out);
    return result;
  }

  async generateNewContractDocument(partner: IPartner) {
    const src = "contrato_cultivo_mancomunado.odt";
    const out = "nuev0_contrato_cultivo_mancomunado.odt";
    const type = "cultivo";
    this.odtGenerator.generateDocument(partner, src, out, type);
    const result = await this.localFileHandler.downloadFile(out);
    return result;
  }

  async generateNewRegistrationReceipt(partner: IPartner) {
    const src = "recibo_inscripcion.odt";
    const out = "nuevo_recibo_inscripcion.odt";
    const type = "recibo";
    this.odtGenerator.generateDocument(partner, src, out, type);
    const result = await this.localFileHandler.downloadFile(out);
    return result;
  }

  async generateNewFeeReceipt(partner: IPartner) {
    const src = "recibo_cuota.odt";
    const out = "nuevo_recibo_cuota.odt";
    const type = "recibo";
    this.odtGenerator.generateDocument(partner, src, out, type);
    const result = await this.localFileHandler.downloadFile(out);
    return result;
  }
}
