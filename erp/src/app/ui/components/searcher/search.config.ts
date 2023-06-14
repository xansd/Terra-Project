export enum PartnersSearchTypes {
  NAME = 'name',
  DNI = 'dni',
  NUMBER = 'number',
  ID = 'partner_id',
}

export enum ProductsSearchTypes {
  NAME = 'name',
  CODE = 'code',
  ID = 'product_id',
}

export default {
  PARTNERS_TYPES: [
    {
      label: 'Número',
      value: PartnersSearchTypes.NUMBER,
    },
    {
      label: 'Nombre',
      value: PartnersSearchTypes.NAME,
    },
    {
      label: 'DNI',
      value: PartnersSearchTypes.DNI,
    },
    {
      label: 'ID',
      value: PartnersSearchTypes.ID,
    },
  ],
  PRODUCTS_TYPES: [
    {
      label: 'Nombre',
      value: ProductsSearchTypes.NAME,
    },
    {
      label: 'Código',
      value: ProductsSearchTypes.CODE,
    },
    {
      label: 'ID',
      value: ProductsSearchTypes.ID,
    },
  ],
};
