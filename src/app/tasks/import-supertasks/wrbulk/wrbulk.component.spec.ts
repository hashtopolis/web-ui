import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrbulkComponent } from './wrbulk.component';

describe('WrbulkComponent', () => {
  let component: WrbulkComponent;
  let fixture: ComponentFixture<WrbulkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WrbulkComponent]
    });
    fixture = TestBed.createComponent(WrbulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
