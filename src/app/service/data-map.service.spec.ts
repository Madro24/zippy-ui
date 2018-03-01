import { TestBed, inject } from '@angular/core/testing';

import { DataMapService } from './data-map.service';

describe('DataMapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataMapService]
    });
  });

  it('should be created', inject([DataMapService], (service: DataMapService) => {
    expect(service).toBeTruthy();
  }));
});
