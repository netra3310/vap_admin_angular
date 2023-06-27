import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearDropdownComponent } from './year-dropdown.component';

describe('YearDropdownComponent', () => {
  let component: YearDropdownComponent;
  let fixture: ComponentFixture<YearDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
