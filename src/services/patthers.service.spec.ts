import { TestBed } from '@angular/core/testing';

import { PatthersService } from './patthers.service';

describe('PatthersServicesService', () => {
  let service: PatthersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatthersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
