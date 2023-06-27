import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseDetailCustomizedComponent } from './purchase-detail-customized.component';

describe('PurchaseDetailCustomizedComponent', () => {
  let component: PurchaseDetailCustomizedComponent;
  let fixture: ComponentFixture<PurchaseDetailCustomizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseDetailCustomizedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseDetailCustomizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
