import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierLifeLineReportComponent } from './supplier-life-line-report.component';

describe('SupplierLifeLineReportComponent', () => {
  let component: SupplierLifeLineReportComponent;
  let fixture: ComponentFixture<SupplierLifeLineReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierLifeLineReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierLifeLineReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
