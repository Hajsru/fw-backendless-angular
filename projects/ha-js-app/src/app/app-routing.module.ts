import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EventsPageComponent } from './events-page/events-page.component';
import { SpeakersPageComponent } from './speakers-page/speakers-page.component';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import { ReportPageComponent } from './report-page/report-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'events', component: EventsPageComponent },
  { path: 'speakers', component: SpeakersPageComponent },
  { path: 'reports', component: ReportsPageComponent },
  { path: 'report/:id', component: ReportPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
