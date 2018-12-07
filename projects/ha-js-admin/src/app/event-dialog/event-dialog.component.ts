import { ChangeDetectionStrategy, Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface EventDialogInputData {
  number: number;
  title: string;
  location: string;
}

export type EventDialogOutputData = EventDialogInputData;

@Component({
  selector: 'admin-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDialogComponent implements OnInit {
  form = this.fb.group({
    number: this.fb.control(0),
    title: this.fb.control(''),
    location: this.fb.control(''),
  });

  hasData = true;

  constructor(
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: EventDialogInputData | undefined,
    private dialogRef: MatDialogRef<EventDialogComponent, EventDialogOutputData>,
  ) {
    if (data) {
      this.form.setValue(data);
    }

    this.hasData = !!data;
  }

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }

  change() {
    const value = this.form.value;
    this.dialogRef.close(value);
  }
}
