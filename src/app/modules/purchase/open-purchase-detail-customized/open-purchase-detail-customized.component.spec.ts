import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPurchaseDetailCustomizedComponent } from './open-purchase-detail-customized.component';

describe('OpenPurchaseDetailCustomizedComponent', () => {
  let component: OpenPurchaseDetailCustomizedComponent;
  let fixture: ComponentFixture<OpenPurchaseDetailCustomizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenPurchaseDetailCustomizedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenPurchaseDetailCustomizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
