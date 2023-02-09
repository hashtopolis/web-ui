import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrackersComponent } from './crackers.component';

describe('CrackersComponent', () => {
  let component: CrackersComponent;
  let fixture: ComponentFixture<CrackersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrackersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrackersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
