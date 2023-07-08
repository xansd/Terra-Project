import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { GetPayments } from 'src/app/payments/application/get-payments.use-cases';
import { IPayments } from 'src/app/payments/domain/payments';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { GetTransactions } from 'src/app/transactions/application/get-transactions.use-cases';
import { ITransactions } from 'src/app/transactions/domain/transactions';
import searchConfig, {
  TransactionsSearchTypes,
} from 'src/app/ui/components/searcher/search.config';
import { ActiveEntityService } from 'src/app/ui/services/active-entity-service.service';
import { PageRoutes } from '../../pages-info.config';

const modalEditOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
  size: 'xl',
};

const modalOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
};

@Component({
  selector: 'app-accounting-details',
  templateUrl: './accounting-details.component.html',
  styleUrls: ['./accounting-details.component.scss'],
})
export class AccountingDetailsComponent {
  p = 1;
  private destroy$ = new Subject();
  isLoading: boolean = true;
  options: ITransactions[] = [];
  searchTypes: { label: string; value: TransactionsSearchTypes }[] =
    searchConfig.TRANSACTIONS_TYPES;
  selectInProgress = false;
  transaction!: ITransactions | undefined;
  payments: IPayments[] = [];

  constructor(
    privatetransactionsService: GetTransactions,
    private modalService: NgbModal,
    private activeEntityService: ActiveEntityService,
    private notifier: NotificationAdapter,
    private paymentsService: GetPayments,
    private router: Router
  ) {}

  openDetails(entity: any) {
    // this.activeEntityService.setActiveEntity(harvest, harvest.harvest_id!);
    // this.router.navigateByUrl(PageRoutes.HARVESTS_DETAILS);
  }

  openEditTransactionsDialog() {}

  openCreateTransactionsDialog() {}
}
