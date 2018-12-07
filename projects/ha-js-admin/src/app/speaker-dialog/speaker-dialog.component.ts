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

export interface SpeakerDialogInputData {
  name: string;
  work: string;
  photo: Image | null;
}

export interface SpeakerDialogOutputData {
  name: string;
  work: string;
  newPhoto?: File;
}

@Component({
  selector: 'admin-speaker-dialog',
  templateUrl: './speaker-dialog.component.html',
  styleUrls: ['./speaker-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeakerDialogComponent implements OnInit {
  @ViewChild('photoInput') photoInput!: ElementRef<HTMLInputElement>;

  form = this.fb.group({
    name: this.fb.control(''),
    work: this.fb.control(''),
  });

  hasData = true;
  photo!: Image | { src: SafeResourceUrl } | null;
  oldPhoto!: Image | null;
  newPhoto?: File;

  constructor(
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: SpeakerDialogInputData | undefined,
    private dialogRef: MatDialogRef<SpeakerDialogComponent, SpeakerDialogOutputData>,
    private sanitizer: DomSanitizer,
  ) {
    if (data) {
      this.form.setValue({
        name: data.name,
        work: data.work,
      });
      this.oldPhoto = data.photo;
      this.photo = data.photo;
    }

    this.hasData = !!data;
  }

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }

  change() {
    const value = this.form.value;
    this.dialogRef.close({ ...value, newPhoto: this.newPhoto });
  }

  selectPhoto() {
    const event = new MouseEvent('click', { bubbles: false });
    if (!this.photoInput.nativeElement) {
      throw new Error('Not found #photoInput');
    }

    this.photoInput.nativeElement.dispatchEvent(event);
  }

  setPhoto(event: Event) {
    if (!event.target || !(event.target instanceof HTMLInputElement)) {
      throw new Error('Target is no HTMLInputElement');
    }

    const file = event.target.files ? event.target.files[0] : null;
    if (!file) {
      this.photo = this.oldPhoto;
      this.newPhoto = undefined;
    } else {
      this.photo = {
        src: this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file)),
      };
      this.newPhoto = file;
    }
  }
}
