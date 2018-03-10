import { TestBed, inject } from '@angular/core/testing';

import { DataAvailabilityMapService } from './data-availability-map.service';

describe('DataAvailabilityMapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataAvailabilityMapService]
    });
  });

  it('should be created', inject([DataAvailabilityMapService], (service: DataAvailabilityMapService) => {
    expect(service).toBeTruthy();
  }));
});
