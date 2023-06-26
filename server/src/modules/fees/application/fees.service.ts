import { TransactionsTypes } from "../../transactions/domain/transactions";
import { IFees, FeesVariants } from "../domain/fees";

export class FeesService {
  isFee(fee: IFees): boolean {
    if (fee.fees_type_id > 2) return false;
    return true;
  }
  isInscription(fee: IFees): boolean {
    if (fee.fees_type_id > 2) return true;
    return false;
  }

  isFeeExent(fee: IFees): boolean {
    if (fee.fees_type_id === 2) return true;
    return false;
  }

  isInscriptionExent(fee: IFees): boolean {
    if (fee.fees_type_id === 3) return true;
    return false;
  }

  getFeesTypeString(feesType: FeesVariants): string {
    switch (feesType) {
      case FeesVariants.CUOTA_20:
        return "CUOTA_20";
      case FeesVariants.CUOTA_EXENTA:
        return "CUOTA_EXENTA";
      case FeesVariants.INSCRIPCION_EXENTA:
        return "INSCRIPCION_EXENTA";
      case FeesVariants.INSCRIPCION_20:
        return "INSCRIPCION_20";
      case FeesVariants.INSCRIPCION_10:
        return "INSCRIPCION_10";
      default:
        return "";
    }
  }

  getTransactionsTypeId(fee: IFees): number {
    if (this.isInscription(fee)) return TransactionsTypes.INGRESO_INSCRIPCION;
    return TransactionsTypes.INGRESO_CUOTA;
  }
}
