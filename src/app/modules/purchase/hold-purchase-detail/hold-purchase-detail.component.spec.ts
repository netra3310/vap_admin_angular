import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldPurchaseDetailComponent } from './hold-purchase-detail.component';

describe('HoldPurchaseDetailComponent', () => {
  let component: HoldPurchaseDetailComponent;
  let fixture: ComponentFixture<HoldPurchaseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoldPurchaseDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoldPurchaseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
