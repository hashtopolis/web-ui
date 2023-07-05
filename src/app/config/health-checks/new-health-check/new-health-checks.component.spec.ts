import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHealthChecksComponent } from './new-health-checks.component';

describe('NewHealthChecksComponent', () => {
  let component: NewHealthChecksComponent;
  let fixture: ComponentFixture<NewHealthChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewHealthChecksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewHealthChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
