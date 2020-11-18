import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { PayComponent } from './pay.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'pay', component: PayComponent},
  {path: 'home/:form/:type/:dojo', component: HomeComponent},
  // redirectTo は'/home'にすると情報を取得できなくなるので注意
  {path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
