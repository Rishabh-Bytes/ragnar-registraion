import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info/info.component';
import { CaptainRoutingModule } from './captain-routing.module';
import { CaptainComponent } from './captain.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [
    CaptainComponent,
    InfoComponent
  ],
  imports: [
    CommonModule,
    CaptainRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule
  ]
})
export class CaptainModule { }
