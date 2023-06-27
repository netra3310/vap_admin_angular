import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomImageListComponent } from './custom-image-list.component';

describe('CustomImageListComponent', () => {
  let component: CustomImageListComponent;
  let fixture: ComponentFixture<CustomImageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomImageListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomImageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
