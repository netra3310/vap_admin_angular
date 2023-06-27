import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDropdownOptionComponent } from './custom-dropdown-option.component';

describe('CustomDropdownOptionComponent', () => {
  let component: CustomDropdownOptionComponent;
  let fixture: ComponentFixture<CustomDropdownOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomDropdownOptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomDropdownOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
