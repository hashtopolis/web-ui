import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalService } from '@services/main.service';
import { UIConfigService } from '@services/shared/storage.service';

import { BlacklistAttackComponent } from '@src/app/shared/alert/blacklisted-attack/blacklisted-attack.component';

describe('BlacklistAttackComponent', () => {
  let component: BlacklistAttackComponent;
  let fixture: ComponentFixture<BlacklistAttackComponent>;

  beforeEach(() => {
    const globalServiceSpy = jasmine.createSpyObj('GlobalService', ['getAll']);
    globalServiceSpy.getAll.and.returnValue(of({}));

    TestBed.configureTestingModule({
      declarations: [BlacklistAttackComponent],
      providers: [UIConfigService, { provide: GlobalService, useValue: globalServiceSpy }]
    });

    fixture = TestBed.createComponent(BlacklistAttackComponent);
    component = fixture.componentInstance;

    component.blacklistedChars = [];
    component.hasErrors = false;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('checkForBanChars', () => {
    it('should not find errors when input is empty', () => {
      component.value = '';

      Object.defineProperty(component, 'uiService', {
        value: jasmine.createSpyObj('UIConfigService', ['getUISettings'])
      });
      component.checkForBanChars();
      expect(component.hasErrors).toBe(false);
    });

    it('should find errors when input contains blacklisted characters', () => {
      component.value = 'test@#$';
      const mockService = jasmine.createSpyObj('UIConfigService', ['getUISettings']);
      mockService.getUISettings.and.returnValue({ blacklistChars: '@#$' });
      Object.defineProperty(component, 'uiService', { value: mockService });
      component.checkForBanChars();
      expect(component.hasErrors).toBe(true);
      expect(component.blacklistedChars).toEqual(['@', '#', '$']);
    });

    it('should handle escaped special regex characters', () => {
      component.value = 'test[(){}^$*+?';
      const mockService = jasmine.createSpyObj('UIConfigService', ['getUISettings']);
      mockService.getUISettings.and.returnValue({ blacklistChars: '[(){}^$*+?' });
      Object.defineProperty(component, 'uiService', { value: mockService });
      component.checkForBanChars();
      expect(component.hasErrors).toBe(true);
    });

    it('should not find errors for valid input', () => {
      component.value = 'xyz';
      const mockService = jasmine.createSpyObj('UIConfigService', ['getUISettings']);
      mockService.getUISettings.and.returnValue({ blacklistChars: 'abc' });
      Object.defineProperty(component, 'uiService', { value: mockService });
      component.checkForBanChars();
      expect(component.hasErrors).toBe(false);
    });

    it('should clear blacklistedChars and hasErrors before checking', () => {
      component.value = 'test@#$';
      component.hasErrors = true;
      component.blacklistedChars = ['@', '#', '$'];
      const mockService = jasmine.createSpyObj('UIConfigService', ['getUISettings']);
      mockService.getUISettings.and.returnValue({ blacklistChars: '@#$' });
      Object.defineProperty(component, 'uiService', { value: mockService });
      component.checkForBanChars();
      expect(component.blacklistedChars).toEqual(['@', '#', '$']);
      expect(component.hasErrors).toBe(true);
    });

    it('should return early when no chars are configured', () => {
      component.value = 'test';
      const mockService = jasmine.createSpyObj('UIConfigService', ['getUISettings']);
      mockService.getUISettings.and.returnValue({ blacklistChars: '' });
      Object.defineProperty(component, 'uiService', { value: mockService });
      component.checkForBanChars();
      expect(component.hasErrors).toBe(false);
      expect(component.blacklistedChars).toEqual([]);
    });

    it('should treat dash as literal character, not a range operator', () => {
      component.value = 'by';
      const mockService = jasmine.createSpyObj('UIConfigService', ['getUISettings']);
      mockService.getUISettings.and.returnValue({ blacklistChars: 'a-z' });
      Object.defineProperty(component, 'uiService', { value: mockService });
      component.checkForBanChars();
      expect(component.hasErrors).toBe(false);
      expect(component.blacklistedChars).toEqual([]);
    });
  });
});
