import type { MockedObject } from 'vitest';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';
import { GlobalpermissionsgroupsComponent } from '@src/app/users/globalpermissionsgroups/globalpermissionsgroups.component';

describe('GlobalpermissionsgroupsComponent', () => {
  let fixture: ComponentFixture<GlobalpermissionsgroupsComponent>;
  let component: GlobalpermissionsgroupsComponent;
  let mockAutoTitleService: MockedObject<AutoTitleService>;

  beforeEach(async () => {
    mockAutoTitleService = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as MockedObject<AutoTitleService>;

    await TestBed.configureTestingModule({
      declarations: [GlobalpermissionsgroupsComponent],
      providers: [{ provide: AutoTitleService, useValue: mockAutoTitleService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(GlobalpermissionsgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set the page title when the component is created', () => {
    fixture = TestBed.createComponent(GlobalpermissionsgroupsComponent);
    fixture.detectChanges();

    expect(mockAutoTitleService.set).toHaveBeenCalledExactlyOnceWith(['Show Global Permissions']);
  });

  it('should propagate errors from the title service', () => {
    mockAutoTitleService.set.mockImplementation(() => {
      throw new Error('Title service failed');
    });

    expect(() => TestBed.createComponent(GlobalpermissionsgroupsComponent)).toThrow('Title service failed');
  });
});
