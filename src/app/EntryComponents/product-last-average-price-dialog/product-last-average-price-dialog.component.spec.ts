import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLastAveragePriceDialogComponent } from './product-last-average-price-dialog.component';

describe('ProductLastAveragePriceDialogComponent', () => {
  let component: ProductLastAveragePriceDialogComponent;
  let fixture: ComponentFixture<ProductLastAveragePriceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductLastAveragePriceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductLastAveragePriceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
