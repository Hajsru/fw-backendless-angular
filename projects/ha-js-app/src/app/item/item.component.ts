import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

enum ImageType {
  Img = 'img',
  Cover = 'cover',
}

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent implements OnInit {
  @Input() routerLink!: string;
  @Input() image?: string | null;
  @Input() imageType: ImageType = ImageType.Img;
  @Input() number?: string | null;
  @Input() title!: string;
  @Input() description!: string;
  @Input() rating!: string;

  constructor() {}

  ngOnInit() {}
}
