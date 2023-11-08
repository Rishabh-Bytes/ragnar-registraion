import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamBuilderComponent } from './team-builder.component';
import { TeamBuilderRoutingModule } from './team-builder-routing.module';



@NgModule({
  declarations: [
    TeamBuilderComponent
  ],
  imports: [
    CommonModule,
    TeamBuilderRoutingModule
  ]
})
export class TeamBuilderModule { }
