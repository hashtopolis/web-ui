import { faHomeAlt, faPlus, faTrash, faEdit, faFilePdf} from '@fortawesome/free-solid-svg-icons';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { InputFiles, Report } from './report';
import pdfMake from 'pdfmake/build/pdfmake';
import { Subject } from 'rxjs';

import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../core/_services/main.config';

// import { ReportConfig } from '../shared/defines/logobase64';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html'
})
@PageTitle(['Show Projects'])
export class ProjectsComponent implements OnInit {
  public isCollapsed = true;
  faHome=faHomeAlt;
  faPlus=faPlus;
  faTrash=faTrash;
  faEdit=faEdit;
  faFilePdf=faFilePdf;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  // public projects: {preprocessorId: number}[] = [];
  public projects: any[] = [];

  public project: any[] = [];

  constructor(
    private modalService: NgbModal,
    private gs: GlobalService,
  ) { }

  ngOnInit(): void {
    this.gs.getAll(SERV.PROJECTS).subscribe((proj: any) => {
      this.projects = proj.values;
      this.dtTrigger.next(void 0);
    });
    const self = this;
    this.dtOptions = {
      dom: 'Bfrtip',
      scrollX: true,
      bStateSave:true,
      destroy: true,
      select: {
        style: 'multi'
        },
      buttons: {
          dom: {
            button: {
              className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
            }
          },
      buttons: [
        {
          text: '↻',
          autoClose: true,
          action: function (e, dt, node, config) {
            self.onRefresh();
          }
        },
        {
          extend: 'collection',
          text: 'Export',
          buttons: [
            {
              extend: 'excelHtml5',
              exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7]
              },
            },
            {
              extend: 'print',
              exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7]
              },
              customize: function ( win ) {
                $(win.document.body)
                    .css( 'font-size', '10pt' )
                $(win.document.body).find( 'table' )
                    .addClass( 'compact' )
                    .css( 'font-size', 'inherit' );
             }
            },
            {
              extend: 'csvHtml5',
              exportOptions: {modifier: {selected: true}},
              select: true,
              customize: function (dt, csv) {
                let data = "";
                for (let i = 0; i < dt.length; i++) {
                  data = "Show Projects\n\n"+  dt;
                }
                return data;
             }
            },
            {
              extend: 'copy',
            }
            ]
          },
          {
          extend: 'collection',
          text: 'Bulk Actions',
          drawCallback: function() {
            const hasRows = this.api().rows({ filter: 'applied' }).data().length > 0;
            $('.buttons-excel')[0].style.visibility = hasRows ? 'visible' : 'hidden'
          },
          buttons: [
                {
                  text: 'Delete Projects(s)',
                  autoClose: true,
                  action: function (e, dt, node, config) {
                  }
                }
             ]
        },
        {
          extend: 'colvis',
          text: 'Column View',
          columns: [ 1, 2, 3, 4, 5, 6, 7 ],
        },
        {
          extend: "pageLength",
          className: "btn-sm"
        }
        ],
      }
    };
  }

  onRefresh(){
    // this.rerender();
    this.ngOnInit();
  }

  getStatus(status: string): string{
    if(status == '0')
      return 'Live';
    else if (status == '1')
      return 'Completed';
    else if (status == '2')
      return 'Archived';
    else
      return 'Cancelled';
  }

  // Start Render PDF

  report = new Report();

  public confreport: any[] = [];

  async renderPDF(id: number){
    this.gs.get(SERV.PROJECTS,id).subscribe((proj: any) => {
      this.project = proj.values;
    });

    const isHeaderAlt = 0; // Vairaible for log; O use alternative logo, 1 use hashtopolis logo

    const project = {
      info: {
        title: 'Hashtopolis Report',
        author: 'xbenyx',
        subject: 'Password Recovery Processes',
        },
      pageSize: 'A4',
      pageMargins: [40, 80, 40, 60],
      userPassword: 555,
      ownerPassword: 'hashtoadmin',
      permissions: {
        printing: 'highResolution', //'lowResolution'
        modifying: false,
        copying: false,
        annotating: true,
        fillingForms: true,
        contentAccessibility: true,
        documentAssembly: true
      },
      // header: function(page) {
      //   if (page != 1 && isHeaderAlt == 1){
      //       return { columns: [{
      //           image: ReportConfig.LOGORED
      //           ,width: 130
      //           ,margin: [25, 15 , 0, 0]
      //         }]}
      //           }
      //   else if (page != 1 && isHeaderAlt == 0){
      //       return { columns: [{
      //           image: ReportConfig.LOGOALT
      //           ,width: 180
      //           ,margin: [25, 15 , 0, 0]
      //         }]}
      //           }
      //     else return false;
      // },
      footer: function(currentPage, pageCount) {
          return {
              margin:10,
              columns: [
              {
                  fontSize: 9,
                  italic: true,
                  text:[
                  {
                  text: 'Page ' + currentPage.toString() + ' of ' + pageCount,
                  }
                  ],
                  alignment: 'center'
              }
              ]
          };
      },
      // background: {
      //     image: await this.getBase64ImageFromURL("../../assets/img/backgroung.png"), width: 600, margin: [0, 520 , 0, 0]
      //   },
      content: [
        {
            image: await this.getBase64ImageFromURL("../../assets/img/letterhead.png"),
            // image: await this.getBase64ImageFromURL("../../assets/img/header_2.png"),
            width: 600,
            alignment: 'center',
            margin: [0, -100 , 0, 0],
        },
        '\n\n\n',
        {
          columns: [
            {
              text: this.confreport[0].title_report,
              color: '#00275b',
              bold: true,
              fontSize: 26,
              alignment: 'left',
              margin: [0, 0, 0, 10],
            }
          ],
        },
        {
          columns: [
            {
              text: 'this.confreport[0].info_cover_body_1',
              color: '#00275b',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 0, 0, 3],
            }
          ],
        },
        {
          columns: [
            {
              text: 'this.confreport[0].info_cover_body_2',
              color: '#00275b',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 0, 0, 3],
            }
          ],
        },
        {
          columns: [
            {
              text: 'this.project[0].reference',
              color: '#00275b',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 0, 0, 3],
            }
          ],
        },
        {
          columns: [
            {
              text: 'this.confreport[0].info_cover_body_3',
              color: '#00275b',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 0, 0, 3],
            }
          ],
        },
        '\n\n\n\n\n\n',
        {
          columns: [
            {
              text: 'this.confreport[0].info_cover_body_4',
              color: '#00275b',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 0, 0, 3],
            }
          ],
        },
        {
          columns: [
            {
              text: 'this.confreport[0].info_cover_body_5',
              color: '#00275b',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 0, 0, 3],
            }
          ],
        },
        {
          columns: [
            {
              text: 'The Hague, '+new Date().toDateString(),
              color: '#00275b',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 0, 0, 3],
            }
          ],
        },
        '\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
        {table: {
          // widths: ['*'],
          body: [
            [
              {
                text: 'this.confreport[0].info_cover_footer_1',
                color: '#aaaaab',
                border: [true, true, false, true],
                margin: [30, 10, 10, 5],
                fontSize: 9,
                alignment: 'center',
              },
              {
                text: 'this.confreport[0].info_cover_footer_2',
                border: [false, true, false, true],
                color: '#aaaaab',
                margin: [70, 10, 10, 5],
                fontSize: 9,
                alignment: 'center',
              },
              {
                text: 'this.confreport[0].info_cover_footer_3',
                border: [false, true, true, true],
                color: '#aaaaab',
                margin: [70, 10, 10, 5],
                fontSize: 9,
                alignment: 'center',
              },
            ],
          ]
         }
        },
        // '\n\n',
        {columns: [
              {
                text: 'Project Description',
                color: '#00275b',
                bold: true,
                fontSize: 14,
                alignment: 'left',
                margin: [0, 0, 0, 3],
                pageBreak: 'before'
              }
          ],
        },
        '\n',
        // this.getInputFilesObject(this.resume.educations),
        {columns: [
          {
            text: this.project[0].project_description,
            color: '#000000',
            bold: true,
            fontSize: 12,
            alignment: 'left',
            margin: [0, 0, 0, 3],
          }
          ],
        },
        '\n\n',
        {columns: [
          {
            text: 'Input Files',
            color: '#00275b',
            bold: true,
            fontSize: 14,
            alignment: 'left',
            margin: [0, 0, 0, 3],
          }
          ],
        },
        '\n',
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function(i, node) {
              return 1;
            },
            vLineWidth: function(i, node) {
              return 1;
            },
            hLineColor: function(i, node) {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: function(i, node) {
              return '#eaeaea';
            },
            hLineStyle: function(i, node) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function(i, node) {
              return 10;
            },
            paddingRight: function(i, node) {
              return 10;
            },
            paddingTop: function(i, node) {
              return 2;
            },
            paddingBottom: function(i, node) {
              return 2;
            },
            fillColor: function(rowIndex, node, columnIndex) {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            body: [
              [
                {
                  text: 'Reference Name',
                  fillColor: '#eaf2f5',
                  border: [false, true, false, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'Hash Mode',
                  border: [false, true, false, true],
                  alignment: 'right',
                  fillColor: '#eaf2f5',
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'Hash Count',
                  border: [false, true, false, true],
                  alignment: 'right',
                  fillColor: '#eaf2f5',
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'Retrieved',
                  border: [false, true, false, true],
                  alignment: 'right',
                  fillColor: '#eaf2f5',
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'Keyspace explored',
                  border: [false, true, false, true],
                  alignment: 'right',
                  fillColor: '#eaf2f5',
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
              ],
              [
                {
                  text: 'cyrborg_robocot',
                  border: [false, false, false, true],
                  margin: [0, 5, 0, 5],
                  alignment: 'center',
                },
                {
                  border: [false, false, false, true],
                  text: '3200',
                  fillColor: '#f5f5f5',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  border: [false, false, false, true],
                  text: '1',
                  fillColor: '#f5f5f5',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  border: [false, false, false, true],
                  text: '0',
                  fillColor: '#f5f5f5',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  border: [false, false, false, true],
                  text: '17,071,868,064',
                  fillColor: '#f5f5f5',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
              ],
            ],
          },
        },
        '\n',
        {columns: [
          {
            text: 'Process Performed',
            color: '#00275b',
            bold: true,
            fontSize: 14,
            alignment: 'left',
            margin: [0, 0, 0, 3],
          }
          ],
        },
        '\n',
      ],
      styles: {
        notesTitle: {
          fontSize: 10,
          bold: true,
          margin: [0, 50, 0, 3],
        },
        notesText: {
          fontSize: 10,
        },
      },
      defaultStyle: {
        columnGap: 20,
      },
    };

    pdfMake.createPdf(project).open();
   }

   getInputFilesObject(inpfiles: InputFiles[]) {
    return {
      table: {
        headerRows: 1,
        body: [
          [
            {
              text: 'Reference Name',
              fillColor: '#eaf2f5',
              border: [false, true, false, true],
              margin: [0, 5, 0, 5],
              textTransform: 'uppercase',
            },
            {
              text: 'Hash Mode',
              border: [false, true, false, true],
              alignment: 'right',
              fillColor: '#eaf2f5',
              margin: [0, 5, 0, 5],
              textTransform: 'uppercase',
            },
            {
              text: 'Hash Count',
              border: [false, true, false, true],
              alignment: 'right',
              fillColor: '#eaf2f5',
              margin: [0, 5, 0, 5],
              textTransform: 'uppercase',
            },
            {
              text: 'Retrieved',
              border: [false, true, false, true],
              alignment: 'right',
              fillColor: '#eaf2f5',
              margin: [0, 5, 0, 5],
              textTransform: 'uppercase',
            },
            {
              text: 'Keyspace explored',
              border: [false, true, false, true],
              alignment: 'right',
              fillColor: '#eaf2f5',
              margin: [0, 5, 0, 5],
              textTransform: 'uppercase',
            }
          ],
          ...inpfiles.map(ed => {
            return [ed.name, ed.hashtypeId, ed.hashCount, ed.cracked, ed.dispatched_keyspace];
          })
        ]
      }
    };
  }

  //  Function creates converts the image in base64, so can be used in the report
  getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;

    });}
  // End Render PDF

    // Modal Information
    closeResult = '';
    open(content) {
      this.modalService.open(content, { size: 'xl' }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
    }

    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return `with: ${reason}`;
      }
    }

}
