import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonPrintedInvoicesReportComponent } from './non-printed-invoices-report.component';

describe('NonPrintedInvoicesReportComponent', () => {
  let component: NonPrintedInvoicesReportComponent;
  let fixture: ComponentFixture<NonPrintedInvoicesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonPrintedInvoicesReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonPrintedInvoicesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
