import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpensalereportIndexComponent } from './opensalereport-index.component';

describe('OpensalereportIndexComponent', () => {
  let component: OpensalereportIndexComponent;
  let fixture: ComponentFixture<OpensalereportIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpensalereportIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpensalereportIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
