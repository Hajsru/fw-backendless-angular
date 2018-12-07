import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Image, ReportHelperService, ReportService } from '@it-quasar/ha-js-core';
import { map, switchMap } from 'rxjs/operators';

interface FrontendReport {
  image: Image | null;
  title: string;
  rating: number;
  author: string;
  comments: any[];
}

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ReportPageComponent implements OnInit {
  report$!: Observable<FrontendReport>;

  constructor(
    private router: ActivatedRoute,
    private reportService: ReportService,
    private reportHelperService: ReportHelperService,
  ) {}

  ngOnInit() {
    this.report$ = this.router.params.pipe(
      map(params => params['id']),
      switchMap(id => this.reportService.getReport(id)),
      map(report => {
        if (!report) {
          throw new Error('Not found report');
        }

        return report;
      }),
      switchMap(report => {
        const author$ = this.reportHelperService.getReportAuthorName(report);

        return author$.pipe(
          map(author => {
            return {
              ...report,
              author,
              title: `«${report.title}»`,
              link: [`/report/${report.$id}`],
              comments: [],
            };
          }),
        );
      }),
    );
  }
}
