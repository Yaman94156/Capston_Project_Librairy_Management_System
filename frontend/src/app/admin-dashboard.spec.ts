import { TestBed } from '@angular/core/testing';

import { AdminDashboardService } from './admin-dashboard';

describe('AdminDashboard', () => {
  let service: AdminDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
