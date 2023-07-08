import { FeesVariants } from "../../fees/domain/fees";
import { DatetimeHelperService } from "../../shared/application/datetime.helper.service";
import { DocumentTypes, IPartner } from "../domain/partner";
import { IODTGenerator } from "../domain/partner.repository";
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

export class ODTGenerator implements IODTGenerator {
  constructor() {}

  generateDocument(
    partner: IPartner,
    sourceDoc: string,
    outPutDoc: string,
    type: string
  ) {
    // Load the docx file as binary content
    const content = fs.readFileSync(
      path.resolve(__dirname, `../../../../../documents/${sourceDoc}`),
      "binary"
    );

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
    doc.render(this.getData(type, partner));

    const buf = doc.getZip().generate({
      type: "nodebuffer",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });

    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.
    fs.writeFileSync(
      path.resolve(__dirname, `../../../../../documents/${outPutDoc}`),
      buf
    );
  }

  getData(type: string, partner: IPartner) {
    const alta = {
      surname: partner.surname,
      name: partner.name,
      dni: partner.dni || "",
      birth_date: DatetimeHelperService.__toString(partner.birthday),
      phone: partner.phone,
      email: partner.email.value,
      date: "20/09/2023",
    };

    const cultivo = {
      surname: partner.surname,
      name: partner.name,
      number: partner.number,
      cannabis_month: partner.cannabis_month.toString(),
      hash_month: partner.hash_month.toString(),
      extractions_month: partner.extractions_month.toString(),
      others_month: partner.others_month.toString(),
      date: "22/09/2023",
    };

    const recibo = {
      name: partner.name,
      surname: partner.surname,
      number: partner.number,
      fee: this.getFeeAmount(partner.fee!),
    };

    let data = {};

    switch (type) {
      case DocumentTypes.ALTA:
        data = alta;
        break;
      case DocumentTypes.CULTIVO:
        data = cultivo;
        break;
      case DocumentTypes.RECIBO_ALTA:
        data = recibo;
        break;
      case DocumentTypes.RECIBO_CUOTA:
        data = recibo;
        break;
    }

    return data;
  }

  getFeeAmount(fee: FeesVariants): string {
    switch (fee) {
      case FeesVariants.CUOTA_20:
        return "20€";
      case FeesVariants.INSCRIPCION_10:
        return "10€";
      case FeesVariants.INSCRIPCION_20:
        return "20€";
      default:
        return "20€";
    }
  }
}
