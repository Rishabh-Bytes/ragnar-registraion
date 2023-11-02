import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RegistrationComponent } from './registration.component';
import { InfoComponent } from './info/info.component';
import { PaymentComponent } from './payment/payment.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AuthGuard } from '../auth/gaurd/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: RegistrationComponent,
    children: [{
      path: 'info',
      component: InfoComponent,
      // canActivate:[AuthGuard]
    },
    {
      path: 'payment',
      component: PaymentComponent
    },
    {
      path: 'confirmation',
      component: ConfirmationComponent
    },
    { path: '', redirectTo: 'info', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationRoutingModule { }
