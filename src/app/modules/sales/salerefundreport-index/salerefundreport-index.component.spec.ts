import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalerefundreportIndexComponent } from './salerefundreport-index.component';

describe('SalerefundreportIndexComponent', () => {
  let component: SalerefundreportIndexComponent;
  let fixture: ComponentFixture<SalerefundreportIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalerefundreportIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalerefundreportIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
