import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HaJsCoreModule } from '@it-quasar/ha-js-core';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AsideComponent } from './aside/aside.component';
import { ItemComponent } from './item/item.component';
import { EventsPageComponent } from './events-page/events-page.component';
import { AppRoutingModule } from './app-routing.module';
import { SpeakersPageComponent } from './speakers-page/speakers-page.component';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import { RatingComponent } from './rating/rating.component';
import { ReportPageComponent } from './report-page/report-page.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    AsideComponent,
    ItemComponent,
    EventsPageComponent,
    SpeakersPageComponent,
    ReportsPageComponent,
    RatingComponent,
    ReportPageComponent,
  ],
  imports: [
    BrowserModule,
    HaJsCoreModule.initializeApp(environment.firebase),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
