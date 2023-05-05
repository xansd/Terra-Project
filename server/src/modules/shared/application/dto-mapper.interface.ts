export interface IDTOMapper<Domain, DTO> {
  toDomain(dto: DTO): Domain;
  toDTO(domain: Domain): DTO;
  toDTOList(domainList: Domain[]): DTO[];
  toDomainList(dtoList: DTO[]): Domain[];
}
