import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperhashlistComponent } from './superhashlist.component';

describe('SuperhashlistComponent', () => {
  let component: SuperhashlistComponent;
  let fixture: ComponentFixture<SuperhashlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperhashlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperhashlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
