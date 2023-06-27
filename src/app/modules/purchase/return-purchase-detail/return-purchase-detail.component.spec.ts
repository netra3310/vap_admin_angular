import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnPurchaseDetailComponent } from './return-purchase-detail.component';

describe('ReturnPurchaseDetailComponent', () => {
  let component: ReturnPurchaseDetailComponent;
  let fixture: ComponentFixture<ReturnPurchaseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnPurchaseDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnPurchaseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
