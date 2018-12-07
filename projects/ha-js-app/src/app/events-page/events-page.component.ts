import { Component, OnInit } from '@angular/core';
import { EventService, Events } from '@it-quasar/ha-js-core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.css'],
})
export class EventsPageComponent implements OnInit {
  events$: Observable<Events>;

  constructor(private evenService: EventService) {}

  ngOnInit() {
    this.data$ = this.evenService.getEvents();
  }
}
