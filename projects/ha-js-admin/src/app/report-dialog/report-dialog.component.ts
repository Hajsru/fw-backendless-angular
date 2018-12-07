import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Image } from '@it-quasar/ha-js-core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface ReportDialogInputData {
  report?: {
    title: string;
    video: string;
    image: Image | null;
    authorId: string | null;
    eventId: string | null;
  };

  allAuthors: {
    id: string;
    name: string;
  }[];

  allEvents: {
    id: string;
    title: string;
  }[];
}

export interface ReportDialogOutputData {
  title: string;
  video: string;
  newImage?: File;
  authorId: string | null;
  eventId: string | null;
}

@Component({
  selector: 'admin-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportDialogComponent implements OnInit {
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  form = this.fb.group({
    title: this.fb.control(''),
    video: this.fb.control(''),
    authorId: this.fb.control(null),
    eventId: this.fb.control(null),
  });

  hasData = true;
  image!: Image | { src: SafeResourceUrl } | null;
  oldImage!: Image | null;
  newImage?: File;
  allAuthors: {
    id: string;
    name: string;
  }[];
  allEvents: {
    id: string;
    title: string;
  }[];

  constructor(
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ReportDialogInputData,
    private dialogRef: MatDialogRef<ReportDialogComponent, ReportDialogOutputData>,
    private sanitizer: DomSanitizer,
  ) {
    if (data.report) {
      this.form.setValue({
        title: data.report.title || '',
        video: data.report.video || '',
        authorId: data.report.authorId || null,
        eventId: data.report.eventId || null,
      });
      this.oldImage = data.report.image;
      this.image = data.report.image;
    }

    this.hasData = !!data.report;
    this.allAuthors = data.allAuthors;
    this.allEvents = data.allEvents;
  }

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }

  change() {
    const value = this.form.value;
    this.dialogRef.close({ ...value, newImage: this.newImage });
  }

  selectImage() {
    const event = new MouseEvent('click', { bubbles: false });
    if (!this.imageInput.nativeElement) {
      throw new Error('Not found #imageInput');
    }

    this.imageInput.nativeElement.dispatchEvent(event);
  }

  setImage(event: Event) {
    if (!event.target || !(event.target instanceof HTMLInputElement)) {
      throw new Error('Target is no HTMLInputElement');
    }

    const file = event.target.files ? event.target.files[0] : null;
    if (!file) {
      this.image = this.oldImage;
      this.newImage = undefined;
    } else {
      this.image = {
        src: this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file)),
      };
      this.newImage = file;
    }
  }
}
