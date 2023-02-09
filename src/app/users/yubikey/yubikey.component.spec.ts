import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YubikeyComponent } from './yubikey.component';

describe('YubikeyComponent', () => {
  let component: YubikeyComponent;
  let fixture: ComponentFixture<YubikeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YubikeyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YubikeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
