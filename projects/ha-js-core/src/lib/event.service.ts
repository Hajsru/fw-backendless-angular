import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  DocumentReference,
} from '@angular/fire/firestore';
import { map, mapTo, publishReplay } from 'rxjs/operators';

interface EventData {
  readonly number: number;
  readonly title: string;
  readonly location: string;
  readonly rating: number;
  readonly voteCount: number;
}

export interface Event extends EventData {
  readonly $id: string;
}

export type Events = Readonly<Event[]>;

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private events$!: Observable<Events>;

  constructor(private firesotre: AngularFirestore) {}

  getEvents(): Observable<Events> {
    if (!this.events$) {
      this.events$ = this.firesotre
        .collection<EventData>('/events', ref => ref.orderBy('number'))
        .snapshotChanges()
        .pipe(
          map(snapshot => {
            return snapshot.map(value => {
              const event = value.payload.doc.data();
              const $id = value.payload.doc.id;

              let decimal = 1;
              if (event.rating % 1 === 0) {
                decimal = 0;
              }

              const rating = parseFloat((Math.round(event.rating * 2) / 2).toFixed(decimal));

              return { ...event, $id, rating };
            });
          }),
          publishReplay(1),
        );
      (this.events$ as any).connect();
    }

    return this.events$;
  }

  private getEventDoc(eventId: string): AngularFirestoreDocument<EventData> {
    return this.firesotre.doc<EventData>(`/events/${eventId}`);
  }

  getEventRef(eventId: string): DocumentReference {
    return this.getEventDoc(eventId).ref;
  }

  getEvent(eventId: string): Observable<Event | undefined> {
    return this.getEventDoc(eventId)
      .valueChanges()
      .pipe(
        map(event => {
          if (!event) {
            return undefined;
          }

          return { ...event, $id: eventId };
        }),
      );
  }

  createEvent(value: EventData): Observable<void> {
    return from(this.firesotre.collection<EventData>(`/events`).add(value)).pipe(mapTo(undefined));
  }

  updateEvent(eventId: string, value: Partial<EventData>): Observable<void> {
    return from(this.getEventDoc(eventId).update(value)).pipe(mapTo(undefined));
  }

  removeEvent(eventId: string): Observable<void> {
    return from(this.getEventDoc(eventId).delete()).pipe(mapTo(undefined));
  }
}
