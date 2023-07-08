import { FilesTypes } from 'src/app/files/domain/files';
import { PageRoutes } from '../../pages/pages-info.config';

export default {
  PRODUCTS_VIEWS: [
    PageRoutes.VARIETIES_LIST,
    PageRoutes.VARIETIES_DETAILS,
    PageRoutes.VARIETIES,
    PageRoutes.VARIETIES_STATISTICS,
    PageRoutes.PRODUCTS_DETAILS,
    PageRoutes.PRODUCTS_LIST,
    PageRoutes.PRODUCTS,
    PageRoutes.PRODUCTS_STATISTICS,
  ],
  PARTNERS_VIEWS: [
    PageRoutes.PARTNERS_LIST,
    PageRoutes.PARTNER_DETAILS,
    PageRoutes.PARTNERS,
    PageRoutes.PARTNER_STATISTICS,
  ],
  PARTNERS_DOCUMENTS: [
    FilesTypes.ALTA,
    FilesTypes.CUOTA,
    FilesTypes.DNI,
    FilesTypes.RECIBO,
    FilesTypes.IMAGE,
  ],
  PRODUCTS_DOCUMENTS: [FilesTypes.COVER, FilesTypes.IMAGE],
};
