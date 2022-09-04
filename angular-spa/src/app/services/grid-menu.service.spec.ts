import { TestBed } from '@angular/core/testing';

import { GridMenuService } from './grid-menu.service';

describe('GridMenuService', () => {
  let service: GridMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
