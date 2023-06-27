import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpencartComponent } from './opencart.component';

describe('OpencartComponent', () => {
  let component: OpencartComponent;
  let fixture: ComponentFixture<OpencartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpencartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpencartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
