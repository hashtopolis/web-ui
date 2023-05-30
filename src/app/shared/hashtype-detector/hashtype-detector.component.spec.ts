import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashtypeDetectorComponent } from './hashtype-detector.component';

describe('HashtypeDetectorComponent', () => {
  let component: HashtypeDetectorComponent;
  let fixture: ComponentFixture<HashtypeDetectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HashtypeDetectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HashtypeDetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
