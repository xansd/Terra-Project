export enum PartnersSearchTypes {
  NAME = 'name',
  DNI = 'dni',
  NUMBER = 'number',
  ID = 'partner_id',
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
};
