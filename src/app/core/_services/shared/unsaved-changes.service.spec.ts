import { UnsavedChangesService } from '@services/shared/unsaved-changes.service';

describe('UnsavedChangesService', () => {
  let service: UnsavedChangesService;

  beforeEach(() => {
    service = new UnsavedChangesService();
  });

  it('starts without unsaved changes', () => {
    expect(service.hasUnsavedChanges()).toBe(false);
  });

  it('reports unsaved changes after they are set', () => {
    service.setUnsavedChanges(true);

    expect(service.hasUnsavedChanges()).toBe(true);
  });

  it('reports no unsaved changes after they are cleared', () => {
    service.setUnsavedChanges(true);

    service.setUnsavedChanges(false);

    expect(service.hasUnsavedChanges()).toBe(false);
  });
});
