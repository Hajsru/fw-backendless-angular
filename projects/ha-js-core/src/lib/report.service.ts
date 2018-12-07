import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { catchError, filter, map, mapTo, publishReplay, switchMap, take } from 'rxjs/operators';
import { Image } from './image';
import { AngularFireStorage } from '@angular/fire/storage';
import { generate as generageId } from 'shortid';

export interface ReportData {
  readonly title: string;
  readonly rating: number;
  readonly voteCount: number;
  readonly author: DocumentReference | null;
  readonly event: DocumentReference | null;
  readonly image: Image | null;
}

export interface Report extends ReportData {
  readonly $id: string;
}

export type Reports = Readonly<Report[]>;

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private reports$!: Observable<Reports>;

  constructor(private firesotre: AngularFirestore, private storage: AngularFireStorage) {}

  getReports(): Observable<Reports> {
    if (!this.reports$) {
      this.reports$ = this.firesotre
        .collection<ReportData>('/reports')
        .snapshotChanges()
        .pipe(
          map(snapshot => {
            return snapshot.map(value => {
              const report = value.payload.doc.data();
              const $id = value.payload.doc.id;

              return { ...report, $id };
            });
          }),
          publishReplay(1),
        );
      (this.reports$ as any).connect();
    }

    return this.reports$;
  }

  getReport(reportId: string): Observable<Report | undefined> {
    return this.firesotre
      .doc<ReportData>(`/reports/${reportId}`)
      .valueChanges()
      .pipe(
        map(report => {
          if (!report) {
            return undefined;
          }

          return { ...report, $id: reportId };
        }),
      );
  }

  createReport(value: ReportData): Observable<string> {
    return from(this.firesotre.collection<ReportData>(`/reports`).add(value)).pipe(
      map(ref => ref.id),
    );
  }

  updateReport(reportId: string, value: Partial<ReportData>): Observable<void> {
    return from(this.firesotre.doc<ReportData>(`/reports/${reportId}`).update(value)).pipe(
      mapTo(undefined),
    );
  }

  removeReport(reportId: string): Observable<void> {
    return from(this.firesotre.doc<ReportData>(`/reports/${reportId}`).delete()).pipe(
      mapTo(undefined),
    );
  }

  setImage(reportId: string, image: File): Observable<void> {
    return this.getReport(reportId).pipe(
      take(1),
      // Удалим старую фотку
      switchMap(report => {
        if (!report) {
          throw new Error(`Report with id=${reportId} not exist`);
        }

        if (report.image) {
          const fileRef = this.storage.ref(report.image.ref);
          return fileRef.delete().pipe(catchError(() => of(undefined)));
        }

        return of(undefined);
      }),
      switchMap(() => {
        const nameExt = image.name.split('.').pop();
        if (!nameExt) {
          throw new Error('Not valid file extension.');
        }

        const ext = nameExt.toLowerCase();
        const filePath = `/reports/${generageId()}.${ext}`;
        const fileRef = this.storage.ref(filePath);
        return fileRef
          .put(image)
          .percentageChanges()
          .pipe(
            filter(percent => percent !== undefined && percent >= 100),
            switchMap(() => {
              return fileRef.updateMetatdata({
                cacheControl: 'public,max-age=31536000',
              });
            }),
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
      switchMap((newImage: Image) => {
        return this.updateReport(reportId, { image: newImage });
      }),
    );
  }
}
