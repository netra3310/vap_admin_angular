import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelColDropComponent } from './sel-col-drop.component';

describe('SelColDropComponent', () => {
  let component: SelColDropComponent;
  let fixture: ComponentFixture<SelColDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelColDropComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelColDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
