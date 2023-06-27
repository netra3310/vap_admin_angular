import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleStatsDetailComponent } from './sale-stats-detail.component';

describe('SaleStatsDetailComponent', () => {
  let component: SaleStatsDetailComponent;
  let fixture: ComponentFixture<SaleStatsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleStatsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleStatsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
