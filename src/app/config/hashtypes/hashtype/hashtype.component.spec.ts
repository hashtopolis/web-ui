import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashtypeComponent } from './hashtype.component';

describe('HashtypeComponent', () => {
  let component: HashtypeComponent;
  let fixture: ComponentFixture<HashtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HashtypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HashtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
