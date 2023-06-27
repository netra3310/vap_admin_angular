import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPreOrderComponent } from './add-pre-order.component';

describe('AddPreOrderComponent', () => {
  let component: AddPreOrderComponent;
  let fixture: ComponentFixture<AddPreOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPreOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPreOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
