import { TestBed, inject } from '@angular/core/testing';

import { QcdataService } from './qcdata.service';

describe('QcdataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QcdataService]
    });
  });

  it('should be created', inject([QcdataService], (service: QcdataService) => {
    expect(service).toBeTruthy();
  }));
});
