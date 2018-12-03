import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HaJsCoreModule } from '@it-quasar/ha-js-core';
import { environment } from '../environments/environment';
import { AsideComponent } from './aside/aside.component';
import { ItemComponent } from './item/item.component';
import { EventsPageComponent } from './events-page/events-page.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent, AsideComponent, ItemComponent, EventsPageComponent],
  imports: [BrowserModule, HaJsCoreModule.initializeApp(environment.firebase), AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
