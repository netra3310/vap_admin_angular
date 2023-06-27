import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsWidgetNotificationsComponent } from './lists-widget-notifications.component';

describe('ListsWidgetNotificationsComponent', () => {
  let component: ListsWidgetNotificationsComponent;
  let fixture: ComponentFixture<ListsWidgetNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListsWidgetNotificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListsWidgetNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
