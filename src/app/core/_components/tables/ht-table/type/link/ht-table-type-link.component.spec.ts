import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BaseModel } from '@models/base.model';

import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import { HTTableTypeLinkComponent } from '@components/tables/ht-table/type/link/ht-table-type-link.component';

describe('HTTableTypeLinkComponent', () => {
  let fixture: ComponentFixture<HTTableTypeLinkComponent>;
  let component: HTTableTypeLinkComponent;
  let httpMock: HttpTestingController;

  const element: BaseModel = { id: 1, type: 'task' };
  const tableColumn: HTTableColumn = { id: 1, dataKey: 'taskName' };
  const imageUrl = '/api/tasks/7/graph';

  function graphLink(overrides: Partial<NonNullable<HTTableRouterLink['visualGraph']>> = {}): HTTableRouterLink {
    return {
      label: 'Task 7',
      routerLink: ['/tasks', 7],
      visualGraph: { enabled: true, taskId: 7, imageUrl, ...overrides }
    };
  }

  function hoverEvent(): MouseEvent {
    const anchor = document.createElement('span');
    document.body.appendChild(anchor);
    onTestFinished(() => anchor.remove());
    return { currentTarget: anchor } as unknown as MouseEvent;
  }

  function previewPanels(): NodeListOf<Element> {
    return document.querySelectorAll('.graph-preview-overlay .graph-preview');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HTTableTypeLinkComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(HTTableTypeLinkComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('element', element);
    fixture.componentRef.setInput('tableColumn', tableColumn);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('click handling', () => {
    it('should emit linkClicked when a router link is clicked', () => {
      const emitted = vi.fn().mockName('linkClicked');
      component.linkClicked.subscribe(emitted);

      component.onLinkClicked();

      expect(emitted).toHaveBeenCalledTimes(1);
    });

    it('should run the action handler and emit linkClicked', () => {
      const onClick = vi.fn().mockName('link.onClick');
      const emitted = vi.fn().mockName('linkClicked');
      component.linkClicked.subscribe(emitted);

      component.onActionClicked({ label: 'Run', routerLink: null, onClick });

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(emitted).toHaveBeenCalledTimes(1);
    });

    it('should still emit linkClicked when the link has no action handler', () => {
      const emitted = vi.fn().mockName('linkClicked');
      component.linkClicked.subscribe(emitted);

      component.onActionClicked({ label: 'Run', routerLink: null });

      expect(emitted).toHaveBeenCalledTimes(1);
    });
  });

  describe('prefetchVisualGraph', () => {
    it('should load the image as blob and cache an object URL for it', () => {
      const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:graph-7');
      const link = graphLink();
      const blob = new Blob(['png'], { type: 'image/png' });

      component.prefetchVisualGraph(link);
      const request = httpMock.expectOne(imageUrl);
      request.flush(blob);

      expect(request.request.responseType).toBe('blob');
      expect(createObjectURL).toHaveBeenCalledExactlyOnceWith(blob);
      expect(component.getVisualGraphPreview(link)).toBe('blob:graph-7');
      expect(component.hasVisualGraphLoadError(link)).toBe(false);
    });

    it.each([
      ['no visual graph', { label: 'x', routerLink: null } as HTTableRouterLink],
      ['the graph is disabled', graphLink({ enabled: false })],
      ['the task id is missing', graphLink({ taskId: 0 })],
      ['the image URL is empty', graphLink({ imageUrl: '' })]
    ])('should not request an image when %s', (_case, link) => {
      component.prefetchVisualGraph(link);

      expect(httpMock.match(() => true)).toHaveLength(0);
      expect(component.getVisualGraphPreview(link)).toBeNull();
    });

    it('should not request the image again while a request is pending', () => {
      const link = graphLink();
      component.prefetchVisualGraph(link);

      component.prefetchVisualGraph(link);

      expect(httpMock.match(imageUrl)).toHaveLength(1);
    });

    it('should not request the image again once it is cached', () => {
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:graph-7');
      const link = graphLink();
      component.prefetchVisualGraph(link);
      httpMock.expectOne(imageUrl).flush(new Blob(['png'], { type: 'image/png' }));

      component.prefetchVisualGraph(link);

      expect(httpMock.match(imageUrl)).toHaveLength(0);
    });

    it.each([
      ['a non-image blob', new Blob(['<html></html>'], { type: 'text/html' })],
      ['an empty image blob', new Blob([], { type: 'image/png' })],
      ['a blob without type', new Blob(['png'])]
    ])('should mark a load error for %s', (_case, blob) => {
      const createObjectURL = vi.spyOn(URL, 'createObjectURL');
      const link = graphLink();

      component.prefetchVisualGraph(link);
      httpMock.expectOne(imageUrl).flush(blob);

      expect(createObjectURL).not.toHaveBeenCalled();
      expect(component.hasVisualGraphLoadError(link)).toBe(true);
      expect(component.getVisualGraphPreview(link)).toBeNull();
    });

    it('should mark a load error when the request fails', () => {
      const link = graphLink();

      component.prefetchVisualGraph(link);
      httpMock.expectOne(imageUrl).flush(null, { status: 500, statusText: 'Server Error' });

      expect(component.hasVisualGraphLoadError(link)).toBe(true);
      expect(component.getVisualGraphPreview(link)).toBeNull();
    });

    it('should retry after a failed request and clear the previous error', () => {
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:graph-7');
      const link = graphLink();
      component.prefetchVisualGraph(link);
      httpMock.expectOne(imageUrl).flush(null, { status: 500, statusText: 'Server Error' });

      component.prefetchVisualGraph(link);
      const errorWhilePending = component.hasVisualGraphLoadError(link);
      httpMock.expectOne(imageUrl).flush(new Blob(['png'], { type: 'image/png' }));

      expect(errorWhilePending).toBe(false);
      expect(component.getVisualGraphPreview(link)).toBe('blob:graph-7');
    });
  });

  describe('getVisualGraphPreview / hasVisualGraphLoadError', () => {
    it('should return no preview and no error for a link without visual graph', () => {
      const link: HTTableRouterLink = { label: 'x', routerLink: null };

      expect(component.getVisualGraphPreview(link)).toBeNull();
      expect(component.hasVisualGraphLoadError(link)).toBe(false);
    });
  });

  describe('onVisualGraphImageError', () => {
    it('should drop the cached preview and mark a load error', () => {
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:graph-7');
      const link = graphLink();
      component.prefetchVisualGraph(link);
      httpMock.expectOne(imageUrl).flush(new Blob(['png'], { type: 'image/png' }));

      component.onVisualGraphImageError(link);

      expect(component.getVisualGraphPreview(link)).toBeNull();
      expect(component.hasVisualGraphLoadError(link)).toBe(true);
    });

    it('should ignore links without a task id', () => {
      const link: HTTableRouterLink = { label: 'x', routerLink: null };

      component.onVisualGraphImageError(link);

      expect(component.hasVisualGraphLoadError(link)).toBe(false);
    });
  });

  describe('showPreview / hidePreview', () => {
    it('should prefetch the image and open the preview overlay for an enabled graph', () => {
      const link = graphLink();

      component.showPreview(link, hoverEvent());
      fixture.detectChanges();

      httpMock.expectOne(imageUrl);
      expect(previewPanels()).toHaveLength(1);
      expect(previewPanels()[0].textContent).toContain('Loading graph...');
    });

    it('should not open an overlay when the graph is disabled', () => {
      const link = graphLink({ enabled: false });

      component.showPreview(link, hoverEvent());
      fixture.detectChanges();

      httpMock.expectNone(imageUrl);
      expect(previewPanels()).toHaveLength(0);
    });

    it('should replace an open preview instead of stacking a second one', () => {
      component.showPreview(graphLink(), hoverEvent());
      httpMock.expectOne(imageUrl);

      component.showPreview(graphLink(), hoverEvent());
      fixture.detectChanges();

      expect(previewPanels()).toHaveLength(1);
    });

    it('should close the preview overlay', () => {
      component.showPreview(graphLink(), hoverEvent());
      httpMock.expectOne(imageUrl);
      fixture.detectChanges();

      component.hidePreview();

      expect(previewPanels()).toHaveLength(0);
    });
  });

  describe('ngOnDestroy', () => {
    it('should close the preview and revoke all created object URLs', () => {
      vi.spyOn(URL, 'createObjectURL').mockReturnValueOnce('blob:graph-7').mockReturnValueOnce('blob:graph-8');
      const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockReturnValue(undefined);
      const png = new Blob(['png'], { type: 'image/png' });
      component.prefetchVisualGraph(graphLink());
      httpMock.expectOne(imageUrl).flush(png);
      component.prefetchVisualGraph(graphLink({ taskId: 8, imageUrl: '/api/tasks/8/graph' }));
      httpMock.expectOne('/api/tasks/8/graph').flush(png);
      component.showPreview(graphLink(), hoverEvent());
      fixture.detectChanges();

      component.ngOnDestroy();

      expect(previewPanels()).toHaveLength(0);
      expect(revokeObjectURL.mock.calls).toStrictEqual([['blob:graph-7'], ['blob:graph-8']]);
    });

    it('should revoke object URLs only once when destroyed twice', () => {
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:graph-7');
      const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockReturnValue(undefined);
      component.prefetchVisualGraph(graphLink());
      httpMock.expectOne(imageUrl).flush(new Blob(['png'], { type: 'image/png' }));
      component.ngOnDestroy();

      component.ngOnDestroy();

      expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:graph-7');
    });
  });

  describe('trackByFn', () => {
    it.each<[string, HTTableRouterLink, string | number]>([
      ['the joined router link', { label: 'Task', routerLink: ['/tasks', 7, 'edit'] }, '/tasks-7-edit'],
      ['the label when the router link is empty', { label: 'Task', routerLink: [] }, 'Task'],
      ['the index when neither router link nor label is set', { routerLink: null }, 3]
    ])('should use %s as key', (_case, link, expected) => {
      const key = component.trackByFn(3, link);

      expect(key).toBe(expected);
    });
  });
});
