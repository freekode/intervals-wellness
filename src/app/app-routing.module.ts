import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateWelnessFormRouteGuard } from 'app/wellness-form/can-activate-wellness-form-route.guard';
import { WellnessFormComponent } from 'app/wellness-form/wellness-form.component';
import { ConfigurationComponent } from './configuration/configuration.component';

const routes: Routes = [
  {
    path: 'wellness',
    component: WellnessFormComponent,
    canActivate: [CanActivateWelnessFormRouteGuard]
  },
  {
    path: 'configuration',
    component: ConfigurationComponent,
  },
  {
    path: '',
    redirectTo: '/wellness',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
