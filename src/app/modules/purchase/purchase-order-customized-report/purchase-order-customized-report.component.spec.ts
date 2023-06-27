import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderCustomizedReportComponent } from './purchase-order-customized-report.component';

describe('PurchaseOrderCustomizedReportComponent', () => {
  let component: PurchaseOrderCustomizedReportComponent;
  let fixture: ComponentFixture<PurchaseOrderCustomizedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderCustomizedReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderCustomizedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
