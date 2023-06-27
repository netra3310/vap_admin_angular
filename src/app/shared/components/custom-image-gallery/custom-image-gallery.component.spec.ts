import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomImageGalleryComponent } from './custom-image-gallery.component';

describe('CustomImageGalleryComponent', () => {
  let component: CustomImageGalleryComponent;
  let fixture: ComponentFixture<CustomImageGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomImageGalleryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomImageGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
