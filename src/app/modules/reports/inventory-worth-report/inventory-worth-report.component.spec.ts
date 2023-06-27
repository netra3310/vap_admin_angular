import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryWorthReportComponent } from './inventory-worth-report.component';

describe('InventoryWorthReportComponent', () => {
  let component: InventoryWorthReportComponent;
  let fixture: ComponentFixture<InventoryWorthReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryWorthReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryWorthReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
