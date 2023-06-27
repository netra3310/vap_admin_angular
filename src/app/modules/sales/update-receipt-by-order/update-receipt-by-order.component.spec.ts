import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateReceiptByOrderComponent } from './update-receipt-by-order.component';

describe('UpdateReceiptByOrderComponent', () => {
  let component: UpdateReceiptByOrderComponent;
  let fixture: ComponentFixture<UpdateReceiptByOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateReceiptByOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateReceiptByOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
