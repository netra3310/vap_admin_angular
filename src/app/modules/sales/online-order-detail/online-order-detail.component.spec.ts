import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineOrderDetailComponent } from './online-order-detail.component';

describe('OnlineOrderDetailComponent', () => {
  let component: OnlineOrderDetailComponent;
  let fixture: ComponentFixture<OnlineOrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineOrderDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
