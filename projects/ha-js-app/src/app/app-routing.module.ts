import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EventsPageComponent } from './events-page/events-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'events', component: EventsPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
