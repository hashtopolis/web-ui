import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FileType } from '@models/file.model';
import { FilesRouteKind } from '@models/routes.schema';

import { FileRoleService } from '@services/roles/file-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { FilesTableComponent } from '@components/tables/files-table/files-table.component';

import { FilesComponent } from '@src/app/files/files.component';

@Component({ selector: 'app-page', template: '<ng-content></ng-content>', standalone: false })
class StubPageComponent {
  @Input() title: string;
  @Input() actionTitle?: string;
  @Input() actionLink?: string;
  @Input() showAction?: boolean;
}

@Component({ selector: 'app-table', template: '<ng-content></ng-content>', standalone: false })
class StubTableComponent {}

@Component({ selector: 'app-files-table', template: '', standalone: false })
class StubFilesTableComponent {
  @Input() name: string;
  @Input() fileType: FileType;
}

describe('FilesComponent wordlist', () => {
  let fixture: ComponentFixture<FilesComponent>;
  let hasRole: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    hasRole = vi.fn().mockName('FileRoleService.hasRole').mockReturnValue(true);

    await TestBed.configureTestingModule({
      declarations: [FilesComponent, StubPageComponent, StubTableComponent, StubFilesTableComponent],
      providers: [
        { provide: AutoTitleService, useValue: { set: vi.fn().mockName('AutoTitleService.set') } },
        { provide: FileRoleService, useValue: { hasRole } },
        { provide: ActivatedRoute, useValue: { data: of({ kind: FilesRouteKind.Wordlist }) } }
      ]
    }).compileComponents();
  });

  it('renders the page title and create action details', () => {
    fixture = TestBed.createComponent(FilesComponent);
    fixture.detectChanges();
    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;

    expect(page.title).toBe('Wordlist Files');
    expect(page.actionTitle).toBe('New Wordlist');
    expect(page.actionLink).toBe('/files/wordlist/new-wordlist');
    expect(page.showAction).toBe(true);
  });

  it('hides the create action when the user lacks the create role on wordlist page', () => {
    hasRole.mockReturnValue(false);
    fixture = TestBed.createComponent(FilesComponent);
    fixture.detectChanges();

    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;

    expect(page.showAction).toBe(false);
  });

  it('renders the files table inside the table container', () => {
    fixture = TestBed.createComponent(FilesComponent);
    fixture.detectChanges();
    const tableContainer = fixture.debugElement.query(By.directive(StubTableComponent));

    expect(tableContainer).not.toBeNull();

    const filesTable = tableContainer.query(By.directive(StubFilesTableComponent))
      .componentInstance as FilesTableComponent;
    expect(filesTable.name).toBe('filesWordlistTable');
    expect(filesTable.fileType).toBe(FileType.WORDLIST);
  });
});

describe('FilesComponent rules', () => {
  let fixture: ComponentFixture<FilesComponent>;
  let hasRole: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    hasRole = vi.fn().mockName('FileRoleService.hasRole').mockReturnValue(true);

    await TestBed.configureTestingModule({
      declarations: [FilesComponent, StubPageComponent, StubTableComponent, StubFilesTableComponent],
      providers: [
        { provide: AutoTitleService, useValue: { set: vi.fn().mockName('AutoTitleService.set') } },
        { provide: FileRoleService, useValue: { hasRole } },
        { provide: ActivatedRoute, useValue: { data: of({ kind: FilesRouteKind.Rules }) } }
      ]
    }).compileComponents();
  });

  it('renders the page title and create action details', () => {
    fixture = TestBed.createComponent(FilesComponent);
    fixture.detectChanges();
    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;

    expect(page.title).toBe('Rule Files');
    expect(page.actionTitle).toBe('New Rule');
    expect(page.actionLink).toBe('/files/rules/new-rule');
    expect(page.showAction).toBe(true);
  });

  it('hides the create action when the user lacks the create role on rules page', () => {
    hasRole.mockReturnValue(false);
    fixture = TestBed.createComponent(FilesComponent);
    fixture.detectChanges();

    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;

    expect(page.showAction).toBe(false);
  });

  it('renders the files table inside the table container', () => {
    fixture = TestBed.createComponent(FilesComponent);
    fixture.detectChanges();
    const tableContainer = fixture.debugElement.query(By.directive(StubTableComponent));

    expect(tableContainer).not.toBeNull();

    const filesTable = tableContainer.query(By.directive(StubFilesTableComponent))
      .componentInstance as FilesTableComponent;
    expect(filesTable.name).toBe('filesRuleTable');
    expect(filesTable.fileType).toBe(FileType.RULES);
  });
});

describe('FilesComponent other', () => {
  let fixture: ComponentFixture<FilesComponent>;
  let hasRole: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    hasRole = vi.fn().mockName('FileRoleService.hasRole').mockReturnValue(true);

    await TestBed.configureTestingModule({
      declarations: [FilesComponent, StubPageComponent, StubTableComponent, StubFilesTableComponent],
      providers: [
        { provide: AutoTitleService, useValue: { set: vi.fn().mockName('AutoTitleService.set') } },
        { provide: FileRoleService, useValue: { hasRole } },
        { provide: ActivatedRoute, useValue: { data: of({ kind: FilesRouteKind.Other }) } }
      ]
    }).compileComponents();
  });

  it('renders the page title and create action details', () => {
    fixture = TestBed.createComponent(FilesComponent);
    fixture.detectChanges();
    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;

    expect(page.title).toBe('Other Files');
    expect(page.actionTitle).toBe('New File');
    expect(page.actionLink).toBe('/files/other/new-other');
    expect(page.showAction).toBe(true);
  });

  it('hides the create action when the user lacks the create role', () => {
    hasRole.mockReturnValue(false);
    fixture = TestBed.createComponent(FilesComponent);
    fixture.detectChanges();

    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;

    expect(page.showAction).toBe(false);
  });

  it('renders the files table inside the table container', () => {
    fixture = TestBed.createComponent(FilesComponent);
    fixture.detectChanges();
    const tableContainer = fixture.debugElement.query(By.directive(StubTableComponent));

    expect(tableContainer).not.toBeNull();

    const filesTable = tableContainer.query(By.directive(StubFilesTableComponent))
      .componentInstance as FilesTableComponent;
    expect(filesTable.name).toBe('filesOtherTable');
    expect(filesTable.fileType).toBe(FileType.OTHER);
  });
});
