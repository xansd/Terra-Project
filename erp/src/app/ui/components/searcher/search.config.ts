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

export enum HarvestSearchTypes {
  HARVEST_CODE = 'code',
  PRODUCT_NAME = 'product_name',
}

export enum PurchasesSearchTypes {
  PURCHASE_CODE = 'code',
  PRODUCT_NAME = 'product_name',
}

export enum ProviderSearchTypes {
  PROVIDER_NAME = 'name',
}

export enum TransactionsSearchTypes {
  TRANSACTION_CODE = 'code',
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
  HARVEST_TYPES: [
    {
      label: 'Código',
      value: HarvestSearchTypes.HARVEST_CODE,
    },
  ],
  PURCHASES_TYPES: [
    {
      label: 'Código',
      value: PurchasesSearchTypes.PURCHASE_CODE,
    },
  ],
  PROVIDERS_TYPES: [
    {
      label: 'Nombre',
      value: ProviderSearchTypes.PROVIDER_NAME,
    },
  ],
  TRANSACTIONS_TYPES: [
    {
      label: 'Código',
      value: TransactionsSearchTypes.TRANSACTION_CODE,
    },
  ],
};
