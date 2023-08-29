import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPretasksComponent } from './modal-pretasks.component';

describe('ModalPretasksComponent', () => {
  let component: ModalPretasksComponent;
  let fixture: ComponentFixture<ModalPretasksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPretasksComponent]
    });
    fixture = TestBed.createComponent(ModalPretasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
