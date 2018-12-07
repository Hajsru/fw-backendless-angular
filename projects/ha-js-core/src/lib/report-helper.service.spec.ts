import { TestBed } from '@angular/core/testing';

import { ReportHelperService } from './report-helper.service';

describe('ReportHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportHelperService = TestBed.get(ReportHelperService);
    expect(service).toBeTruthy();
  });
});
