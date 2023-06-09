export interface IPersistenceMapper<Domain, Persistence> {
  toDomain(persistence: Persistence): Domain;
  toPersistence(domain: Domain): Persistence;
  toPersistenceList(domainList: Domain[]): Persistence[];
  toDomainList(persistenceList: Persistence[]): Domain[];
}
