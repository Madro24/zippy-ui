import { TestBed, inject } from '@angular/core/testing';

import { CommonUtilService } from './common-util.service';

describe('CommonUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonUtilService]
    });
  });

  it('should be created', inject([CommonUtilService], (service: CommonUtilService) => {
    expect(service).toBeTruthy();
  }));
});
