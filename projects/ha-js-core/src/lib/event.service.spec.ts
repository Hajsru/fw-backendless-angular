import { TestBed } from '@angular/core/testing';

import { EventService } from './event.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

describe('EventService', () => {
  let service: EventService;
  let firebase: AngularFirestore;

  const dbEvents = [
    {
      number: 1,
      title: 'Первый митап Ha.js',
      location: 'Рок-бар "Гараж"',
      rating: 4,
    },
    {
      number: 2,
      title: 'Ha.js #2',
      location: 'Рок-бар "Гараж"',
      rating: 4.8,
    },
    {
      number: 3,
      title: 'Ha.js #3',
      location: 'Бар "Банифаций"',
      rating: 3,
    },
  ];

  const expectedEvents = [
    {
      number: 1,
      title: 'Первый митап Ha.js',
      location: 'Рок-бар "Гараж"',
      rating: 4,
    },
    {
      number: 2,
      title: 'Ha.js #2',
      location: 'Рок-бар "Гараж"',
      rating: 5,
    },
    {
      number: 3,
      title: 'Ha.js #3',
      location: 'Бар "Банифаций"',
      rating: 3,
    },
  ];

  const angularFirestoreStub = {
    collection(path: string) {
      return {
        valueChanges() {
          return of(dbEvents);
        },
      };
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AngularFirestore, useValue: angularFirestoreStub }],
    });
    service = TestBed.get(EventService);
    firebase = TestBed.get(AngularFirestore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be return events', done => {
    service.getEvents().subscribe(data => {
      expect(data).toEqual(expectedEvents);
      done();
    });
  });

  it('should get events', () => {
    const firebaseSpy = jest.spyOn(firebase, 'collection');
    service.getEvents().subscribe();
    expect(firebaseSpy).toHaveBeenCalledWith('/events', expect.any(Function));
  });

  it('should get data once', () => {
    const firebaseSpy = jest.spyOn(firebase, 'collection');
    service.getEvents().subscribe();
    service.getEvents().subscribe();
    service.getEvents().subscribe();
    expect(firebaseSpy).toHaveBeenCalledTimes(1);
  });

  it('rating should be multiple of 0.5', done => {
    service.getEvents().subscribe(data => {
      data.forEach(event => {
        expect(event.rating % 0.5).toBeCloseTo(0, 5);
      });
      done();
    });
  });

  it('should sort by number', done => {
    service.getEvents().subscribe(data => {
      const numbers = data.map(event => event.number);
      expect(numbers).toEqual([1, 2, 3]);
      done();
    });
  });
});
