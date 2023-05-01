import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGlobalpermissionsgroupsComponent } from './edit-globalpermissionsgroups.component';

describe('EditGlobalpermissionsgroupsComponent', () => {
  let component: EditGlobalpermissionsgroupsComponent;
  let fixture: ComponentFixture<EditGlobalpermissionsgroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGlobalpermissionsgroupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGlobalpermissionsgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
