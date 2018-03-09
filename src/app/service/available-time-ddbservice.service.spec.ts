import { TestBed, inject } from '@angular/core/testing';

import { AvailableTimeDdbserviceService } from './available-time-ddbservice.service';

describe('AvailableTimeDdbserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AvailableTimeDdbserviceService]
    });
  });

  it('should be created', inject([AvailableTimeDdbserviceService], (service: AvailableTimeDdbserviceService) => {
    expect(service).toBeTruthy();
  }));
});
