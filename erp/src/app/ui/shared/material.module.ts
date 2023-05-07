import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSliderModule } from '@angular/material/slider';

const materialModules = [
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatButtonToggleModule,
  MatRadioModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatAutocompleteModule,
  MatSliderModule,
];

@NgModule({
  imports: [materialModules],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
  exports: [materialModules],
})
export class MaterialModule {}
