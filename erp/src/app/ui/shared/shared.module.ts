import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, MaterialModule, AppRoutingModule],
  exports: [MaterialModule],
})
export class SharedModule {}
