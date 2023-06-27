import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenpurchasereportIndexComponent } from './openpurchasereport-index.component';

describe('OpenpurchasereportIndexComponent', () => {
  let component: OpenpurchasereportIndexComponent;
  let fixture: ComponentFixture<OpenpurchasereportIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenpurchasereportIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenpurchasereportIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
