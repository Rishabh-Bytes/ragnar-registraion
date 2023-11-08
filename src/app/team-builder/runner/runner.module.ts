import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunnerComponent } from './runner.component';
import { RunnerRoutingModule } from './runner-routing.module';



@NgModule({
  declarations: [
    RunnerComponent
  ],
  imports: [
    CommonModule,
    RunnerRoutingModule
  ]
})
export class RunnerModule { }
