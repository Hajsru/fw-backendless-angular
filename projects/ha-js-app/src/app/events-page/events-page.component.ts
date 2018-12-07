import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Events, EventService } from '@it-quasar/ha-js-core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EventsPageComponent implements OnInit {
  events$!: Observable<Events>;

  constructor(private evenService: EventService) {}

  ngOnInit() {
    this.events$ = this.evenService.getEvents();
  }
}
