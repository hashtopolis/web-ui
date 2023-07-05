import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFilesComponent } from './new-files.component';

describe('NewFilesComponent', () => {
  let component: NewFilesComponent;
  let fixture: ComponentFixture<NewFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
