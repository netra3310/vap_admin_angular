import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalereportByproductComponent } from './salereport-byproduct.component';

describe('SalereportByproductComponent', () => {
  let component: SalereportByproductComponent;
  let fixture: ComponentFixture<SalereportByproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalereportByproductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalereportByproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
