import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AveragesComponent } from './batch/averages/averages.component';

const routes: Routes = [
  { path: "", redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'trainers', loadChildren: () => import('./trainers/trainers.module').then(m => m.TrainersModule) }, 
  { path: 'associates', loadChildren: () => import('./associates/associates.module').then(m => m.AssociatesModule) },  
  { path: 'batch', loadChildren: () => import('./batch/batch.module').then(m => m.BatchModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'topics', loadChildren: () => import('./topics/topics.module').then(m => m.TopicsModule) },
  { path: 'sidenav', loadChildren: () => import('./sidenav/sidenav.module').then(m => m.SidenavModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {enableTracing: true}
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
