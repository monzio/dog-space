import { TestBed } from '@angular/core/testing';

import { AreaCaniDataService } from './area-cani-data.service';

describe('AreaCaniDataService', () => {
  let service: AreaCaniDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreaCaniDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
