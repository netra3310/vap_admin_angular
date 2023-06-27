import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDashboardReportComponent } from './customer-dashboard-report.component';

describe('CustomerDashboardReportComponent', () => {
  let component: CustomerDashboardReportComponent;
  let fixture: ComponentFixture<CustomerDashboardReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerDashboardReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDashboardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
