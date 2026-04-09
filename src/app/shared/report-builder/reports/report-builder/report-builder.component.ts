import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
import { firstValueFrom } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
  CoverPageElement,
  PdfCoverTextElement,
  ReportDataProvider,
  ReportFormValues,
  ReportHeaderText,
  ReportImageConfig,
  ReportSection,
  ReportTemplate
} from './report.models';

pdfMake.vfs = vfsFonts.vfs;

@Component({
  selector: 'app-report-builder',
  templateUrl: './report-builder.component.html',
  standalone: false
})
export class ReportBuilderComponent implements OnInit {
  @Input() templateName: string;
  @Input() reportData: ReportDataProvider;

  reportForm: FormGroup;
  templates: Record<string, ReportTemplate> = {};
  isLoaded = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.templateName) {
      await this.loadTemplate(this.templateName); // Wait for the template to be loaded
    } else {
      console.error('Template name is required');
    }
  }

  populateFormWithDefaults() {
    const coverPageTemplate = this.templates[this.templateName].cover_page;

    this.reportForm = this.formBuilder.group({
      cover_page: [true],
      cover_page_letter_head: [true],
      title: [(coverPageTemplate?.['title'] as PdfCoverTextElement | undefined)?.text],
      info_header_text: [this.templates[this.templateName]?.settings.info_header_text?.text],
      info_cover_body_1: [(coverPageTemplate?.['info_cover_body_1'] as PdfCoverTextElement | undefined)?.text],
      info_cover_body_2: [(coverPageTemplate?.['info_cover_body_2'] as PdfCoverTextElement | undefined)?.text],
      reference: [(coverPageTemplate?.['reference'] as PdfCoverTextElement | undefined)?.text],
      info_cover_body_3: [(coverPageTemplate?.['info_cover_body_3'] as PdfCoverTextElement | undefined)?.text],
      info_cover_body_4: [(coverPageTemplate?.['info_cover_body_4'] as PdfCoverTextElement | undefined)?.text],
      info_cover_body_5: [(coverPageTemplate?.['info_cover_body_5'] as PdfCoverTextElement | undefined)?.text],
      location_date: [(coverPageTemplate?.['location_date'] as PdfCoverTextElement | undefined)?.text],
      info_cover_footer_1: [(coverPageTemplate?.['info_cover_footer_1'] as PdfCoverTextElement | undefined)?.text],
      info_cover_footer_2: [(coverPageTemplate?.['info_cover_footer_2'] as PdfCoverTextElement | undefined)?.text],
      info_cover_footer_3: [(coverPageTemplate?.['info_cover_footer_3'] as PdfCoverTextElement | undefined)?.text],
      project_name: [
        (this.templates[this.templateName]?.pages?.['project_name'] as PdfCoverTextElement | undefined)?.text
      ],
      project_description: [
        (this.templates[this.templateName]?.pages?.['project_description'] as PdfCoverTextElement | undefined)?.text
      ],
      userpassword: [this.templates[this.templateName]?.settings.userpassword],
      ownerpassword: [this.templates[this.templateName]?.settings.ownerpassword]
    });
    this.isLoaded = true;
  }

  get formControls() {
    return this.reportForm.controls;
  }

  async loadTemplate(templateName: string): Promise<void> {
    try {
      this.templates[templateName] = await firstValueFrom(
        this.http.get<ReportTemplate>(`assets/report-templates/${templateName}.json`)
      );
      this.populateFormWithDefaults();
    } catch (error) {
      console.error('Error loading template:', error);
    }
  }

  onSubmit() {
    this.renderPDF(this.reportForm.value as ReportFormValues);
  }

  async renderPDF(formValues: ReportFormValues) {
    try {
      const coverpage: unknown[] = [];
      const coverpage_letterhead: unknown[] = [];
      const backgroundImage: unknown[] = [];
      const pages: unknown[] = [];
      const content: unknown[] = [];

      const globalStyles = this.templates[this.templateName]?.settings.global_style;

      if (formValues.cover_page) {
        const coverPageData = this.templates[this.templateName].cover_page;

        const encodeData: Record<string, CoverPageElement> = { ...coverPageData };
        // Iterate Encode images
        for (const key of Object.keys(encodeData)) {
          if (key.startsWith('img_')) {
            const imgElement = encodeData[key] as ReportImageConfig;
            const imagePath = '../../assets/img/' + imgElement.img_path;
            imgElement.image = await this.getBase64ImageFromURL(imagePath);
            delete imgElement.img_path;
          }
        }
        // Construct footer
        const footerRow: unknown[] = [];
        for (const key of Object.keys(encodeData)) {
          const formData = formValues[key as keyof ReportFormValues];
          const footerItem = encodeData[key];

          if (key.startsWith('info_cover_footer')) {
            (footerItem as PdfCoverTextElement).text = formData as string;
            if (formData) {
              footerRow.push(footerItem);
            }
          }
        }

        // Remove specific footer items from encodeData
        delete encodeData['info_cover_footer_1'];
        delete encodeData['info_cover_footer_2'];
        delete encodeData['info_cover_footer_3'];

        const coverPageContent: unknown[] = Object.keys(encodeData).map((key) => {
          const formData = formValues[key as keyof ReportFormValues];
          const defaultData = encodeData[key]; // Assuming coverPage is the default template data
          // Create a new object to hold the modified data
          const textData: CoverPageElement = { ...defaultData };
          // Letter head
          if (
            !formValues.cover_page_letter_head &&
            key.startsWith('img_') &&
            (textData as ReportImageConfig)?.enable === false
          ) {
            delete encodeData[key];
          }
          // If formData has a text property, overwrite the text property in textData
          if (
            (typeof formData === 'string' || typeof formData === 'number') &&
            key !== 'userpassword' &&
            key !== 'ownerpassword' &&
            key.startsWith('img_')
          ) {
            // If formData is a string or number and key is not 'userpassword' or 'ownerpassword', use it for text
            (textData as PdfCoverTextElement).text = String(formData);
          }

          if (key === 'location_date') {
            // For the 'location_date' key, append the current date if formData is not a boolean
            (textData as PdfCoverTextElement).text += ' ' + new Date().toDateString();
          }

          // Check if defaultData has gapLines and add it below the columns
          if ('gapPos' in textData && textData.gapPos === 'top') {
            return [{ text: '\n'.repeat(textData.gapLines as number) }, { columns: [textData] }];
          } else if ('gapPos' in textData && textData.gapPos === 'bottom') {
            return [{ columns: [textData] }, { text: '\n'.repeat(textData.gapLines as number) }];
          } else if (key.startsWith('img_')) {
            return [textData];
          } else {
            return { columns: [textData] };
          }
        });
        coverPageContent.push([{ table: { body: [footerRow] } }]);
        coverpage.push(...coverPageContent);
      }

      // Pages object
      const pagesData = this.templates[this.templateName].pages;

      const pagesProcess: Record<string, CoverPageElement> = { ...pagesData };
      // Encode images in pages
      for (const key of Object.keys(pagesProcess)) {
        if (key.startsWith('img_')) {
          const imgElement = pagesProcess[key] as ReportImageConfig;
          const imagePath = '../../assets/img/' + imgElement.img_path;
          imgElement.image = await this.getBase64ImageFromURL(imagePath);
          delete imgElement.img_path;
        }
      }

      const pagesContent = Object.keys(pagesProcess).map((key) => {
        const formData = formValues[key as keyof ReportFormValues];
        const defaultData = pagesProcess[key];
        // Create a new object to hold the modified data
        const textData: CoverPageElement = { ...defaultData };

        // Delete project_name and project_description if they don't exist in formValues
        if (!formValues.project_name || !formValues.project_description) {
          delete (textData as Record<string, unknown>)['project_name'];
          delete (textData as Record<string, unknown>)['project_description'];
        } else {
          (textData as PdfCoverTextElement).text = formData as string;
        }

        // Check if defaultData has gapLines and add it below the columns
        if ('gapPos' in textData && textData.gapPos === 'top') {
          return [{ text: '\n'.repeat(textData.gapLines as number) }, { columns: [textData] }];
        } else if ('gapPos' in textData && textData.gapPos === 'bottom') {
          return [{ columns: [textData] }, { text: '\n'.repeat(textData.gapLines as number) }];
        } else {
          return { columns: [textData] };
        }
      });

      pages.push(...pagesContent);

      // Iterate over each element in the report array
      this.reportData.getOriginalData().forEach((item: ReportSection) => {
        if ('title' in item) {
          content.push({
            text: item.title,
            ...globalStyles?.['title']
          });
        }

        if ('subtitle' in item) {
          content.push({
            text: item.subtitle,
            ...globalStyles?.['subtitle']
          });
        }

        if ('break' in item) {
          // If item.break exists, add the appropriate number of line breaks
          const breakline = '\n'.repeat(item.break);
          content.push(breakline);
        }

        if ('ul' in item && item.ul) {
          // if list exist
          content.push({
            ul: item.ul
          });
        }

        if ('table' in item) {
          // If the item has a table, construct the table
          const { tableColumns, tableValues } = item.table;
          const tableHeaderRow = tableColumns.map((column: string) => ({
            text: column,
            ...globalStyles?.tables?.tableHeader
          }));
          const tableBodyRow = tableValues.map((value: unknown) => ({
            text: value,
            border: [false, true, false, true]
          }));
          const table = {
            table: {
              headerRows: 1,
              body: [tableHeaderRow, tableBodyRow]
            }
          };
          content.push(table);
        }
      });

      // Page Settings
      const pageSettings = this.templates[this.templateName]?.settings;
      const headerLogo: ReportImageConfig = { ...pageSettings.img_logo };
      const backgroundImg: ReportImageConfig = { ...pageSettings.img_background };
      let _bg: { background?: ReportImageConfig } = {};

      // Page header
      const headerText: ReportHeaderText = { ...pageSettings.info_header_text };

      // Encode logo image
      const imagePath = '../../assets/img/';
      if (formValues.cover_page && headerLogo.enable) {
        headerLogo.image = await this.getBase64ImageFromURL(imagePath + headerLogo.img_path);
        delete headerLogo.img_path;
      }

      // Encode background image and add it to the bg object
      if (backgroundImg.enable) {
        backgroundImg.image = await this.getBase64ImageFromURL(imagePath + backgroundImg.img_path);
        delete backgroundImg.img_path;

        _bg = { background: { ...backgroundImg } };
      }

      const project: Record<string, unknown> = {
        // pdfMake document definition
        info: {
          title: 'Hashtopolis Report',
          author: 'xbenyx',
          subject: 'Password Recovery'
        },
        pageSize: pageSettings.pageSize || 'A4',
        pageMargins: pageSettings.pageMargins || [40, 80, 40, 60],
        userPassword: formValues.userpassword,
        ownerPassword: formValues.ownerpassword,
        permissions: {
          printing: 'highResolution', //'lowResolution'
          modifying: false,
          copying: false,
          annotating: true,
          fillingForms: true,
          contentAccessibility: true,
          documentAssembly: true
        },
        header: function (currentPage: number, _pageSize: unknown) {
          const headerTextData: ReportHeaderText = { ...headerText };
          const result: (ReportImageConfig | ReportHeaderText)[] = [];

          if (formValues.cover_page && headerLogo.enable && 2 <= currentPage) {
            result.push({ ...headerLogo });
          } else if (!formValues.cover_page && headerLogo.enable && currentPage <= 1) {
            result.push({ ...headerLogo });
          }

          // Check when to start displaying the header text
          if ((headerTextData.startAt ?? 0) <= currentPage) {
            if (typeof formValues.info_header_text === 'string' || typeof formValues.info_header_text === 'number') {
              headerTextData.text = String(formValues.info_header_text);
            }
            result.push({ ...headerTextData });
          }

          // Return the combined result
          return result.length > 0 ? result : null;
        },
        footer: function (currentPage: number, pageCount: number) {
          return {
            margin: 10,
            columns: [
              {
                fontSize: 9,
                italic: true,
                text: [
                  {
                    text: 'Page ' + currentPage.toString() + ' of ' + pageCount
                  }
                ],
                alignment: 'center'
              }
            ]
          };
        },
        ...backgroundImage,
        content: [...coverpage_letterhead, ...coverpage, ...pages, ...content],
        styles: {
          notesTitle: {
            fontSize: 10,
            bold: true,
            margin: [0, 50, 0, 3]
          },
          notesText: {
            fontSize: 10
          }
        },
        defaultStyle: {
          columnGap: 20
        }
      };

      pdfMake.createPdf(project).open();
    } catch (error) {
      console.error('Error rendering PDF:', error);
    }
  }

  /**
   * Fetches an image from the given URL and returns its Base64 representation.
   * @param {string} url - The URL of the image to fetch.
   * @returns {Promise<string>} A promise that resolves with the Base64 representation of the image.
   */
  async getBase64ImageFromURL(url: string): Promise<string> {
    try {
      if (!url) {
        throw new Error('Image URL is undefined');
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  }
}
