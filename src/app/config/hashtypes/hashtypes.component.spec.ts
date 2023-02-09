import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashtypesComponent } from './hashtypes.component';

describe('HashtypesComponent', () => {
  let component: HashtypesComponent;
  let fixture: ComponentFixture<HashtypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HashtypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HashtypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
