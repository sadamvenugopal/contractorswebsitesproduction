import { TestBed } from '@angular/core/testing';

import { FinalFormService } from './final-form.service';

describe('FinalFormService', () => {
  let service: FinalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinalFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
