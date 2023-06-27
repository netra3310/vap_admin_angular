import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHoldPurchaseComponent } from './update-hold-purchase.component';

describe('UpdateHoldPurchaseComponent', () => {
  let component: UpdateHoldPurchaseComponent;
  let fixture: ComponentFixture<UpdateHoldPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateHoldPurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateHoldPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
