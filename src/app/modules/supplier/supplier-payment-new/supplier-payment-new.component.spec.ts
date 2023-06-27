import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPaymentNewComponent } from './supplier-payment-new.component';

describe('SupplierPaymentNewComponent', () => {
  let component: SupplierPaymentNewComponent;
  let fixture: ComponentFixture<SupplierPaymentNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPaymentNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierPaymentNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
