import { Injectable } from '@angular/core';
import { SpeakerService } from './speaker.service';
import { Report } from './report.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReportHelperService {
  constructor(private speakerService: SpeakerService) {}

  getReportAuthorName(report: Report): Observable<string> {
    const authorId = report.author ? report.author.id : null;
    return !authorId
      ? of('')
      : this.speakerService.getSpeaker(authorId).pipe(
          map(speaker => {
            if (!speaker) {
              throw new Error(`Nof found speaker with id=${authorId}`);
            }

            return speaker.name;
          }),
        );
  }
}
