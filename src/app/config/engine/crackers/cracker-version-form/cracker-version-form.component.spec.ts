import { zCrackerBinaryResponse, zGetAccessGroupsHelperApiResponse } from '@generated/api/zod';
import { Subject, of, throwError } from 'rxjs';

import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { CrackerSource } from '@models/cracker-binary.model';

import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { UploadTUSService } from '@services/files/files_tus.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { CrackerBinaryRoleService } from '@services/roles/binaries/cracker-binary-role.service';
import { HashTypesRoleService } from '@services/roles/config/hashtypes-role.service';
import { AlertService } from '@services/shared/alert.service';
import { ConfigService } from '@services/shared/config.service';

import { CrackerHashtypesComponent } from '@src/app/config/engine/crackers/cracker-hashtypes/cracker-hashtypes.component';
import { CrackerVersionFormComponent } from '@src/app/config/engine/crackers/cracker-version-form/cracker-version-form.component';
import { mockResponse, mockValidResponse } from '@src/app/testing/mock-response';

@Component({ selector: 'app-cracker-hashtypes', template: '' })
class StubCrackerHashtypesComponent {
  @Input() crackerBinaryId: number;
  @Input() isHashcat = false;
  @Input() canEdit = false;
}

const ACCESS_GROUPS_RESPONSE = mockValidResponse(zGetAccessGroupsHelperApiResponse, {
  data: [
    { id: 4, type: 'accessGroup', attributes: { groupName: 'Red team' } },
    { id: 7, type: 'accessGroup', attributes: { groupName: 'Blue team' } }
  ]
});

const IMPORT_FILES_RESPONSE = mockResponse({
  meta: [
    { file: 'hashcat-7.1.2.7z', size: 10 },
    { file: 'rockyou.txt', size: 20 }
  ]
});

function fileList(name: string): FileList {
  const dt = new DataTransfer();
  dt.items.add(new File(['7z'], name));
  return dt.files;
}

