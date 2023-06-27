import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSaleRefundComponent } from './add-sale-refund.component';

describe('AddSaleRefundComponent', () => {
  let component: AddSaleRefundComponent;
  let fixture: ComponentFixture<AddSaleRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSaleRefundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSaleRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
