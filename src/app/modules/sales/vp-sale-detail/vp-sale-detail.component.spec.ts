import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpSaleDetailComponent } from './vp-sale-detail.component';

describe('VpSaleDetailComponent', () => {
  let component: VpSaleDetailComponent;
  let fixture: ComponentFixture<VpSaleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VpSaleDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VpSaleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
