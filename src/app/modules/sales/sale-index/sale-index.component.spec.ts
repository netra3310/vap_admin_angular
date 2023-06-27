import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleIndexComponent } from './sale-index.component';

describe('SaleIndexComponent', () => {
  let component: SaleIndexComponent;
  let fixture: ComponentFixture<SaleIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