describe('CrackerVersionFormComponent', () => {
  let fixture: ComponentFixture<CrackerVersionFormComponent>;
  let component: CrackerVersionFormComponent;
  let gs: jasmine.SpyObj<GlobalService>;
  let tus: jasmine.SpyObj<UploadTUSService>;
  let router: jasmine.SpyObj<Router>;
  let alert: jasmine.SpyObj<AlertService>;
  let roles: jasmine.SpyObj<CrackerBinaryRoleService>;
  let confirm: jasmine.SpyObj<ConfirmDialogService>;
  let hashtypeRoles: jasmine.SpyObj<HashTypesRoleService>;
  let routeData: { type: string };
  let routeParams: { id: string };

  async function setup(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [CrackerVersionFormComponent],
      providers: [
        { provide: GlobalService, useValue: gs },
        { provide: UploadTUSService, useValue: tus },
        { provide: Router, useValue: router },
        { provide: AlertService, useValue: alert },
        { provide: CrackerBinaryRoleService, useValue: roles },
        { provide: ConfirmDialogService, useValue: confirm },
        { provide: HashTypesRoleService, useValue: hashtypeRoles },
        { provide: ConfigService, useValue: { getEndpoint: () => 'http://localhost:8080/api/v2' } },
        { provide: ActivatedRoute, useValue: { snapshot: { data: routeData, params: routeParams } } },
        provideHttpClient()
      ]
    })
      .overrideComponent(CrackerVersionFormComponent, {
        remove: { imports: [CrackerHashtypesComponent] },
        add: { imports: [StubCrackerHashtypesComponent] }
      })
      .compileComponents();
    fixture = TestBed.createComponent(CrackerVersionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function fillCommon(): void {
    component.form.patchValue({ binaryName: 'hashcat', version: '7.1.2' });
  }

  beforeEach(() => {
    gs = jasmine.createSpyObj('GlobalService', [
      'ghelper',
      'chelper',
      'get',
      'create',
      'update',
      'delete',
      'downloadFromUrl'
    ]);
    tus = jasmine.createSpyObj('UploadTUSService', ['uploadFile']);
    router = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    alert = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage', 'showInfoMessage']);
    roles = jasmine.createSpyObj('CrackerBinaryRoleService', ['hasRole']);
    confirm = jasmine.createSpyObj('ConfirmDialogService', ['confirmDeletion']);
    roles.hasRole.and.returnValue(true);
    hashtypeRoles = jasmine.createSpyObj('HashTypesRoleService', ['hasRole']);
    hashtypeRoles.hasRole.and.returnValue(true);
    gs.ghelper.and.returnValue(of(ACCESS_GROUPS_RESPONSE));
    gs.chelper.and.returnValue(of(IMPORT_FILES_RESPONSE));
    gs.create.and.returnValue(of(mockResponse()));
    router.navigate.and.resolveTo(true);
  });

  describe('create mode', () => {
    beforeEach(async () => {
      routeData = { type: 'create' };
      routeParams = { id: '3' };
      await setup();
    });

    it('shows no hashtypes section', () => {
      expect(hashtypesSection()).toBeNull();
    });

    it('loads access groups via the getAccessGroups helper and preselects the first', () => {
      expect(gs.ghelper).toHaveBeenCalledWith(SERV.HELPER, 'getAccessGroups');
      expect(component.selectAccessGroups.map((o) => o.id)).toEqual([4, 7]);
      expect(component.form.controls.accessGroupId.value).toBe(4);
    });

    it('creates with an external link and redirects', async () => {
      fillCommon();
      component.form.controls.downloadUrl.setValue('https://e.com/h.7z');
      await component.onSubmit();
      expect(gs.create).toHaveBeenCalledWith(
        SERV.CRACKERS,
        {
          crackerBinaryTypeId: 3,
          binaryName: 'hashcat',
          version: '7.1.2',
          accessGroupId: 4,
          downloadUrl: 'https://e.com/h.7z'
        },
        jasmine.anything()
      );
      expect(alert.showSuccessMessage).toHaveBeenCalledWith('Cracker version created!');
      expect(router.navigate).toHaveBeenCalledWith(['/config/engine/crackers']);
    });

    it('creates with a server download', async () => {
      fillCommon();
      component.form.controls.source.setValue(CrackerSource.SERVER_DOWNLOAD);
      component.form.controls.sourceUrl.setValue('https://e.com/h.7z');
      await component.onSubmit();
      expect(gs.create.calls.mostRecent().args[1]).toEqual(
        jasmine.objectContaining({ sourceType: 'url', sourceData: 'https://e.com/h.7z' })
      );
    });

    it('lists only .7z files for server import and creates with the chosen file', async () => {
      component.form.controls.source.setValue(CrackerSource.SERVER_IMPORT);
      await fixture.whenStable();
      expect(component.serverFileOptions.map((o) => o.id)).toEqual(['hashcat-7.1.2.7z']);
      fillCommon();
      component.form.controls.importFile.setValue('hashcat-7.1.2.7z');
      await component.onSubmit();
      expect(gs.create.calls.mostRecent().args[1]).toEqual(
        jasmine.objectContaining({ sourceType: 'import', sourceData: 'hashcat-7.1.2.7z' })
      );
    });

    it('uploads via TUS under a stable generated name, then creates and redirects', async () => {
      tus.uploadFile.and.returnValue(of(50, 100));
      fillCommon();
      component.form.controls.source.setValue(CrackerSource.UPLOAD);
      component.form.controls.file.setValue(fileList('my hashcat.7z'));
      await component.onSubmit();
      const [file, name, service, form, redirect] = tus.uploadFile.calls.mostRecent().args;
      expect(file.name).toBe('my hashcat.7z');
      expect(name).toBe(`cracker-3-${file.lastModified}-${file.size}.7z`);
      expect(service).toBe(SERV.CRACKERS);
      expect(form).withContext('the component creates the version itself').toBeNull();
      expect(redirect).toBeNull();
      expect(gs.create).toHaveBeenCalledWith(
        SERV.CRACKERS,
        jasmine.objectContaining({ sourceType: 'import', sourceData: name }),
        jasmine.anything()
      );
      expect(component.uploadProgress).toBe(100);
      expect(router.navigate).toHaveBeenCalledWith(['/config/engine/crackers']);
    });

    it('reuses the upload name when the same file is submitted again', async () => {
      tus.uploadFile.and.returnValues(
        throwError(() => new Error('connection lost')),
        of(100)
      );
      fillCommon();
      component.form.controls.source.setValue(CrackerSource.UPLOAD);
      component.form.controls.file.setValue(fileList('h.7z'));
      await component.onSubmit();
      await component.onSubmit();
      const names = tus.uploadFile.calls.allArgs().map((args) => args[1]);
      expect(names[0]).toBe(names[1]);
      expect(gs.create.calls.mostRecent().args[1]).toEqual(jasmine.objectContaining({ sourceData: names[1] }));
    });

    it('does not create the version when the page is left during the upload', () => {
      const progress = new Subject<number>();
      tus.uploadFile.and.returnValue(progress);
      fillCommon();
      component.form.controls.source.setValue(CrackerSource.UPLOAD);
      component.form.controls.file.setValue(fileList('h.7z'));
      void component.onSubmit();
      fixture.destroy();
      progress.next(100);
      progress.complete();
      expect(gs.create).not.toHaveBeenCalled();
    });

    it('keeps the user on the page when the create after an upload fails', async () => {
      tus.uploadFile.and.returnValue(of(100));
      gs.create.and.returnValue(
        throwError(
          () =>
            new HttpErrorResponse({ status: 400, error: { title: 'The provided archive is not a valid 7z archive!' } })
        )
      );
      fillCommon();
      component.form.controls.source.setValue(CrackerSource.UPLOAD);
      component.form.controls.file.setValue(fileList('h.7z'));
      await component.onSubmit();
      expect(alert.showErrorMessage).toHaveBeenCalledWith(
        'Failed to create cracker version: The provided archive is not a valid 7z archive! The uploaded archive remains in the server import directory.'
      );
      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.isSubmitting).toBeFalse();
      expect(component.form.controls.binaryName.value).toBe('hashcat');
    });

    it('does not mention the import directory when the upload itself fails', async () => {
      tus.uploadFile.and.returnValue(throwError(() => new Error('connection lost')));
      fillCommon();
      component.form.controls.source.setValue(CrackerSource.UPLOAD);
      component.form.controls.file.setValue(fileList('h.7z'));
      await component.onSubmit();
      expect(alert.showErrorMessage).toHaveBeenCalledWith('Failed to upload the archive: connection lost');
      expect(gs.create).not.toHaveBeenCalled();
    });

    it('stays busy after a successful create so a second click cannot create a duplicate', async () => {
      fillCommon();
      component.form.controls.downloadUrl.setValue('https://e.com/h.7z');
      await component.onSubmit();
      expect(component.isSubmitting).toBeTrue();
      await component.onSubmit();
      expect(gs.create).toHaveBeenCalledTimes(1);
    });

    it('does not filter the file picker by type, the form validates the .7z extension instead', () => {
      // macOS greys out .7z files for accept=".7z" when the browser maps it to another file type
      component.form.controls.source.setValue(CrackerSource.UPLOAD);
      fixture.detectChanges();
      const input: HTMLInputElement | null = fixture.nativeElement.querySelector('input[type="file"]');
      expect(input).withContext('file input rendered').not.toBeNull();
      expect(input?.getAttribute('accept') ?? '').toBe('');
    });

    it('clears the chosen file when switching away from Upload', () => {
      component.form.controls.source.setValue(CrackerSource.UPLOAD);
      component.form.controls.file.setValue(fileList('h.7z'));
      component.form.controls.source.setValue(CrackerSource.EXTERNAL_LINK);
      component.form.controls.source.setValue(CrackerSource.UPLOAD);
      expect(component.form.controls.file.value).toBeNull();
    });

    it('shows the backend reason when a direct create fails', async () => {
      gs.create.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 400, error: { title: 'Failed to download the archive' } }))
      );
      fillCommon();
      component.form.controls.downloadUrl.setValue('https://e.com/h.7z');
      await component.onSubmit();
      expect(alert.showErrorMessage).toHaveBeenCalledWith(
        'Failed to create cracker version: Failed to download the archive'
      );
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('does not submit an invalid form', async () => {
      await component.onSubmit();
      expect(gs.create).not.toHaveBeenCalled();
      expect(component.form.touched).toBeTrue();
    });

    it('does not send the old source field after switching source', async () => {
      fillCommon();
      component.form.controls.source.setValue(CrackerSource.SERVER_DOWNLOAD);
      component.form.controls.sourceUrl.setValue('https://old.example/h.7z');
      component.form.controls.source.setValue(CrackerSource.EXTERNAL_LINK);
      component.form.controls.downloadUrl.setValue('https://e.com/h.7z');
      await component.onSubmit();
      const payload = gs.create.calls.mostRecent().args[1];
      expect(payload['sourceType']).toBeUndefined();
      expect(payload['sourceData']).toBeUndefined();
    });

    it('ignores a second submit while the first is running', async () => {
      fillCommon();
      component.form.controls.downloadUrl.setValue('https://e.com/h.7z');
      component.isSubmitting = true;
      await component.onSubmit();
      expect(gs.create).not.toHaveBeenCalled();
    });
  });

  describe('create mode without access groups', () => {
    beforeEach(async () => {
      routeData = { type: 'create' };
      routeParams = { id: '3' };
      gs.ghelper.and.returnValue(of(mockValidResponse(zGetAccessGroupsHelperApiResponse, { data: [] })));
      await setup();
    });

    it('keeps the form invalid and explains why', () => {
      expect(component.form.controls.accessGroupId.value).toBeNull();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('[data-testid="no-access-groups"]')?.textContent).toContain(
        'You are not a member of any access group'
      );
    });
  });

  function binaryResponse(filename: string | null, typeName = 'hashcat') {
    return mockValidResponse(zCrackerBinaryResponse, {
      data: {
        id: 12,
        type: 'crackerBinary',
        attributes: {
          crackerBinaryTypeId: 1,
          version: '7.1.2',
          downloadUrl: filename ? 'http://localhost:8080/api/download.php/crackerBinary/12' : 'https://e.com/h.7z',
          binaryName: 'hashcat',
          filename,
          accessGroupId: 7
        },
        relationships: { crackerBinaryType: { data: { id: 1, type: 'crackerBinaryType' } } }
      },
      included: [{ id: 1, type: 'crackerBinaryType', attributes: { typeName, isChunkingAvailable: true } }]
    });
  }

  function hashtypesSection(): StubCrackerHashtypesComponent | null {
    return fixture.debugElement.query(By.directive(StubCrackerHashtypesComponent))?.componentInstance ?? null;
  }

  describe('edit mode, stored on server', () => {
    beforeEach(async () => {
      routeData = { type: 'edit' };
      routeParams = { id: '12' };
      gs.get.and.returnValue(of(binaryResponse('hashcat-7.1.2.7z')));
      gs.update.and.returnValue(of({}));
      await setup();
    });

    it('shows the read-only hashtypes section of a hashcat version', () => {
      const section = hashtypesSection();
      expect(section?.crackerBinaryId).toBe(12);
      expect(section?.isHashcat).toBeTrue();
      expect(section?.canEdit).toBeTrue();
    });

    it('loads the binary with its type and shows the title', () => {
      const [serviceConfig, id] = gs.get.calls.mostRecent().args;
      expect(serviceConfig).toBe(SERV.CRACKERS);
      expect(id).toBe(12);
      expect(component.pageTitle).toBe('Edit hashcat version 7.1.2');
      expect(component.form.controls.accessGroupId.value).toBe(7);
      expect(component.form.pristine).toBeTrue();
    });

    it('shows downloadUrl read-only with filename and a download button', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('[data-testid="stored-on-server"]')?.textContent).toContain('hashcat-7.1.2.7z');
      expect(el.querySelector('[data-testid="download-button"]')).toBeTruthy();
      expect(el.querySelector('[data-testid="input-select-source"]')).toBeNull();
    });

    it('never sends downloadUrl in the PATCH', async () => {
      component.form.controls.version.setValue('7.1.3');
      component.form.controls.version.markAsDirty();
      await component.onSubmit();
      expect(gs.update).toHaveBeenCalledWith(SERV.CRACKERS, 12, { version: '7.1.3' });
      expect(alert.showSuccessMessage).toHaveBeenCalledWith('Cracker version saved!');
      expect(router.navigate).toHaveBeenCalledWith(['/config/engine/crackers']);
    });

    it('does not send an empty PATCH', async () => {
      await component.onSubmit();
      expect(gs.update).not.toHaveBeenCalled();
      expect(alert.showInfoMessage).toHaveBeenCalledWith('No changes to save.');
    });

    it('downloads the archive under its filename', async () => {
      gs.downloadFromUrl.and.returnValue(of(undefined));
      await component.onDownload();
      expect(gs.downloadFromUrl).toHaveBeenCalledWith(
        'http://localhost:8080/api/download.php/crackerBinary/12',
        'hashcat-7.1.2.7z',
        jasmine.anything()
      );
    });

    it('explains a missing archive on 404', async () => {
      gs.downloadFromUrl.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
      await component.onDownload();
      expect(alert.showErrorMessage).toHaveBeenCalledWith(
        'The archive of this cracker version is not present on the server.'
      );
      expect(component.isDownloading).toBeFalse();
    });

    it('deletes after confirmation and returns to the list', () => {
      confirm.confirmDeletion.and.returnValue(of(true));
      gs.delete.and.returnValue(of({}));
      component.onDelete();
      expect(confirm.confirmDeletion).toHaveBeenCalledWith('Cracker version', 'hashcat 7.1.2');
      expect(gs.delete).toHaveBeenCalledWith(SERV.CRACKERS, 12);
      expect(router.navigate).toHaveBeenCalledWith(['/config/engine/crackers']);
    });
  });

  describe('edit mode, external link', () => {
    beforeEach(async () => {
      routeData = { type: 'edit' };
      routeParams = { id: '12' };
      gs.get.and.returnValue(of(binaryResponse(null)));
      gs.update.and.returnValue(of({}));
      await setup();
    });

    it('sends a changed downloadUrl and no download button is shown', async () => {
      expect(fixture.nativeElement.querySelector('[data-testid="download-button"]')).toBeNull();
      component.form.controls.downloadUrl.setValue('https://new.example/h.7z');
      component.form.controls.downloadUrl.markAsDirty();
      await component.onSubmit();
      expect(gs.update).toHaveBeenCalledWith(SERV.CRACKERS, 12, { downloadUrl: 'https://new.example/h.7z' });
    });
  });

  describe('edit mode without update role', () => {
    beforeEach(async () => {
      routeData = { type: 'edit' };
      routeParams = { id: '12' };
      roles.hasRole.and.callFake((role: string) => role !== 'update');
      gs.get.and.returnValue(of(binaryResponse('hashcat-7.1.2.7z')));
      await setup();
    });

    it('is read-only but still offers the download', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(component.form.disabled).toBeTrue();
      expect(el.querySelector('[data-testid="submit-button-crackerVersion"]')).toBeNull();
      expect(el.querySelector('[data-testid="delete-button"]')).toBeNull();
      expect(el.querySelector('[data-testid="download-button"]')).toBeTruthy();
    });
  });

  describe('edit mode, generic cracker', () => {
    beforeEach(async () => {
      routeData = { type: 'edit' };
      routeParams = { id: '12' };
      gs.get.and.returnValue(of(binaryResponse(null, 'generic')));
      await setup();
    });

    it('shows the editable hashtypes section', () => {
      expect(component.isHashcat).toBeFalse();
      expect(hashtypesSection()?.isHashcat).toBeFalse();
    });
  });

  describe('edit mode without hashtype read role', () => {
    beforeEach(async () => {
      routeData = { type: 'edit' };
      routeParams = { id: '12' };
      hashtypeRoles.hasRole.and.returnValue(false);
      gs.get.and.returnValue(of(binaryResponse(null)));
      await setup();
    });

    it('shows no hashtypes section', () => {
      expect(hashtypesSection()).toBeNull();
    });
  });

  describe('edit mode load errors', () => {
    it('redirects to /not-found on 404', async () => {
      routeData = { type: 'edit' };
      routeParams = { id: '12' };
      gs.get.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
      await setup();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/not-found');
    });
  });
});
