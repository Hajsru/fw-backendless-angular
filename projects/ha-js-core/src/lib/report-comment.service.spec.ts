import { TestBed } from '@angular/core/testing';

import { ReportCommentService } from './report-comment.service';

describe('ReportCommentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportCommentService = TestBed.get(ReportCommentService);
    expect(service).toBeTruthy();
  });
});
