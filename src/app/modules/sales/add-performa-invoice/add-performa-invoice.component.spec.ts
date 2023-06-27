import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPerformaInvoiceComponent } from './add-performa-invoice.component';

describe('AddPerformaInvoiceComponent', () => {
  let component: AddPerformaInvoiceComponent;
  let fixture: ComponentFixture<AddPerformaInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPerformaInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPerformaInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
