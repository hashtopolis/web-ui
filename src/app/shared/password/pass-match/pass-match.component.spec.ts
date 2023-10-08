import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassMatchComponent } from './pass-match.component';

describe('PassMatchComponent', () => {
  let component: PassMatchComponent;
  let fixture: ComponentFixture<PassMatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PassMatchComponent]
    });
    fixture = TestBed.createComponent(PassMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
