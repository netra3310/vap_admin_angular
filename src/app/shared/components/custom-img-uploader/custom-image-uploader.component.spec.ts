import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomImageUploaderComponent } from './custom-image-uploader.component';

describe('CustomImageUploaderComponent', () => {
  let component: CustomImageUploaderComponent;
  let fixture: ComponentFixture<CustomImageUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomImageUploaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomImageUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
