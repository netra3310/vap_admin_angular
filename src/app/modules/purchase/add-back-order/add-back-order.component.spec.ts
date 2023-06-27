import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBackOrderComponent } from './add-back-order.component';

describe('AddBackOrderComponent', () => {
  let component: AddBackOrderComponent;
  let fixture: ComponentFixture<AddBackOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBackOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBackOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
