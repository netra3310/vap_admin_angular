import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundsaleDetailComponent } from './refundsale-detail.component';

describe('RefundsaleDetailComponent', () => {
  let component: RefundsaleDetailComponent;
  let fixture: ComponentFixture<RefundsaleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundsaleDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundsaleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
