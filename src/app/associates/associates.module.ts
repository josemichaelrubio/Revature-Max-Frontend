import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssociatesRoutingModule } from './associates-routing.module';
import { AssociatesComponent } from './associates.component';
import { SidenavModule } from '../sidenav/sidenav.module';
import { CompetenciesComponent } from './competencies/competencies.component';
import { FormsModule } from '@angular/forms';
import { AssociateLandingComponent } from './associate-landing/associate-landing.component';
import { ChartsModule } from 'ng2-charts';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    AssociatesComponent,
    CompetenciesComponent,
    AssociateLandingComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    AssociatesRoutingModule,
    SidenavModule,
    FormsModule,
    ChartsModule
  ],
  exports: [
  	AssociatesComponent,
  	CompetenciesComponent
  ]
})
export class AssociatesModule { }
