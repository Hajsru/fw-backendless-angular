import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Image, ReportService, ReportHelperService } from '@it-quasar/ha-js-core';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface FrontendReport {
  image: Image | null;
  title: string;
  author: string;
  rating: number;
  link: string[];
}

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ReportsPageComponent implements OnInit {
  reports$!: Observable<FrontendReport[]>;

  constructor(
    private reportService: ReportService,
    private reportHelperService: ReportHelperService,
  ) {}

  ngOnInit() {
    this.reports$ = this.reportService.getReports().pipe(
      map(reports => {
        return reports.map(report => {
          const author$ = this.reportHelperService.getReportAuthorName(report);

          return author$.pipe(
            map(author => {
              return {
                ...report,
                author,
                title: `«${report.title}»`,
                link: [`/report/${report.$id}`],
              };
            }),
          );
        });
      }),
      switchMap(reports$ => combineLatest(reports$)),
    );
  }
}
