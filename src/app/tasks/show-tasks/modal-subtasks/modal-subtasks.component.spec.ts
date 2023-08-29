import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSubtasksComponent } from './modal-subtasks.component';

describe('ModalSubtasksComponent', () => {
  let component: ModalSubtasksComponent;
  let fixture: ComponentFixture<ModalSubtasksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSubtasksComponent]
    });
    fixture = TestBed.createComponent(ModalSubtasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
