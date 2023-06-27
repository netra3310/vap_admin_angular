import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleStatsComponent } from './sale-stats.component';

describe('SaleStatsComponent', () => {
  let component: SaleStatsComponent;
  let fixture: ComponentFixture<SaleStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
