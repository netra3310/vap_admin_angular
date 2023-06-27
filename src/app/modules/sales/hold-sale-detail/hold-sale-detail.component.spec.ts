import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldSaleDetailComponent } from './hold-sale-detail.component';

describe('HoldSaleDetailComponent', () => {
  let component: HoldSaleDetailComponent;
  let fixture: ComponentFixture<HoldSaleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoldSaleDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoldSaleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
