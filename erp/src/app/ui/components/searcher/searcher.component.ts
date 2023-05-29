import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActiveEntityService } from '../../services/active-entity-service.service';
import { IPartner } from 'src/app/partners/domain/partner';
import { GetPartnerUseCase } from 'src/app/partners/application/get-partners.use-case';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.scss'],
})
export class SearcherComponent implements OnInit {
  @Input() options: any[] = [];
  @Input() searchTypes: string[] = [];
  @Output() optionSelected = new EventEmitter<any>();

  partner!: IPartner;
  id!: string;
  _searchTypes = ['name'];

  searchTerm = new FormControl();
  filteredOptions: any[] = [];
  selectedSearchType: string = 'name';

  constructor(
    private activeEntityService: ActiveEntityService,
    private partnerService: GetPartnerUseCase
  ) {}

  ngOnInit(): void {
    this.isEntitySaved();
    if (this.id) this.getPartner(this.id);

    this.searchTerm.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((value) => this.filterOptions(value))
      )
      .subscribe((filteredOptions) => {
        this.filteredOptions = filteredOptions;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      const currentOptions = changes['options'].currentValue;
      if (currentOptions && currentOptions.length > 0) {
        this.filteredOptions = currentOptions;
      }
    }
  }

  isEntitySaved(): void {
    if (this.activeEntityService.getActiveEntityId()) {
      this.id = this.activeEntityService.getActiveEntityId()!;
    }
  }

  getPartner(id: string) {
    this.partnerService.getPartner(id).subscribe({
      next: (partner: IPartner) => {
        this.partner = partner;
      },
    });
  }

  filterOptions(value: string): Observable<any[]> {
    if (value) {
      const filterValue = value.toLowerCase();
      return of(
        this.options.filter((option) =>
          option[this.selectedSearchType].toLowerCase().includes(filterValue)
        )
      );
    } else {
      return of(this.options);
    }
  }

  formatter(option: any): string {
    return option[this.selectedSearchType];
  }

  selectOption(event: MatAutocompleteSelectedEvent): void {
    this.optionSelected.emit(event.option.value);
  }
}
