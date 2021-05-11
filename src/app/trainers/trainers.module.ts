import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainersRoutingModule } from './trainers-routing.module';
import { TrainersComponent } from './trainers.component';
import { InfoComponent } from './components/info/info.component';
import { CurriculumComponent } from './components/curriculum/curriculum.component';
import { BatchDataComponent } from './components/batch-data/batch-data.component';
import { ReferencesComponent } from './components/references/references.component';
import { RepoLinksComponent } from './components/repo-links/repo-links.component';
import { InviteComponent } from './components/invite/invite.component';
import { SidenavModule } from '../sidenav/sidenav.module';
import { LandingComponent } from './components/landing/landing.component';
import { ChartsModule } from 'ng2-charts';
import { NavGroupComponent } from './components/nav-group/nav-group.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin


FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
]);


@NgModule({
  declarations: [
    TrainersComponent,
    InfoComponent,
    CurriculumComponent,
    BatchDataComponent,
    ReferencesComponent,
    RepoLinksComponent,
    InviteComponent,
    LandingComponent,
    NavGroupComponent
    

  ],
  imports: [
    CommonModule,
    TrainersRoutingModule,
    SidenavModule,
    ChartsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    FormsModule
  ]
})
export class TrainersModule { }
