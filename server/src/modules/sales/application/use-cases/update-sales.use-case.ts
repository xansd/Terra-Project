import { ISales } from "../../domain/sales";
import { ISalesRepository } from "../../domain/sales.repository";
import { ISalesDTO, SalesMapper } from "../sales-dto.mapper";

export interface IUpdateSales {
  create(sale: ISalesDTO): Promise<ISales>;
  delete(id: string): Promise<void>;
}

export class UpdateSales implements IUpdateSales {
  private saleMapper: SalesMapper = new SalesMapper();
  saleDomain!: ISales;

  constructor(private readonly SaleRepository: ISalesRepository) {}

  async create(sale: ISalesDTO): Promise<ISales> {
    this.saleDomain = this.saleMapper.toDomain(sale);
    const SaleRepository = await this.SaleRepository.create(this.saleDomain);
    return SaleRepository;
  }

  async delete(id: string): Promise<void> {
    const result = await this.SaleRepository.delete(id);
    return result;
  }
}
