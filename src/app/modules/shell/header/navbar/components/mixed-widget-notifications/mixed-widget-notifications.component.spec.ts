import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixedWidgetNotificationsComponent } from './mixed-widget-notifications.component';

describe('MixedWidgetNotificationsComponent', () => {
  let component: MixedWidgetNotificationsComponent;
  let fixture: ComponentFixture<MixedWidgetNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MixedWidgetNotificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MixedWidgetNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
