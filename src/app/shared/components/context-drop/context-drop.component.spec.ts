import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextDropComponent } from './context-drop.component';

describe('ContextDropComponent', () => {
  let component: ContextDropComponent;
  let fixture: ComponentFixture<ContextDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContextDropComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContextDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
