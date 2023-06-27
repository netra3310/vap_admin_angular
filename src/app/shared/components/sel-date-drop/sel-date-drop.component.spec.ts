import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelDateDropComponent } from './sel-date-drop.component';

describe('SelDateDropComponent', () => {
  let component: SelDateDropComponent;
  let fixture: ComponentFixture<SelDateDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelDateDropComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelDateDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
