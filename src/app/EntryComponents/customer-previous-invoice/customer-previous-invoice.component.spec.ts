import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPreviousInvoiceComponent } from './customer-previous-invoice.component';

describe('CustomerPreviousInvoiceComponent', () => {
  let component: CustomerPreviousInvoiceComponent;
  let fixture: ComponentFixture<CustomerPreviousInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerPreviousInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerPreviousInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
