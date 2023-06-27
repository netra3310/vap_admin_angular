import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateReceiptNewComponent } from './update-receipt-new.component';

describe('UpdateReceiptNewComponent', () => {
  let component: UpdateReceiptNewComponent;
  let fixture: ComponentFixture<UpdateReceiptNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateReceiptNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateReceiptNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
