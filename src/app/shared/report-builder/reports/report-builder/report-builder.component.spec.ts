import pdfMake from 'pdfmake/build/pdfmake';
import { of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { ReportBuilderComponent } from '@src/app/shared/report-builder/reports/report-builder/report-builder.component';
import {
  ReportDataProvider,
  ReportFormValues,
  ReportTemplate
} from '@src/app/shared/report-builder/reports/report-builder/report.models';

describe('ReportBuilderComponent', () => {
  let component: ReportBuilderComponent;
  let fixture: ComponentFixture<ReportBuilderComponent>;
  let http: MockedObject<HttpClient>;
  let reportData: MockedObject<ReportDataProvider>;
  let template: ReportTemplate;

  beforeEach(async () => {
    http = { get: vi.fn().mockName('HttpClient.get') } as unknown as MockedObject<HttpClient>;
    reportData = { getOriginalData: vi.fn().mockName('ReportDataProvider.getOriginalData') };
    reportData.getOriginalData.mockReturnValue([]);
    template = {
      settings: {
        userpassword: 'user-secret',
        ownerpassword: 'owner-secret',
        info_header_text: { text: 'Confidential', startAt: 2 },
        global_style: {
          title: { bold: true },
          subtitle: { fontSize: 12 },
          tables: { tableHeader: { fillColor: 'red' } }
        },
        img_logo: { enable: false },
        img_background: { enable: false }
      },
      cover_page: {
        title: { text: 'Report', gapPos: 'top', gapLines: 1 },
        location_date: { text: 'Berlin', gapPos: 'bottom', gapLines: 1 },
        info_cover_footer_1: { text: 'First' },
        info_cover_footer_2: { text: 'Second' },
        info_cover_footer_3: { text: 'Third' }
      },
      pages: {
        project_name: { text: 'Project' },
        project_description: { text: 'Description' }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ReportBuilderComponent],
      providers: [FormBuilder, { provide: HttpClient, useValue: http }]
    })
      .overrideComponent(ReportBuilderComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(ReportBuilderComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('templateName', 'default');
    fixture.componentRef.setInput('reportData', reportData);
  });

  it('loads the named template and initializes the form with its defaults', async () => {
    http.get.mockReturnValue(of(template));

    await component.ngOnInit();

    expect(http.get).toHaveBeenCalledExactlyOnceWith('assets/report-templates/default.json');
    expect(component.templates['default']).toBe(template);
    expect(component.isLoaded).toBe(true);
    expect(component.reportForm.value).toStrictEqual({
      cover_page: true,
      cover_page_letter_head: true,
      title: 'Report',
      info_header_text: 'Confidential',
      info_cover_body_1: null,
      info_cover_body_2: null,
      reference: null,
      info_cover_body_3: null,
      info_cover_body_4: null,
      info_cover_body_5: null,
      location_date: 'Berlin',
      info_cover_footer_1: 'First',
      info_cover_footer_2: 'Second',
      info_cover_footer_3: 'Third',
      project_name: 'Project',
      project_description: 'Description',
      userpassword: 'user-secret',
      ownerpassword: 'owner-secret'
    });
  });

  it('reports a missing template name without making a request', async () => {
    fixture.componentRef.setInput('templateName', '');
    const error = vi.spyOn(console, 'error').mockReturnValue(undefined);

    await component.ngOnInit();

    expect(error).toHaveBeenCalledExactlyOnceWith('Template name is required');
    expect(http.get).not.toHaveBeenCalled();
    expect(component.isLoaded).toBe(false);
  });

  it('reports a template loading error and leaves the form unloaded', async () => {
    const failure = new Error('Request failed');
    http.get.mockReturnValue(throwError(() => failure));
    const error = vi.spyOn(console, 'error').mockReturnValue(undefined);

    await component.ngOnInit();

    expect(error).toHaveBeenCalledExactlyOnceWith('Error loading template:', failure);
    expect(component.isLoaded).toBe(false);
    expect(component.templates['default']).toBeUndefined();
  });

  it('submits the current form values to the PDF renderer', () => {
    component.templates['default'] = template;
    component.populateFormWithDefaults();
    component.reportForm.patchValue({ title: 'Edited title' });
    const render = vi.spyOn(component, 'renderPDF').mockResolvedValue(undefined);
    const values = component.reportForm.value as ReportFormValues;

    component.onSubmit();

    expect(render).toHaveBeenCalledExactlyOnceWith(values);
  });

  it('builds a document from cover, project and report sections', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
      template.cover_page = {
        title: template.cover_page['title'],
        info_cover_body_1: { text: 'Default cover body' },
        location_date: template.cover_page['location_date'],
        info_cover_footer_1: template.cover_page['info_cover_footer_1'],
        info_cover_footer_2: template.cover_page['info_cover_footer_2'],
        info_cover_footer_3: template.cover_page['info_cover_footer_3']
      };
      component.templates['default'] = template;
      component.populateFormWithDefaults();
      component.reportForm.patchValue({
        title: 'Edited cover title',
        info_cover_body_1: 'Edited cover body',
        info_cover_footer_2: '',
        project_name: 'Edited project'
      });
      reportData.getOriginalData.mockReturnValue([
        { title: 'Summary' },
        { subtitle: 'Details', ul: [{ text: 'Item', margin: [0, 0, 0, 0] }] },
        { break: 2 },
        { title: 'Results', table: { tableColumns: ['Name', 'Count'], tableValues: ['Found', 3] } }
      ]);
      const open = vi.fn().mockName('pdf.open');
      const createPdf = vi.spyOn(pdfMake, 'createPdf').mockReturnValue({ open } as never);

      await component.renderPDF(component.reportForm.value as ReportFormValues);

      expect(open).toHaveBeenCalledExactlyOnceWith();
      expect(createPdf).toHaveBeenCalledTimes(1);
      const document = createPdf.mock.calls[0][0];
      expect(document.pageSize).toBe('A4');
      expect(document.pageMargins).toStrictEqual([40, 80, 40, 60]);
      expect(document).not.toHaveProperty('background');
      expect(document.userPassword).toBe('user-secret');
      expect(document.ownerPassword).toBe('owner-secret');
      expect(document.content).toStrictEqual([
        [{ text: '\n' }, { columns: [{ text: 'Report', gapPos: 'top', gapLines: 1 }] }],
        { columns: [{ text: 'Default cover body' }] },
        [{ columns: [{ text: 'Berlin Sat Jun 15 2024', gapPos: 'bottom', gapLines: 1 }] }, { text: '\n' }],
        [{ table: { body: [[{ text: 'First' }, { text: 'Third' }]] } }],
        { columns: [{ text: 'Edited project' }] },
        { columns: [{ text: 'Description' }] },
        { text: 'Summary', bold: true },
        { text: 'Details', fontSize: 12 },
        { ul: [{ text: 'Item', margin: [0, 0, 0, 0] }] },
        '\n\n',
        { text: 'Results', bold: true },
        {
          table: {
            headerRows: 1,
            body: [
              [
                { text: 'Name', fillColor: 'red' },
                { text: 'Count', fillColor: 'red' }
              ],
              [
                { text: 'Found', border: [false, true, false, true] },
                { text: 3, border: [false, true, false, true] }
              ]
            ]
          }
        }
      ]);
      expect(document.header!(1, 2)).toBeNull();
      expect(document.header!(2, 2)).toStrictEqual([{ text: 'Confidential', startAt: 2 }]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('omits the cover when disabled and supports empty report data', async () => {
    component.templates['default'] = template;
    template.pages = {};
    component.populateFormWithDefaults();
    component.reportForm.patchValue({ cover_page: false });
    const createPdf = vi.spyOn(pdfMake, 'createPdf').mockReturnValue({ open: vi.fn() } as never);

    await component.renderPDF(component.reportForm.value as ReportFormValues);

    expect(createPdf.mock.calls[0][0].content).toStrictEqual([]);
    expect(reportData.getOriginalData).toHaveBeenCalledExactlyOnceWith();
  });

  it('renders the same image-bearing template twice with the original paths and output', async () => {
    template.cover_page['img_letterhead'] = { img_path: 'letterhead.png', enable: true };
    template.pages['img_chart'] = { img_path: 'chart.png' };
    template.settings.img_logo = { img_path: 'logo.png', enable: true, width: 40 };
    template.settings.img_background = { img_path: 'background.png', enable: true };
    template.settings.pageSize = 'A3';
    template.settings.pageMargins = [10, 20, 30, 40];
    component.templates['default'] = template;
    component.populateFormWithDefaults();
    component.reportForm.patchValue({ info_header_text: 'Internal' });
    const encode = vi.spyOn(component, 'getBase64ImageFromURL').mockImplementation(async (url) => `encoded:${url}`);
    const createPdf = vi.spyOn(pdfMake, 'createPdf').mockReturnValue({ open: vi.fn() } as never);

    for (const renderIndex of [0, 1]) {
      await component.renderPDF(component.reportForm.value as ReportFormValues);

      expect(encode.mock.calls.slice(renderIndex * 4)).toStrictEqual([
        ['../../assets/img/letterhead.png'],
        ['../../assets/img/chart.png'],
        ['../../assets/img/logo.png'],
        ['../../assets/img/background.png']
      ]);
      expect(createPdf).toHaveBeenCalledTimes(renderIndex + 1);
      const document = createPdf.mock.calls[renderIndex][0];
      expect(document.pageSize).toBe('A3');
      expect(document.pageMargins).toStrictEqual([10, 20, 30, 40]);
      expect(document.content).toContainEqual([{ image: 'encoded:../../assets/img/letterhead.png', enable: true }]);
      expect(document.content).toContainEqual({
        columns: [expect.objectContaining({ image: 'encoded:../../assets/img/chart.png' })]
      });
      expect(document).toMatchObject({ background: { image: 'encoded:../../assets/img/background.png' } });
      expect(document.header!(1, 2)).toBeNull();
      expect(document.header!(2, 2)).toStrictEqual([
        { image: 'encoded:../../assets/img/logo.png', enable: true, width: 40 },
        { text: 'Internal', startAt: 2 }
      ]);
    }
  });

  it('reports an image encoding error without creating a PDF', async () => {
    template.cover_page['img_letterhead'] = { img_path: 'letterhead.png' };
    component.templates['default'] = template;
    component.populateFormWithDefaults();
    const failure = new Error('Image unavailable');
    vi.spyOn(component, 'getBase64ImageFromURL').mockRejectedValue(failure);
    const error = vi.spyOn(console, 'error').mockReturnValue(undefined);
    const createPdf = vi.spyOn(pdfMake, 'createPdf').mockReturnValue(undefined as never);

    await component.renderPDF(component.reportForm.value as ReportFormValues);

    expect(error).toHaveBeenCalledExactlyOnceWith('Error rendering PDF:', failure);
    expect(createPdf).not.toHaveBeenCalled();
  });

  it('reports PDF generation errors without opening a document', async () => {
    component.templates['default'] = template;
    component.populateFormWithDefaults();
    const failure = new Error('Data unavailable');
    reportData.getOriginalData.mockImplementation(() => {
      throw failure;
    });
    const error = vi.spyOn(console, 'error').mockReturnValue(undefined);
    const createPdf = vi.spyOn(pdfMake, 'createPdf').mockReturnValue(undefined as never);

    await component.renderPDF(component.reportForm.value as ReportFormValues);

    expect(error).toHaveBeenCalledExactlyOnceWith('Error rendering PDF:', failure);
    expect(createPdf).not.toHaveBeenCalled();
  });

  it('converts a successfully fetched image to a data URL', async () => {
    const blob = new Blob(['image data'], { type: 'image/png' });
    const fetchImage = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      blob: async () => blob
    } as Response);

    const result = await component.getBase64ImageFromURL('/image.png');

    expect(fetchImage).toHaveBeenCalledExactlyOnceWith('/image.png');
    expect(result).toBe('data:image/png;base64,aW1hZ2UgZGF0YQ==');
  });

  it('rejects an empty image URL without fetching it', async () => {
    const fetchImage = vi.spyOn(globalThis, 'fetch').mockReturnValue(undefined as never);
    const error = vi.spyOn(console, 'error').mockReturnValue(undefined);

    await expect(component.getBase64ImageFromURL('')).rejects.toThrow('Image URL is undefined');

    expect(fetchImage).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledExactlyOnceWith('Error fetching image:', expect.any(Error));
  });

  it('rejects an unsuccessful image response with its HTTP status', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' } as Response);
    const error = vi.spyOn(console, 'error').mockReturnValue(undefined);

    await expect(component.getBase64ImageFromURL('/missing.png')).rejects.toThrow(
      'Failed to fetch image: 404 Not Found'
    );

    expect(error).toHaveBeenCalledExactlyOnceWith('Error fetching image:', expect.any(Error));
  });

  it('propagates a network failure while fetching an image', async () => {
    const failure = new Error('Network unavailable');
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(failure);
    const error = vi.spyOn(console, 'error').mockReturnValue(undefined);

    await expect(component.getBase64ImageFromURL('/image.png')).rejects.toThrow(failure);

    expect(error).toHaveBeenCalledExactlyOnceWith('Error fetching image:', failure);
  });
});
