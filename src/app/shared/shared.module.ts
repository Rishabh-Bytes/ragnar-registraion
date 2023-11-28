import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { ComponentsComponent } from './components/components.component';
import { FormComponent } from './components/form/form.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MoneyPipe } from './pipe/money.pipe';
import { HttpClientModule } from '@angular/common/http';
import { AutoSlashDirective } from './Directives/auto-slash.directive';
import { DateFormatPipe } from './pipe/date-format.pipe';

@NgModule({
  declarations: [
    ComponentsComponent,
    FormComponent,
    StepperComponent,
    MoneyPipe,
    AutoSlashDirective,
    DateFormatPipe,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDatepickerModule,
    HttpClientModule,
  ],
  exports: [FormComponent, MoneyPipe, AutoSlashDirective, DateFormatPipe],
})
export class SharedModule {}
