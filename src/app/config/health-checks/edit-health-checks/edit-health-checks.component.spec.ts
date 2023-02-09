import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHealthChecksComponent } from './edit-health-checks.component';

describe('EditHealthChecksComponent', () => {
  let component: EditHealthChecksComponent;
  let fixture: ComponentFixture<EditHealthChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditHealthChecksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHealthChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
