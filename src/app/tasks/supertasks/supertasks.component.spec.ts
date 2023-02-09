import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupertasksComponent } from './supertasks.component';

describe('SupertasksComponent', () => {
  let component: SupertasksComponent;
  let fixture: ComponentFixture<SupertasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupertasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupertasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
