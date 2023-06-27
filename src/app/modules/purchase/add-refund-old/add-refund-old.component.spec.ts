import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRefundOldComponent } from './add-refund-old.component';

describe('AddRefundOldComponent', () => {
  let component: AddRefundOldComponent;
  let fixture: ComponentFixture<AddRefundOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRefundOldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRefundOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
