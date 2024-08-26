import { TestBed } from '@angular/core/testing';

import { IgxFilterService } from './igx-filter.service';

describe('IgxFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IgxFilterService = TestBed.get(IgxFilterService);
    expect(service).toBeTruthy();
  });
});
