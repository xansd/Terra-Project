export interface IAPIMapper<Domain, Api> {
  toDomain(api: Api): Domain;
  toPersistence(domain: Domain): Api;
  toPersistenceList(domainList: Domain[]): Api[];
  toDomainList(persistenceList: Api[]): Domain[];
}
