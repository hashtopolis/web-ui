import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGlobalpermissionsgroupsComponent } from './new-globalpermissionsgroups.component';

describe('NewGlobalpermissionsgroupsComponent', () => {
  let component: NewGlobalpermissionsgroupsComponent;
  let fixture: ComponentFixture<NewGlobalpermissionsgroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewGlobalpermissionsgroupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewGlobalpermissionsgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
