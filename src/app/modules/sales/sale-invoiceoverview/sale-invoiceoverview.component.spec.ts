import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleInvoiceoverviewComponent } from './sale-invoiceoverview.component';

describe('SaleInvoiceoverviewComponent', () => {
  let component: SaleInvoiceoverviewComponent;
  let fixture: ComponentFixture<SaleInvoiceoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleInvoiceoverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleInvoiceoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
