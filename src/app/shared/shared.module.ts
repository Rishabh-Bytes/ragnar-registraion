import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { ComponentsComponent } from './components/components.component';
import { FormComponent } from './components/form/form.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';


@NgModule({
  declarations: [
    ComponentsComponent,
    FormComponent,
    StepperComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({}),
    FormlyBootstrapModule
  ],
  exports: [
    FormComponent
  ]
})
export class SharedModule { }
