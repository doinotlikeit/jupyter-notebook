import { TestBed } from '@angular/core/testing';

import { HubManagementService } from './hub-management.service';

describe('HubServiceService', () => {
  let service: HubManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HubManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
