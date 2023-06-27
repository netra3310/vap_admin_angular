import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashInOutComponent } from './cash-in-out.component';

describe('CashInOutComponent', () => {
  let component: CashInOutComponent;
  let fixture: ComponentFixture<CashInOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashInOutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashInOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
