/// <reference types="jasmine" />
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ActionMenuComponent } from './action-menu.component';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { LocalStorageService } from '@services/storage/local-storage.service';
import { UIConfig } from '@models/config-ui.model';

@Component({
  template: '<action-menu [actionMenuItems]="[]" label="Test"></action-menu>',
  standalone: false
})
class TestHostComponent {}

describe('ActionMenuComponent', () => {
  let component: ActionMenuComponent;
  let fixture: ComponentFixture<ActionMenuComponent>;
  let routerEvents$: Subject<NavigationEnd>;
  let routerSpy: jasmine.SpyObj<Router>;
  let storageSpy: jasmine.SpyObj<LocalStorageService<UIConfig>>;

  beforeEach(async () => {
    routerEvents$ = new Subject<NavigationEnd>();
    routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      events: routerEvents$.asObservable()
    });
    storageSpy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);
    storageSpy.getItem.and.returnValue(null);

    await TestBed.configureTestingModule({
      declarations: [ActionMenuComponent],
      imports: [
        NoopAnimationsModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        FontAwesomeModule
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: LocalStorageService, useValue: storageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;
    component.actionMenuItems = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('checkIsActive', () => {
    it('should be inactive by default', () => {
      component.currentUrl = ['agents', 'show-agents'];
      component.actionMenuItems = [];
      component.checkIsActive();
      expect(component.isActive).toBeFalse();
    });

    it('should be active when currentUrl matches routerLink exactly', () => {
      component.currentUrl = ['agents', 'show-agents'];
      component.actionMenuItems = [[{ label: 'Agents', routerLink: ['agents', 'show-agents'] }]];
      component.checkIsActive();
      expect(component.isActive).toBeTrue();
    });

    it('should be active when currentUrl is deeper than routerLink (prefix match)', () => {
      component.currentUrl = ['files', 'wordlist', 'new-wordlist'];
      component.actionMenuItems = [[{ label: 'Wordlists', routerLink: ['files', 'wordlist'] }]];
      component.checkIsActive();
      expect(component.isActive).toBeTrue();
    });

    it('should NOT be active when currentUrl does not match routerLink', () => {
      component.currentUrl = ['hashlists', 'hashlist'];
      component.actionMenuItems = [[{ label: 'Agents', routerLink: ['agents', 'show-agents'] }]];
      component.checkIsActive();
      expect(component.isActive).toBeFalse();
    });

    it('should be active when currentUrl matches routerLinkAdd', () => {
      component.currentUrl = ['agents', 'new-agent'];
      component.actionMenuItems = [[{
        label: 'Agents',
        routerLink: ['agents', 'show-agents'],
        routerLinkAdd: ['agents', 'new-agent']
      }]];
      component.checkIsActive();
      expect(component.isActive).toBeTrue();
    });

    it('should NOT be active when routerLink matches but routerLinkAdd does not', () => {
      component.currentUrl = ['agents', 'something-else'];
      component.actionMenuItems = [[{
        label: 'Agents',
        routerLink: ['agents', 'show-agents'],
        routerLinkAdd: ['agents', 'new-agent']
      }]];
      component.checkIsActive();
      expect(component.isActive).toBeFalse();
    });

    it('should be active when currentUrl matches an activeRoute', () => {
      component.currentUrl = ['config', 'task-chunk'];
      component.actionMenuItems = [[{
        label: 'Settings',
        routerLink: ['config', 'agent'],
        activeRoutes: [['config', 'task-chunk'], ['config', 'hch']]
      }]];
      component.checkIsActive();
      expect(component.isActive).toBeTrue();
    });

    it('should be active when currentUrl matches second activeRoute', () => {
      component.currentUrl = ['config', 'hch'];
      component.actionMenuItems = [[{
        label: 'Settings',
        routerLink: ['config', 'agent'],
        activeRoutes: [['config', 'task-chunk'], ['config', 'hch']]
      }]];
      component.checkIsActive();
      expect(component.isActive).toBeTrue();
    });

    it('should NOT be active when currentUrl does not match any activeRoute', () => {
      component.currentUrl = ['config', 'something-else'];
      component.actionMenuItems = [[{
        label: 'Settings',
        routerLink: ['config', 'agent'],
        activeRoutes: [['config', 'task-chunk'], ['config', 'hch']]
      }]];
      component.checkIsActive();
      expect(component.isActive).toBeFalse();
    });

    it('should be active when currentUrl matches a 3-segment activeRoute', () => {
      component.currentUrl = ['tasks', 'import-supertasks', 'wrbulk'];
      component.actionMenuItems = [[{
        label: 'Supertask Builder',
        routerLink: ['tasks', 'import-supertasks', 'masks'],
        activeRoutes: [['tasks', 'import-supertasks', 'wrbulk']]
      }]];
      component.checkIsActive();
      expect(component.isActive).toBeTrue();
    });

    it('should be active when matching item is in a second section', () => {
      component.currentUrl = ['hashlists', 'hashlist'];
      component.actionMenuItems = [
        [{ label: 'Agents', routerLink: ['agents', 'show-agents'] }],
        [{ label: 'Hashlists', routerLink: ['hashlists', 'hashlist'] }]
      ];
      component.checkIsActive();
      expect(component.isActive).toBeTrue();
    });

    it('should handle item with no routerLink, routerLinkAdd or activeRoutes', () => {
      component.currentUrl = ['agents', 'show-agents'];
      component.actionMenuItems = [[{ label: 'Logout', action: 'logout' }]];
      component.checkIsActive();
      expect(component.isActive).toBeFalse();
    });
  });
});
