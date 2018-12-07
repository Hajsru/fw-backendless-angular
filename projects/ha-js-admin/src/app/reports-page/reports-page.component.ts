import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import {
  EventService,
  Report,
  Reports,
  ReportService,
  SpeakerService,
} from '@it-quasar/ha-js-core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { map, mapTo, startWith, switchMap, take } from 'rxjs/operators';
import {
  ReportDialogComponent,
  ReportDialogInputData,
  ReportDialogOutputData,
} from '../report-dialog/report-dialog.component';
import { ReportData } from '@it-quasar/ha-js-core/src/lib/report.service';

interface Row {
  title: string;
  author: string;
  event: string;
  rating: number;
  voteCount: number;
}

@Component({
  selector: 'admin-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsPageComponent implements OnInit {
  columnsToDisplay = ['title', 'author', 'event', 'rating', 'voteCount', 'actions'];
  dataSource$!: Observable<Row[]>;
  data$!: Observable<Reports>;

  constructor(
    private reportService: ReportService,
    private speakerService: SpeakerService,
    private eventService: EventService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.data$ = this.reportService.getReports();
    this.dataSource$ = this.data$.pipe(
      switchMap(reports => {
        const reports$ = reports.map(report => {
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

          const eventId = report.event ? report.event.id : null;
          const event$ = !eventId
            ? of('')
            : this.eventService.getEvent(eventId).pipe(
                map(event => {
                  if (!event) {
                    throw new Error(`Nof found event with id=${eventId}`);
                  }

                  return event.title;
                }),
              );

          return combineLatest(author$, event$).pipe(
            map(([author, event]) => {
              return {
                ...report,
                author,
                event,
              };
            }),
          );
        });

        return combineLatest(reports$);
      }),
      startWith([]),
    );
  }

  open(id: string) {
    this.data$
      .pipe(
        map(reports => reports.find(report => report.$id === id)),
        take(1),
        switchMap(report => {
          if (!report) {
            throw Error(`Not found report with id=${id}`);
          }

          return this.openDialog(report);
        }),
        // Сохраним данные
        switchMap(dialogOutput => {
          if (!dialogOutput) {
            return of(dialogOutput);
          }

          const report = {
            title: dialogOutput.title,
            author: dialogOutput.authorId
              ? this.speakerService.getSpeakerRef(dialogOutput.authorId)
              : null,
            event: dialogOutput.eventId
              ? this.eventService.getEventRef(dialogOutput.eventId)
              : null,
          };

          return this.reportService.updateReport(id, report).pipe(mapTo(dialogOutput));
        }),
        // Сохраним фото
        switchMap(dialogOutput => {
          if (!dialogOutput || !dialogOutput.newImage) {
            return of(dialogOutput);
          }

          return this.reportService.setImage(id, dialogOutput.newImage).pipe(mapTo(dialogOutput));
        }),
      )
      .subscribe(dialogOutput => {
        if (dialogOutput) {
          this.snackBar.open('Доклад обновлен', 'Ya, Baby👌');
        }
      });
  }

  remove(id: string) {
    this.data$
      .pipe(
        map(reports => reports.find(report => report.$id === id)),
        take(1),
        switchMap(report => {
          if (!report) {
            throw Error(`Not found report with id=${id}`);
          }

          return this.reportService.removeReport(report.$id);
        }),
      )
      .subscribe(() => {
        this.snackBar.open('Доклад удален', 'Ya, Baby👌');
      });
  }

  create() {
    this.openDialog()
      .pipe(
        switchMap(dialogOutput => {
          if (!dialogOutput) {
            return of(dialogOutput);
          }

          // Создадим
          const report: ReportData = {
            title: dialogOutput.title,
            event: dialogOutput.eventId
              ? this.eventService.getEventRef(dialogOutput.eventId)
              : null,
            author: dialogOutput.authorId
              ? this.speakerService.getSpeakerRef(dialogOutput.authorId)
              : null,
            image: null,
            rating: 0,
            voteCount: 0,
          };

          return this.reportService.createReport(report).pipe(
            // Сохраним фото
            switchMap(id => {
              if (!dialogOutput || !dialogOutput.newImage) {
                return of(undefined);
              }

              return this.reportService
                .setImage(id, dialogOutput.newImage)
                .pipe(mapTo(dialogOutput));
            }),
          );
        }),
      )
      .subscribe(result => {
        if (result) {
          this.snackBar.open('Спикер создан', 'Ya, Baby👌');
        }
      });
  }

  private openDialog(report?: Report): Observable<ReportDialogOutputData | undefined> {
    return combineLatest(this.speakerService.getSpeakers(), this.eventService.getEvents()).pipe(
      take(1),
      switchMap(([speakers, events]) => {
        const allAuthors = speakers.map(speaker => {
          return {
            id: speaker.$id,
            name: speaker.name,
          };
        });

        const allEvents = events.map(event => {
          return {
            id: event.$id,
            title: event.title,
          };
        });

        const dialogReport = !report
          ? undefined
          : {
              ...report,
              authorId: report.author ? report.author.id : null,
              eventId: report.event ? report.event.id : null,
            };

        const data: ReportDialogInputData = {
          report: dialogReport,
          allAuthors,
          allEvents,
        };

        return this.dialog
          .open<ReportDialogComponent, ReportDialogInputData, ReportDialogOutputData>(
            ReportDialogComponent,
            {
              data,
            },
          )
          .afterClosed();
      }),
    );
  }
}
