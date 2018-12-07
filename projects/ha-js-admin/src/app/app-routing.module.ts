import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsPageComponent } from './events-page/events-page.component';
import { SpeakersPageComponent } from './speakers-page/speakers-page.component';
import { ReportsPageComponent } from './reports-page/reports-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'events', component: EventsPageComponent },
  { path: 'speakers', component: SpeakersPageComponent },
  { path: 'reports', component: ReportsPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
