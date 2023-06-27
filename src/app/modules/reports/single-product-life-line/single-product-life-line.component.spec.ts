import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProductLifeLineComponent } from './single-product-life-line.component';

describe('SingleProductLifeLineComponent', () => {
  let component: SingleProductLifeLineComponent;
  let fixture: ComponentFixture<SingleProductLifeLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleProductLifeLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleProductLifeLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
