import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { LandingComponent } from './common/landing/landing.component'

const routes: Routes = [

  { path: '', redirectTo:'account',pathMatch: 'full'},
  { path: 'account', loadChildren: "./account/account.module#AccountModule" },
  //  { path:'**', redirectTo:'account',pathMatch: 'full'}, 
  { path: 'home', loadChildren: "./portal-home/portal-home.module#PortalHomeModule" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
