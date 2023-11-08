import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamBuilderComponent } from './team-builder.component';

const routes: Routes = [
    {
        path: '',
        component: TeamBuilderComponent,
        children: [{
            path: 'captain',
            loadChildren: () =>
                import('./captain/captain.module').then((m) => m.CaptainModule)
        },{
            path: 'runner',
            loadChildren: () =>
                import('./runner/runner.module').then((m) => m.RunnerModule)
        }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TeamBuilderRoutingModule { }
