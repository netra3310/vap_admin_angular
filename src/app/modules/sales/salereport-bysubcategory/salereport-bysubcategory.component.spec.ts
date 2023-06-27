import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalereportBysubcategoryComponent } from './salereport-bysubcategory.component';

describe('SalereportBysubcategoryComponent', () => {
  let component: SalereportBysubcategoryComponent;
  let fixture: ComponentFixture<SalereportBysubcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalereportBysubcategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalereportBysubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
