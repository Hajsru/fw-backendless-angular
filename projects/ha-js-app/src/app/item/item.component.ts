import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent implements OnInit {
  @Input() routerLink;
  @Input() image;
  @Input() number;
  @Input() title;
  @Input() description;
  @Input() rating;

  constructor() {}

  ngOnInit() {}
}
