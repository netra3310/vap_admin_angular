import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalereportByuserComponent } from './salereport-byuser.component';

describe('SalereportByuserComponent', () => {
  let component: SalereportByuserComponent;
  let fixture: ComponentFixture<SalereportByuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalereportByuserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalereportByuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
