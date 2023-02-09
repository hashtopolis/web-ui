import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCracksComponent } from './show-cracks.component';

describe('ShowCracksComponent', () => {
  let component: ShowCracksComponent;
  let fixture: ComponentFixture<ShowCracksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowCracksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowCracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
