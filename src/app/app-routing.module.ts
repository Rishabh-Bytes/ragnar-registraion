import { RegistrationModule } from './registration/registration.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/gaurd/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'team-builder/:eventId/registration',
    loadChildren: () =>
      import('./team-builder/team-builder.module').then((m) => m.TeamBuilderModule) 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
