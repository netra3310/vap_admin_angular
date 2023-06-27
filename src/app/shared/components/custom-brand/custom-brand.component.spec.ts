import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomBrandComponent } from './custom-brand.component';

describe('CustomBrandComponent', () => {
  let component: CustomBrandComponent;
  let fixture: ComponentFixture<CustomBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomBrandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
