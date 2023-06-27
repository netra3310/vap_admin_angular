import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformainvoiceIndexComponent } from './performainvoice-index.component';

describe('PerformainvoiceIndexComponent', () => {
  let component: PerformainvoiceIndexComponent;
  let fixture: ComponentFixture<PerformainvoiceIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformainvoiceIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformainvoiceIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
