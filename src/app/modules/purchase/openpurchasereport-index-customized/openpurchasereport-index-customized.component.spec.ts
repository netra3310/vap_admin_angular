import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenpurchasereportIndexCustomizedComponent } from './openpurchasereport-index-customized.component';

describe('OpenpurchasereportIndexCustomizedComponent', () => {
  let component: OpenpurchasereportIndexCustomizedComponent;
  let fixture: ComponentFixture<OpenpurchasereportIndexCustomizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenpurchasereportIndexCustomizedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenpurchasereportIndexCustomizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
