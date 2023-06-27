import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAutoCompleteComponent } from './custom-auto-complete.component';

describe('CustomAutoCompleteComponent', () => {
  let component: CustomAutoCompleteComponent;
  let fixture: ComponentFixture<CustomAutoCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomAutoCompleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
