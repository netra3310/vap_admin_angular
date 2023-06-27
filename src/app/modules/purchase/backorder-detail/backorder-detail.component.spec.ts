import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackorderDetailComponent } from './backorder-detail.component';

describe('BackorderDetailComponent', () => {
  let component: BackorderDetailComponent;
  let fixture: ComponentFixture<BackorderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackorderDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackorderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
