import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Speakers, SpeakerService } from '@it-quasar/ha-js-core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { map, mapTo, startWith, switchMap, take } from 'rxjs/operators';
import {
  SpeakerDialogComponent,
  SpeakerDialogInputData,
  SpeakerDialogOutputData,
} from '../speaker-dialog/speaker-dialog.component';
import { SpeakerData } from '@it-quasar/ha-js-core/src/lib/speaker.service';

@Component({
  selector: 'admin-speakers-page',
  templateUrl: './speakers-page.component.html',
  styleUrls: ['./speakers-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeakersPageComponent implements OnInit {
  columnsToDisplay = ['name', 'work', 'rating', 'voteCount', 'actions'];
  dataSource$!: Observable<Speakers>;
  data$!: Observable<Speakers>;

  constructor(
    private speakerService: SpeakerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.data$ = this.speakerService.getSpeakers();
    this.dataSource$ = this.data$.pipe(startWith([]));
  }

  open(id: string) {
    this.data$
      .pipe(
        map(speakers => speakers.find(speaker => speaker.$id === id)),
        take(1),
        switchMap(speaker => {
          if (!speaker) {
            throw Error(`Not found speaker with id=${id}`);
          }

          return this.openDialog(speaker);
        }),
        // Сохраним данные
        switchMap(dialogOutput => {
          if (!dialogOutput) {
            return of(dialogOutput);
          }

          const speaker = {
            name: dialogOutput.name,
            work: dialogOutput.work,
          };

          return this.speakerService.updateSpeaker(id, speaker).pipe(mapTo(dialogOutput));
        }),
        // Сохраним фото
        switchMap(dialogOutput => {
          if (!dialogOutput || !dialogOutput.newPhoto) {
            return of(dialogOutput);
          }

          return this.speakerService.setPhoto(id, dialogOutput.newPhoto).pipe(mapTo(dialogOutput));
        }),
      )
      .subscribe(dialogOutput => {
        if (dialogOutput) {
          this.snackBar.open('Спикер обновлен', 'Ya, Baby👌');
        }
      });
  }

  remove(id: string) {
    this.data$
      .pipe(
        map(speakers => speakers.find(speaker => speaker.$id === id)),
        take(1),
        switchMap(speaker => {
          if (!speaker) {
            throw Error(`Not found speaker with id=${id}`);
          }

          return this.speakerService.removeSpeaker(speaker.$id);
        }),
      )
      .subscribe(() => {
        this.snackBar.open('Спикер удален', 'Ya, Baby👌');
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
          const speaker: SpeakerData = {
            name: dialogOutput.name,
            work: dialogOutput.work,
            photo: null,
            rating: 0,
            voteCount: 0,
            reports: [],
          };

          return this.speakerService.createSpeaker(speaker).pipe(
            // Сохраним фото
            switchMap(id => {
              if (!dialogOutput || !dialogOutput.newPhoto) {
                return of(undefined);
              }

              return this.speakerService
                .setPhoto(id, dialogOutput.newPhoto)
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

  private openDialog(
    data?: SpeakerDialogInputData,
  ): Observable<SpeakerDialogOutputData | undefined> {
    return this.dialog
      .open<SpeakerDialogComponent, SpeakerDialogInputData | undefined, SpeakerDialogOutputData>(
        SpeakerDialogComponent,
        {
          data,
        },
      )
      .afterClosed();
  }
}
