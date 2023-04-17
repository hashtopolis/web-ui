import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexconvertorComponent } from './hexconvertor.component';

describe('HexconvertorComponent', () => {
  let component: HexconvertorComponent;
  let fixture: ComponentFixture<HexconvertorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HexconvertorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HexconvertorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
