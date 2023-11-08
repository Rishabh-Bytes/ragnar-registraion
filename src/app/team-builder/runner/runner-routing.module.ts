import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RunnerComponent } from './runner.component';

const routes: Routes = [
  {
    path: '',
    component: RunnerComponent,
    // children: [{
    //   path: 'info',
    //   component: InfoComponent,
    //   // canActivate:[AuthGuard]
    // },
    // { path: '', redirectTo: 'info', pathMatch: 'full' },
    // ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RunnerRoutingModule { }
