import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSaleDetailComponent } from './update-sale-detail.component';

describe('UpdateSaleDetailComponent', () => {
  let component: UpdateSaleDetailComponent;
  let fixture: ComponentFixture<UpdateSaleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSaleDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSaleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
