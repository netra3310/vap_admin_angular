import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonPrintedInvoicesWithPricesReportComponent } from './non-printed-invoices-with-prices-report.component';

describe('NonPrintedInvoicesWithPricesReportComponent', () => {
  let component: NonPrintedInvoicesWithPricesReportComponent;
  let fixture: ComponentFixture<NonPrintedInvoicesWithPricesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonPrintedInvoicesWithPricesReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonPrintedInvoicesWithPricesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
