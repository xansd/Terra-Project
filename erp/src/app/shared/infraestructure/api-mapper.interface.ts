export interface IAPIMapper<Domain, Api> {
  toDomain(api: Api): Domain;
  toAPI(domain: Domain): Api;
  toAPIList(domainList: Domain[]): Api[];
  toDomainList(persistenceList: Api[]): Domain[];
}
