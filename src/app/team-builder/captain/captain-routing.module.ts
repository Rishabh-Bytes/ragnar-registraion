import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaptainComponent } from './captain.component';
import { InfoComponent } from './info/info.component';
import { AuthGuard } from 'src/app/auth/gaurd/auth.guard';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  {
    path: '',
    component: CaptainComponent,
    children: [
      {
        path: 'info',
        component: InfoComponent,
      },
      {
        path: 'payment',
        component: PaymentComponent,
      },
      { path: '', redirectTo: 'info', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaptainRoutingModule {}
