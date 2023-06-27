import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierOpenInvoicesComponent } from './supplier-open-invoices.component';

describe('SupplierOpenInvoicesComponent', () => {
  let component: SupplierOpenInvoicesComponent;
  let fixture: ComponentFixture<SupplierOpenInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierOpenInvoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierOpenInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
