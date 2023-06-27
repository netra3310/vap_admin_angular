import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTimeCounterComponent } from './session-time-counter.component';

describe('SessionTimeCounterComponent', () => {
  let component: SessionTimeCounterComponent;
  let fixture: ComponentFixture<SessionTimeCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionTimeCounterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionTimeCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
