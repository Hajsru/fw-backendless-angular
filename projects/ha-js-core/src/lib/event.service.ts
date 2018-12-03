import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, publishReplay } from 'rxjs/operators';

export interface Event {
  readonly number: number;
  readonly title: string;
  readonly location: string;
  readonly rating: number;
}

export type Events = Readonly<Event[]>;

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private events$: Observable<Readonly<Event[]>>;

  constructor(private firesotre: AngularFirestore) {}

  getEvents(): Observable<Events> {
    if (!this.events$) {
      this.events$ = this.firesotre
        .collection<Event>('/events', ref => ref.orderBy('number'))
        .valueChanges()
        .pipe(
          map(events => {
            return events.map(event => {
              let decimal = 1;
              if (event.rating % 1 === 0) {
                decimal = 0;
              }

              const rating = parseFloat((Math.round(event.rating * 2) / 2).toFixed(decimal));

              return { ...event, rating };
            });
          }),
          publishReplay(1),
        );
      (this.events$ as any).connect();
    }

    return this.events$;
  }
}
