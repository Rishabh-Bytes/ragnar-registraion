import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info/info.component';
import { CaptainRoutingModule } from './captain-routing.module';
import { CaptainComponent } from './captain.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    CaptainComponent,
    InfoComponent
  ],
  imports: [
    CommonModule,
    CaptainRoutingModule,
    SharedModule
  ]
})
export class CaptainModule { }
