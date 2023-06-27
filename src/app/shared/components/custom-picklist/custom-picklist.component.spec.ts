import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPicklistComponent } from './custom-picklist.component';

describe('CustomPicklistComponent', () => {
  let component: CustomPicklistComponent;
  let fixture: ComponentFixture<CustomPicklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomPicklistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomPicklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
