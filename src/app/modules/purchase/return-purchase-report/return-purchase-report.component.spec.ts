import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnPurchaseReportComponent } from './return-purchase-report.component';

describe('ReturnPurchaseReportComponent', () => {
  let component: ReturnPurchaseReportComponent;
  let fixture: ComponentFixture<ReturnPurchaseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnPurchaseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnPurchaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
