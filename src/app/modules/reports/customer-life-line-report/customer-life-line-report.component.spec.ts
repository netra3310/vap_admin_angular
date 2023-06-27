import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLifeLineReportComponent } from './customer-life-line-report.component';

describe('CustomerLifeLineReportComponent', () => {
  let component: CustomerLifeLineReportComponent;
  let fixture: ComponentFixture<CustomerLifeLineReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerLifeLineReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerLifeLineReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
