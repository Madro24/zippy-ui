import { TestBed, inject } from '@angular/core/testing';

import { GmapService } from './gmap-service.service';

describe('GmapServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GmapService]
    });
  });

  it('should be created', inject([GmapService], (service: GmapService) => {
    expect(service).toBeTruthy();
  }));
});
