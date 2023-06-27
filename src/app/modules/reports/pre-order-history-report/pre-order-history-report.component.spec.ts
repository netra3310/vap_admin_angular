import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreOrderHistoryReportComponent } from './pre-order-history-report.component';

describe('PreOrderHistoryReportComponent', () => {
  let component: PreOrderHistoryReportComponent;
  let fixture: ComponentFixture<PreOrderHistoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreOrderHistoryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreOrderHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
