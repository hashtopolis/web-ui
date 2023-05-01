import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalpermissionsgroupsComponent } from './globalpermissionsgroups.component';

describe('GlobalpermissionsgroupsComponent', () => {
  let component: GlobalpermissionsgroupsComponent;
  let fixture: ComponentFixture<GlobalpermissionsgroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalpermissionsgroupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalpermissionsgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
