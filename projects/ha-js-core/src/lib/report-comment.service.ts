import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Comment, CommentData } from './comment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReportCommentService {
  constructor(private firesotre: AngularFirestore) {}

  getComments(reportId: string): Observable<Comment[]> {
    return this.firesotre
      .collection<CommentData>(`/reports/${reportId}/comments`)
      .snapshotChanges()
      .pipe(
        map(snapshot => {
          return snapshot.map(value => {
            const comment = value.payload.doc.data();
            const $id = value.payload.doc.id;

            return { ...comment, $id };
          });
        }),
      );
  }
}
