import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsGenericTableComponent } from './ss-generic-table.component';

describe('SsGenericTableComponent', () => {
  let component: SsGenericTableComponent;
  let fixture: ComponentFixture<SsGenericTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SsGenericTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SsGenericTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
