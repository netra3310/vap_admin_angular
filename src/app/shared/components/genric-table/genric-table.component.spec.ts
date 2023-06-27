import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenricTableComponent } from './genric-table.component';

describe('GenricTableComponent', () => {
  let component: GenricTableComponent;
  let fixture: ComponentFixture<GenricTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenricTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenricTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
