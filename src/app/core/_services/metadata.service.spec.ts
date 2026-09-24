import { TestBed } from '@angular/core/testing';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { FieldType, MetadataService } from '@services/metadata.service';
import { TooltipService } from '@services/shared/tooltip.service';

describe('Global permission group creation metadata', () => {
  let metadataService: MetadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MetadataService,
        { provide: GlobalService, useValue: {} },
        { provide: TooltipService, useValue: { getConfigTooltips: () => ({}) } }
      ]
    });

    metadataService = TestBed.inject(MetadataService);
  });

  it('uses the backend resource type', () => {
    expect(SERV.ACCESS_PERMISSIONS_GROUPS.RESOURCE).toBe('globalPermissionGroup');
  });

  it('includes an empty permissions object without showing another field', () => {
    const permissionsField = metadataService
      .getFormMetadata('newglobalpermissionsgp')
      .find((field) => field.name === 'permissions');

    expect(permissionsField).toEqual(
      jasmine.objectContaining({
        type: FieldType.Hidden,
        defaultValue: {}
      })
    );
  });
});
