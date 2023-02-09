import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSuperhashlistComponent } from './new-superhashlist.component';

describe('NewSuperhashlistComponent', () => {
  let component: NewSuperhashlistComponent;
  let fixture: ComponentFixture<NewSuperhashlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSuperhashlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSuperhashlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
