import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelDateBtnComponent } from './sel-date-btn.component';

describe('SelDateBtnComponent', () => {
  let component: SelDateBtnComponent;
  let fixture: ComponentFixture<SelDateBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelDateBtnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelDateBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
