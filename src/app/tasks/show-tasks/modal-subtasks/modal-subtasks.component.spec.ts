import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ModalSubtasksComponent } from '@src/app/tasks/show-tasks/modal-subtasks/modal-subtasks.component';

describe('ModalSubtasksComponent', () => {
  let fixture: ComponentFixture<ModalSubtasksComponent>;
  let component: ModalSubtasksComponent;
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    dialogRef = { close: vi.fn().mockName('MatDialogRef.close') };
    await TestBed.configureTestingModule({
      declarations: [ModalSubtasksComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { supertaskId: 17, supertaskName: 'Nightly run' } },
        { provide: MatDialogRef, useValue: dialogRef }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ModalSubtasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('exposes the supertask id and a descriptive heading', () => {
    expect(component.supertaskId).toBe(17);
    expect(component.supertaskName).toBe('Subtasks of Nightly run');
    expect(fixture.nativeElement.querySelector('h2').textContent.trim()).toBe('Subtasks of Nightly run');
  });

  it('closes the dialog', () => {
    component.close();
    expect(dialogRef.close).toHaveBeenCalledExactlyOnceWith();
  });
});
