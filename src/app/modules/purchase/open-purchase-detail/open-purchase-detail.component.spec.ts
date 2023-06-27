import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPurchaseDetailComponent } from './open-purchase-detail.component';

describe('OpenPurchaseDetailComponent', () => {
  let component: OpenPurchaseDetailComponent;
  let fixture: ComponentFixture<OpenPurchaseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenPurchaseDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenPurchaseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
