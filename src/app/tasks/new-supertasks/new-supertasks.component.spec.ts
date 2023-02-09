import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSupertasksComponent } from './new-supertasks.component';

describe('NewSupertasksComponent', () => {
  let component: NewSupertasksComponent;
  let fixture: ComponentFixture<NewSupertasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSupertasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSupertasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
