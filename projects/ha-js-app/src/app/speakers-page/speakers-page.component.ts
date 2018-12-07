import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Speakers, SpeakerService } from '@it-quasar/ha-js-core';

@Component({
  selector: 'app-speakers-page',
  templateUrl: './speakers-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SpeakersPageComponent implements OnInit {
  speakers$!: Observable<Speakers>;

  constructor(private speakerService: SpeakerService) {}

  ngOnInit() {
    this.speakers$ = this.speakerService.getSpeakers();
  }
}
