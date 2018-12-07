import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Events, EventService } from '@it-quasar/ha-js-core';
import { Observable, of } from 'rxjs';
import { map, mapTo, startWith, switchMap, take } from 'rxjs/operators';
import { MatDialog, MatSnackBar } from '@angular/material';
import {
  EventDialogComponent,
  EventDialogInputData,
  EventDialogOutputData,
} from '../event-dialog/event-dialog.component';

@Component({
  selector: 'admin-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsPageComponent implements OnInit {
  columnsToDisplay = ['number', 'title', 'location', 'rating', 'voteCount', 'actions'];
  dataSource$!: Observable<Events>;
  data$!: Observable<Events>;

  constructor(
    private eventService: EventService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.data$ = this.eventService.getEvents();
    this.dataSource$ = this.data$.pipe(startWith([]));
  }

  open(id: string) {
    this.data$
      .pipe(
        map(events => events.find(event => event.$id === id)),
        take(1),
        switchMap(event => {
          if (!event) {
            throw new Error(`Not found event with id=${id}`);
          }

          return this.openDialog({
            number: event.number,
            title: event.title,
            location: event.location,
          }).pipe(
            map(value => {
              return {
                event,
                value,
              };
            }),
          );
        }),
        switchMap(result => {
          if (result.value) {
            return this.eventService.updateEvent(result.event.$id, result.value).pipe(mapTo(true));
          }

          return of(false);
        }),
      )
      .subscribe(result => {
        if (result) {
          this.snackBar.open('Митап обновлен', 'Ya, Baby👌');
        }
      });
  }

  remove(id: string) {
    this.data$
      .pipe(
        map(events => events.find(event => event.$id === id)),
        take(1),
        switchMap(event => {
          if (!event) {
            throw new Error(`Not found event with id=${id}`);
          }

          return this.eventService.removeEvent(event.$id);
        }),
      )
      .subscribe(() => {
        this.snackBar.open('Митап удален', 'Ya, Baby👌');
      });
  }

  create() {
    this.openDialog()
      .pipe(
        switchMap(event => {
          if (event) {
            return this.eventService
              .createEvent({ ...event, rating: 0, voteCount: 0 })
              .pipe(mapTo(true));
          }
          return of(false);
        }),
      )
      .subscribe(result => {
        if (result) {
          this.snackBar.open('Митап создан', 'Ya, Baby👌');
        }
      });
  }

  private openDialog(data?: EventDialogInputData): Observable<EventDialogOutputData | undefined> {
    return this.dialog
      .open<EventDialogComponent, EventDialogInputData | undefined, EventDialogOutputData>(
        EventDialogComponent,
        {
          data,
        },
      )
      .afterClosed();
  }
}
