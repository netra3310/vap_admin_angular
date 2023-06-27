import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddwishlistDialogComponent } from './addwishlist-dialog.component';

describe('AddwishlistDialogComponent', () => {
  let component: AddwishlistDialogComponent;
  let fixture: ComponentFixture<AddwishlistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddwishlistDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddwishlistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
