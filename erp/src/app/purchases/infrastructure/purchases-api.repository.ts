import SERVER from '../../config/server.config';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HarvestsMapper, IHarvestsDTO } from './harvest-dto.mapper';
import { IPurchaseDTO, PurchasesMapper } from './purchases-dto.mapper';
import { IPurchasesRepository } from '../domain/purchases.repository';
import { IHarvests } from '../domain/harvests';
import { IPurchase } from '../domain/purchases';
import { StockOperations } from 'src/app/products/domain/products';

const API_URI = SERVER.API_URI;

@Injectable({ providedIn: 'root' })
export class PurchasesAPIRepository implements IPurchasesRepository {
  private readonly purchasesMapper: PurchasesMapper;
  private readonly harvestsMapper: HarvestsMapper;
  constructor(private http: HttpClient) {
    this.purchasesMapper = new PurchasesMapper();
    this.harvestsMapper = new HarvestsMapper();
  }

  getPurchaseById(id: string): Observable<IPurchase> {
    return this.http
      .get<IPurchaseDTO>(`${API_URI}/procurement/purchases/single/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((purchase: IPurchaseDTO) => this.purchasesMapper.toDomain(purchase))
      );
  }

  getAllPurchases(): Observable<IPurchase[]> {
    return this.http
      .get<IPurchaseDTO[]>(`${API_URI}/procurement/purchases/all`, {
        withCredentials: true,
      })
      .pipe(
        map((purchaseList: IPurchaseDTO[]) =>
          this.purchasesMapper.toDomainList(purchaseList)
        )
      );
  }

  getAllByProvider(id: string): Observable<IPurchase[]> {
    return this.http
      .get<IPurchaseDTO[]>(
        `${API_URI}/procurement/purchases/all/provider/${id}`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((purchaseList: IPurchaseDTO[]) =>
          this.purchasesMapper.toDomainList(purchaseList)
        )
      );
  }

  getAllByCultivator(id: string): Observable<IHarvests[]> {
    return this.http
      .get<IHarvestsDTO[]>(
        `${API_URI}/procurement/purchases/all/cultivator/${id}`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((purchaseList: IHarvestsDTO[]) =>
          this.harvestsMapper.toDomainList(purchaseList)
        )
      );
  }

  getAllByVariety(id: string): Observable<IHarvests[]> {
    return this.http
      .get<IHarvestsDTO[]>(
        `${API_URI}/procurement/purchases/all/variety/${id}`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((purchaseList: IHarvestsDTO[]) =>
          this.harvestsMapper.toDomainList(purchaseList)
        )
      );
  }

  createPurchase(purchase: IPurchase): Observable<IPurchase> {
    const purchaseDTO = this.purchasesMapper.toDTO(purchase);
    return this.http.post<IPurchase>(
      `${API_URI}/procurement/purchases`,
      purchaseDTO,
      {
        withCredentials: true,
      }
    );
  }

  updatePurchase(purchase: IPurchase): Observable<void> {
    const purchaseDTO = this.purchasesMapper.toDTO(purchase);
    return this.http.put<void>(
      `${API_URI}/procurement/purchases`,
      purchaseDTO,
      {
        withCredentials: true,
      }
    );
  }

  deletePurchase(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URI}/procurement/purchases/${id}`, {
      withCredentials: true,
    });
  }

  getHarvestById(id: string): Observable<IHarvests> {
    return this.http
      .get<IHarvestsDTO>(`${API_URI}/procurement/harvests/single/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((harvest: IHarvestsDTO) => this.harvestsMapper.toDomain(harvest))
      );
  }

  getAllHarvests(): Observable<IHarvests[]> {
    return this.http
      .get<IHarvestsDTO[]>(`${API_URI}/procurement/harvests/all`, {
        withCredentials: true,
      })
      .pipe(
        map((harvestList: IHarvestsDTO[]) =>
          this.harvestsMapper.toDomainList(harvestList)
        )
      );
  }

  createHarvest(harvest: IHarvests): Observable<IHarvests> {
    const harvestsDTO = this.harvestsMapper.toDTO(harvest);
    return this.http.post<IHarvests>(
      `${API_URI}/procurement/harvests`,
      harvestsDTO,
      {
        withCredentials: true,
      }
    );
  }

  updateHarvestStock(
    harvestId: string,
    stock: number,
    operation: StockOperations
  ): Observable<void> {
    return this.http.put<void>(
      `${API_URI}/procurement/harvests/stock`,
      {
        harvest_id: harvestId,
        stock: stock,
        operation: operation,
      },
      {
        withCredentials: true,
      }
    );
  }

  updateHarvestLoss(
    harvestId: string,
    loss: number,
    operation: StockOperations
  ): Observable<void> {
    return this.http.put<void>(
      `${API_URI}/procurement/harvests/loss`,
      {
        harvest_id: harvestId,
        loss: loss,
        operation: operation,
      },
      {
        withCredentials: true,
      }
    );
  }

  updateHarvestFee(harvestId: string, fee: number): Observable<void> {
    return this.http.put<void>(
      `${API_URI}/procurement/harvests/fee/`,
      {
        harvest_id: harvestId,
        fee: fee,
      },
      {
        withCredentials: true,
      }
    );
  }

  updateHarvestManicured(
    harvestId: string,
    manicured: number
  ): Observable<void> {
    return this.http.put<void>(
      `${API_URI}/procurement/harvests/manicured`,
      {
        harvest_id: harvestId,
        manicured: manicured,
      },
      {
        withCredentials: true,
      }
    );
  }

  deleteHarvest(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URI}/procurement/harvests/${id}`, {
      withCredentials: true,
    });
  }
}
