import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActiveEntityService } from '../../services/active-entity-service.service';
import { IPartner } from 'src/app/partners/domain/partner';
import { GetPartnerUseCase } from 'src/app/partners/application/get-partners.use-case';
import { Observable, Subject, of } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { PartnersSearchTypes } from './search.config';

@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.scss'],
})
export class SearcherComponent implements OnInit, OnDestroy {
  @Input() options: any[] = [];
  @Input() searchTypes: { label: string; value: PartnersSearchTypes }[] = [];
  @Output() optionSelected = new EventEmitter<any>();

  private destroy$ = new Subject();
  partner!: IPartner;
  id!: string;

  searchForm: FormGroup = this.formBuilder.group({
    searchControl: [''],
    typeControl: ['number'],
  });

  searchTerm = new FormControl();
  filteredOptions!: Observable<any[] | Iterable<any> | undefined>;
  selectedSearchType: string = 'number';

  constructor(
    private formBuilder: FormBuilder,
    private activeEntityService: ActiveEntityService,
    private partnerService: GetPartnerUseCase
  ) {}

  ngOnInit(): void {
    this.isEntitySaved();
    if (this.id) this.getPartner(this.id);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      const currentOptions = changes['options'].currentValue;
      if (currentOptions && currentOptions.length > 0) {
        if (this.options.length > 0)
          this.options = this.concatName(this.options);
        this.populateAutocomplete(
          this.concatName(this.concatName(currentOptions))
        );
      } else if (currentOptions && currentOptions.length === 0) {
        this.filteredOptions = of([]);
        this.searchTerm.reset();
      }
    }
  }

  isEntitySaved(): void {
    if (this.activeEntityService.getActiveEntityId()) {
      this.id = this.activeEntityService.getActiveEntityId()!;
    }
  }

  getPartner(id: string) {
    this.partnerService
      .getPartner(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (partner: IPartner) => {
          this.partner = partner;
        },
      });
  }

  concatName(data: IPartner[]): IPartner[] {
    const newArray = data.map((obj) => {
      const fullName = obj.surname + ', ' + obj.name;
      return { ...obj, name: fullName };
    });
    return newArray;
  }

  /*********************************** AUTOCOMPLETE *************************************/

  populateAutocomplete(data: any) {
    this.filteredOptions = this.searchForm.controls[
      'searchControl'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.entrada)),
      map((entrada) => (entrada ? this.filter(entrada) : this.options.slice()))
    );
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) => {
      const optionValue = option[this.selectedSearchType];
      if (typeof optionValue === 'string') {
        return optionValue.toLowerCase().includes(filterValue);
      } else if (typeof optionValue === 'number') {
        return optionValue.toString().includes(filterValue);
      }
      return false;
    });
  }

  filterOptions(): void {
    const searchControlValue = this.searchForm
      .get('searchControl')
      ?.value.toLowerCase();
    this.filteredOptions = of(
      this.options.filter((option: any) => {
        if (typeof option[this.selectedSearchType] === 'string') {
          return option[this.selectedSearchType]
            .toLowerCase()
            .includes(searchControlValue);
        } else if (typeof option[this.selectedSearchType] === 'number') {
          return option[this.selectedSearchType]
            .toString()
            .includes(searchControlValue);
        }
        return false;
      })
    );
  }

  formatter(option: any): string {
    return option[this.selectedSearchType];
  }

  selectOption(selectedValue: any): void {
    this.searchForm.get('searchControl')?.setValue(selectedValue);
    const selectedOption = this.options.find(
      (option) => option[this.selectedSearchType] === selectedValue
    );
    if (selectedOption) {
      this.optionSelected.emit(selectedOption);
    }
  }

  updateSelectedSearchType(value: string): void {
    this.selectedSearchType = value;
    this.searchForm.get('searchControl')?.setValue('');
    this.populateAutocomplete(this.options);
  }

  /*********************************** AUTOCOMPLETE *************************************/
}
