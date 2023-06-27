import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityListWidgetComponent } from './activity-list-widget.component';

describe('ActivityListWidgetComponent', () => {
  let component: ActivityListWidgetComponent;
  let fixture: ComponentFixture<ActivityListWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityListWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityListWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
