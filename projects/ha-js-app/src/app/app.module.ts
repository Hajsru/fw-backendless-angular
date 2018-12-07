import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HaJsCoreModule } from '@it-quasar/ha-js-core';
import { environment } from '../environments/environment';
import { AsideComponent } from './aside/aside.component';
import { ItemComponent } from './item/item.component';
import { EventsPageComponent } from './events-page/events-page.component';
import { AppRoutingModule } from './app-routing.module';
import { SpeakersPageComponent } from './speakers-page/speakers-page.component';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import { RatingComponent } from './rating/rating.component';
import { ReportPageComponent } from './report-page/report-page.component';

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
  imports: [BrowserModule, HaJsCoreModule.initializeApp(environment.firebase), AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
