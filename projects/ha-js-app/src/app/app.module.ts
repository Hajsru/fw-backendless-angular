import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HaJsCoreModule } from 'ha-js-core';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HaJsCoreModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
