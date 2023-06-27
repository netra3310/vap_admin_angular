import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldpurchasereportIndexComponent } from './holdpurchasereport-index.component';

describe('HoldpurchasereportIndexComponent', () => {
  let component: HoldpurchasereportIndexComponent;
  let fixture: ComponentFixture<HoldpurchasereportIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoldpurchasereportIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoldpurchasereportIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
