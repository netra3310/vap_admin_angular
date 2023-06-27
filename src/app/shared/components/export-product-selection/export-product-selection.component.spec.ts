import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportProductSelectionComponent } from './export-product-selection.component';

describe('ExportProductSelectionComponent', () => {
  let component: ExportProductSelectionComponent;
  let fixture: ComponentFixture<ExportProductSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportProductSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportProductSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
