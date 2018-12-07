import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventsPageComponent } from './events-page/events-page.component';
import { environment } from '../environments/environment';
import { HaJsCoreModule } from '@it-quasar/ha-js-core';
import { EventDialogComponent } from './event-dialog/event-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SpeakersPageComponent } from './speakers-page/speakers-page.component';
import { SpeakerDialogComponent } from './speaker-dialog/speaker-dialog.component';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';
import { ReportsPageComponent } from './reports-page/reports-page.component';

@NgModule({
  declarations: [
    AppComponent,
    EventsPageComponent,
    EventDialogComponent,
    SpeakersPageComponent,
    SpeakerDialogComponent,
    ReportDialogComponent,
    ReportsPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HaJsCoreModule.initializeApp(environment.firebase),
    AppRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    MatToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [EventDialogComponent, SpeakerDialogComponent, ReportDialogComponent],
})
export class AppModule {}
