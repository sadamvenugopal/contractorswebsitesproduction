import { TestBed } from '@angular/core/testing';

import { MockupService } from './mockup.service';

describe('MockupService', () => {
  let service: MockupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
