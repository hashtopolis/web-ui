import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSupertasksComponent } from './import-supertasks.component';

describe('ImportSupertasksComponent', () => {
  let component: ImportSupertasksComponent;
  let fixture: ComponentFixture<ImportSupertasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportSupertasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportSupertasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
