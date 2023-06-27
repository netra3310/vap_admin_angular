import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackOrderReportComponent } from './back-order-report.component';

describe('BackOrderReportComponent', () => {
  let component: BackOrderReportComponent;
  let fixture: ComponentFixture<BackOrderReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackOrderReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackOrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
