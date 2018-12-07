import { Component, OnInit } from '@angular/core';
import { Image, ReportService, SpeakerService } from '@it-quasar/ha-js-core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface FrontendReport {
  image: Image | null;
  title: string;
  author: string;
  rating: number;
}

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.css'],
})
export class ReportsPageComponent implements OnInit {
  reports$!: Observable<FrontendReport[]>;

  constructor(private reportService: ReportService, private speakerService: SpeakerService) {}

  ngOnInit() {
    this.reports$ = this.reportService.getReports().pipe(
      map(reports => {
        return reports.map(report => {
          const authorId = report.author ? report.author.id : null;
          const author$ = !authorId
            ? of('')
            : this.speakerService.getSpeaker(authorId).pipe(
                map(speaker => {
                  if (!speaker) {
                    throw new Error(`Nof found speaker with id=${authorId}`);
                  }

                  return speaker.name;
                }),
              );

          return author$.pipe(
            map(author => {
              return { ...report, author, title: `«${report.title}»` };
            }),
          );
        });
      }),
      switchMap(reports$ => combineLatest(reports$)),
    );
  }
}
