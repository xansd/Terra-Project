import { FeesVariants } from "../../fees/domain/fees";
import { IPartner } from "../../partners/domain/partner";
import { IODTGenerator } from "../../partners/domain/partner.repository";

const odt = require("odt-template");
const fs = require("fs");

class ODTGenerator implements IODTGenerator {
  constructor() {}

  generateDocument(
    partner: IPartner,
    sourceDoc: string,
    outPutDoc: string,
    type: string
  ) {
    const templatePath = sourceDoc;
    const outputPath = outPutDoc;
    let data;

    // Cargar el archivo de plantilla ODT
    const template = new odt.Template(fs.readFileSync(templatePath, "binary"));

    const alta = {
      surname: partner.surname,
      name: partner.name,
      dni: partner.dni,
      birth_date: partner.birthday,
      phone: partner.phone,
      email: partner.email,
      date: "20/09/2023",
    };

    const cultivo = {
      surname: partner.surname,
      name: partner.name,
      number: partner.number,
      cannabis_month: partner.cannabis_month,
      hash_month: partner.hash_month,
      extractions_month: partner.extractions_month,
      others_month: partner.others_month,
      date: "22/09/2023",
    };

    const recibo = {
      name: partner.name,
      surname: partner.surname,
      number: partner.number,
      fee: this.getFeeAmount(partner.fee!),
    };

    switch (type) {
      case "alta":
        data = alta;
        break;
      case "cultivo":
        data = "cultivo";
        break;
      case "recibo":
        data = "recibo";
        break;
    }

    // Completar la plantilla con los datos del socio
    const output = template.generate(data);

    // Guardar el documento ODT generado en el sistema de archivos
    fs.writeFileSync(outputPath, output, "binary");

    // Retornar el path del archivo generado
    return outputPath;
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
