import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-report-builder',
  templateUrl: './report-builder.component.html'
})
export class ReportBuilderComponent implements OnInit {
  @Input() templateName: string;
  @Input() reportData;
  reportForm: FormGroup;
  templates: any = {};

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
    const template = this.templates[this.templateName];
    if (!template) {
      console.error('Template not found');
      return;
    }

    const coverPageTemplate = template.cover_page;

    this.reportForm = this.formBuilder.group({
      cover_page: ['' || true],
      cover_page_letter_head: ['' || true],
      cover_page_background: ['' || true],
      title: ['' || coverPageTemplate?.title],
      location: ['' || coverPageTemplate?.location],
      project_name: ['' || coverPageTemplate?.project_name],
      project_description: ['' || coverPageTemplate?.project_description],
      reference: ['' || coverPageTemplate?.reference],
      info_header_text: ['' || coverPageTemplate?.info_header_text],
      info_cover_body_1: ['' || coverPageTemplate?.info_cover_body_1],
      info_cover_body_2: ['' || coverPageTemplate?.info_cover_body_2],
      info_cover_body_3: ['' || coverPageTemplate?.info_cover_body_3],
      info_cover_body_4: ['' || coverPageTemplate?.info_cover_body_4],
      info_cover_body_5: ['' || coverPageTemplate?.info_cover_body_5],
      info_cover_footer_1: ['' || coverPageTemplate?.info_cover_footer_1],
      info_cover_footer_2: ['' || coverPageTemplate?.info_cover_footer_2],
      info_cover_footer_3: ['' || coverPageTemplate?.info_cover_footer_3],
      userpassword: ['' || template?.userpassword],
      ownerpassword: ['' || template?.ownerpassword]
    });
  }

  get formControls() {
    return this.reportForm.controls;
  }

  async loadTemplate(templateName: string): Promise<void> {
    try {
      const template = await this.http
        .get(`assets/report-templates/${templateName}.json`)
        .toPromise();
      this.templates[templateName] = template;
      this.populateFormWithDefaults();
    } catch (error) {
      console.error('Error loading template:', error);
    }
  }

  onSubmit() {
    // Check if the form is valid
    if (this.reportForm.valid) {
      // Call renderPDF method with form values
      this.renderPDF(this.reportForm.value);
    } else {
      this.reportForm.markAllAsTouched();
    }
  }

  async renderPDF(formValues: any) {
    const coverpage = [];
    const coverpage_letterhead = [];
    const backgroundImage = [];
    const projectContent = [];
    const content = [];

    const coverPagetitleStyle = {
      color: '#00275b',
      bold: true,
      fontSize: 26,
      alignment: 'left',
      margin: [0, 0, 0, 10]
    };

    const titleStyle = {
      color: '#00275b',
      bold: true,
      fontSize: 14,
      alignment: 'left',
      margin: [0, 0, 0, 5]
    };

    const subtitleStyle = {
      color: '#000000',
      bold: true,
      fontSize: 13,
      alignment: 'left',
      margin: [0, 0, 0, 3]
    };

    const textStyle = {
      color: '#000000',
      bold: false,
      fontSize: 12,
      alignment: 'left'
    };

    const tableHeaderStyle = {
      fillColor: '#eaf2f5',
      border: [false, true, false, true],
      margin: [0, 5, 0, 5],
      textTransform: 'uppercase'
    };

    const tableRowStyle = {
      border: [false, true, false, true],
      alignment: 'right',
      fillColor: '#eaf2f5',
      margin: [0, 5, 0, 5],
      textTransform: 'uppercase'
    };

    if (formValues.cover_page) {
      if (formValues.cover_page) {
        if (formValues.info_header_text) {
          // coverpage.push({
          //   // Use unshift to add the text at the beginning of the array
          //   text: formValues.info_header_text,
          //   alignment: 'center',
          //   margin: [0, 0, 0, 0], // Adjust top margin as needed
          //   fontSize: 12,
          //   bold: true
          // });
        }
      }

      coverpage.push(
        '\n\n\n\n',
        {
          columns: [{ text: formValues.title, ...coverPagetitleStyle }]
        },
        {
          columns: [{ text: formValues.info_cover_body_1, ...titleStyle }]
        },
        {
          columns: [{ text: formValues.info_cover_body_2, ...titleStyle }]
        },
        {
          columns: [{ text: formValues.reference, ...titleStyle }]
        },
        {
          columns: [{ text: formValues.info_cover_body_3, ...titleStyle }]
        },
        '\n\n\n\n\n\n\n',
        {
          columns: [{ text: formValues.info_cover_body_4, ...titleStyle }]
        },
        {
          columns: [{ text: formValues.info_cover_body_5, ...titleStyle }]
        },
        {
          columns: [
            {
              text: formValues.location + new Date().toDateString(),
              ...titleStyle
            }
          ]
        },
        '\n\n\n\n\n\n\n\n\n\n\n\n'
      );

      if (
        formValues.info_cover_footer_1 ||
        formValues.info_cover_footer_2 ||
        formValues.info_cover_footer_3
      ) {
        const footerRow = [];

        if (formValues.info_cover_footer_1) {
          footerRow.push({
            text: formValues.info_cover_footer_1,
            color: '#aaaaab',
            border: [true, true, false, true],
            margin: [30, 10, 10, 5],
            fontSize: 9,
            alignment: 'center'
          });
        }

        if (formValues.info_cover_footer_2) {
          footerRow.push({
            text: formValues.info_cover_footer_2,
            border: [false, true, false, true],
            color: '#aaaaab',
            margin: [70, 10, 10, 5],
            fontSize: 9,
            alignment: 'center'
          });
        }

        if (formValues.info_cover_footer_3) {
          footerRow.push({
            text: formValues.info_cover_footer_3,
            border: [false, true, true, true],
            color: '#aaaaab',
            margin: [70, 10, 10, 5],
            fontSize: 9,
            alignment: 'center'
          });
        }

        coverpage.push({
          table: {
            body: [footerRow]
          }
        });
      }
    }

    if (formValues.cover_page_letter_head && formValues.cover_page) {
      coverpage_letterhead.push({
        image: await this.getBase64ImageFromURL(
          '../../assets/img/letterhead.png'
        ),
        width: 600,
        alignment: 'center',
        margin: [0, -100, 0, 0]
      });
    }

    if (formValues.cover_page_background && formValues.cover_page) {
      // backgroundImage.push({
      //   background: {
      //     image: await this.getBase64ImageFromURL(
      //       '../../assets/img/background.png'
      //     ),
      //     width: 600,
      //     margin: [0, 520, 0, 0]
      //   }
      // });
    }

    // Check if project description exists
    if (formValues.project_name && formValues.project_description) {
      projectContent.push(
        {
          columns: [{ text: formValues.project_name, ...titleStyle }]
        },
        '\n',
        {
          columns: [{ text: formValues.project_description, ...textStyle }]
        },
        '\n'
      );
    }

    // Iterate over each element in the report array
    this.reportData.forEach((item) => {
      if (item.title) {
        content.push({
          text: item.title,
          ...titleStyle
        });
      }

      if (item.subtitle) {
        content.push({
          text: item.subtitle,
          ...subtitleStyle
        });
      }

      if (item.break) {
        // If item.break exists, add the appropriate number of line breaks
        const breakline = '\n'.repeat(item.break);
        content.push(breakline);
      }

      if (item.ul) {
        // if list exist
        content.push({
          ul: item.ul
        });
      }

      if (item.table) {
        // If the item has a table, construct the table
        const { tableColumns, tableValues } = item.table;
        const tableHeaderRow = tableColumns.map((column) => ({
          text: column,
          ...tableHeaderStyle
        }));
        const tableBodyRow = tableValues.map((value) => ({
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

    const project = {
      info: {
        title: 'Hashtopolis Report',
        author: 'xbenyx',
        subject: 'Password Recovery'
      },
      pageSize: 'A4',
      pageMargins: [40, 80, 40, 60],
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
      footer: function (currentPage, pageCount) {
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
      content: [
        ...coverpage_letterhead,
        ...coverpage,
        ...projectContent,
        ...content
      ],
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
  }

  //  Function creates converts the image in base64, so can be used in the report
  getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }
}
