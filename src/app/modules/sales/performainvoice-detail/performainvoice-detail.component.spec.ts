import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformainvoiceDetailComponent } from './performainvoice-detail.component';

describe('PerformainvoiceDetailComponent', () => {
  let component: PerformainvoiceDetailComponent;
  let fixture: ComponentFixture<PerformainvoiceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformainvoiceDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformainvoiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
