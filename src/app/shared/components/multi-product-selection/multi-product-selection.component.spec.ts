import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiProductSelectionComponent } from './multi-product-selection.component';

describe('MultiProductSelectionComponent', () => {
  let component: MultiProductSelectionComponent;
  let fixture: ComponentFixture<MultiProductSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiProductSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiProductSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
