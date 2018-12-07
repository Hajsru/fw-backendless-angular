import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  DocumentReference,
} from '@angular/fire/firestore';
import { catchError, filter, map, mapTo, publishReplay, switchMap, take } from 'rxjs/operators';
import { Image } from './image';
import { AngularFireStorage } from '@angular/fire/storage';
import { generate as generageId } from 'shortid';

export interface SpeakerData {
  readonly name: string;
  readonly work: string;
  readonly rating: number;
  readonly voteCount: number;
  readonly reports: DocumentReference[];
  readonly photo: Image | null;
}

export interface Speaker extends SpeakerData {
  readonly $id: string;
}

export type Speakers = Readonly<Speaker[]>;

@Injectable({
  providedIn: 'root',
})
export class SpeakerService {
  private speakers$!: Observable<Speakers>;

  constructor(private firesotre: AngularFirestore, private storage: AngularFireStorage) {}

  getSpeakers(): Observable<Speakers> {
    if (!this.speakers$) {
      this.speakers$ = this.firesotre
        .collection<SpeakerData>('/speakers')
        .snapshotChanges()
        .pipe(
          map(snapshot => {
            return snapshot.map(value => {
              const speaker = value.payload.doc.data();
              const $id = value.payload.doc.id;

              return { ...speaker, $id };
            });
          }),
          publishReplay(1),
        );
      (this.speakers$ as any).connect();
    }

    return this.speakers$;
  }

  private getSpeakerDoc(speakerId: string): AngularFirestoreDocument<SpeakerData> {
    return this.firesotre.doc<SpeakerData>(`/speakers/${speakerId}`);
  }

  getSpeakerRef(speakerId: string): DocumentReference {
    return this.getSpeakerDoc(speakerId).ref;
  }

  getSpeaker(speakerId: string): Observable<Speaker | undefined> {
    return this.getSpeakerDoc(speakerId)
      .valueChanges()
      .pipe(
        map(speaker => {
          if (!speaker) {
            return undefined;
          }

          return { ...speaker, $id: speakerId };
        }),
      );
  }

  createSpeaker(value: SpeakerData): Observable<string> {
    return from(this.firesotre.collection<SpeakerData>(`/speakers`).add(value)).pipe(
      map(ref => ref.id),
    );
  }

  updateSpeaker(speakerId: string, value: Partial<SpeakerData>): Observable<void> {
    return from(this.getSpeakerDoc(speakerId).update(value)).pipe(mapTo(undefined));
  }

  removeSpeaker(speakerId: string): Observable<void> {
    return from(this.getSpeakerDoc(speakerId).delete()).pipe(mapTo(undefined));
  }

  setPhoto(speakerId: string, photo: File): Observable<void> {
    return this.getSpeaker(speakerId).pipe(
      take(1),
      // Удалим старую фотку
      switchMap(speaker => {
        if (!speaker) {
          throw new Error(`Speaker with id=${speakerId} not exist`);
        }

        if (speaker.photo) {
          const fileRef = this.storage.ref(speaker.photo.ref);
          return fileRef.delete().pipe(catchError(() => of(undefined)));
        }

        return of(undefined);
      }),
      switchMap(() => {
        const nameExt = photo.name.split('.').pop();
        if (!nameExt) {
          throw new Error('Not valid file extension.');
        }

        const ext = nameExt.toLowerCase();
        const filePath = `/speakers/${generageId()}.${ext}`;
        const fileRef = this.storage.ref(filePath);
        return fileRef
          .put(photo)
          .percentageChanges()
          .pipe(
            filter(percent => percent !== undefined && percent >= 100),
            switchMap(() => fileRef.getDownloadURL()),
            map(src => {
              return {
                ref: filePath,
                src,
              };
            }),
            take(1),
          );
      }),
      switchMap((newPhoto: Image) => {
        return this.updateSpeaker(speakerId, { photo: newPhoto });
      }),
    );
  }
}
