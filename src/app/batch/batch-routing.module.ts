import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchComponent } from './batch.component';
import { AveragesComponent } from './averages/averages.component';
import { AssociatesComponent } from '../associates/associates.component';
import { CompetenciesComponent } from '../associates/competencies/competencies.component';
import { CurriculumComponent } from './curriculum/curriculum.component';


const routes: Routes = [
	{ path: '', component: BatchComponent,
		children: [
			{ path: 'averages', component: AveragesComponent },
			{ path: 'curriculum', component: CurriculumComponent },
			{ path: 'competencies', component: CompetenciesComponent}
			
		
		]
	 } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BatchRoutingModule { }
