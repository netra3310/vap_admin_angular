import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderWidget2Component } from './slider-widget2.component';

describe('SliderWidget2Component', () => {
  let component: SliderWidget2Component;
  let fixture: ComponentFixture<SliderWidget2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderWidget2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderWidget2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
