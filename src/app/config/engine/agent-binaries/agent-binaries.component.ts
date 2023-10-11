import { faHomeAlt, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject, Subscription } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { GlobalService } from 'src/app/core/_services/main.service';
import { SERV } from '../../../core/_services/main.config';
import { AgentBinary } from 'src/app/core/_models/agent-binary';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

@Component({
  selector: 'app-agent-binaries',
  templateUrl: './agent-binaries.component.html'
})
export class AgentBinariesComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = []
  private maxResults = environment.config.prodApiMaxResults;

  faHome = faHomeAlt;
  faPlus = faPlus;
  faTrash = faTrash;
  faEdit = faEdit;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  binaries: AgentBinary[] = [];


  constructor(private gs: GlobalService, titleService: AutoTitleService) {
    titleService.set(['Show Agent Binaries'])
  }

  /**
   * Initialize the table and load binaries.
   */
  ngOnInit(): void {
    this.setupTable();
    this.loadBinaries();
  }

  /**
   * Unsubscribe from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.dtTrigger.unsubscribe()
  }

  /**
   * Load agent binary data from the server and trigger a change
   */
  loadBinaries(): void {
    const params = { 'maxResults': this.maxResults }
    this.subscriptions.push(this.gs.getAll(SERV.AGENT_BINARY, params).subscribe((bin: any) => {
      this.binaries = bin.values;
      this.dtTrigger.next(void 0);
    }));
  }

  /**
   * Delete an agent binary entity by its unique identifier.
   *
   * @param {number} id - The unique identifier of the binary entity to be deleted.
   */
  deleteBinary(id: number): void {
    this.subscriptions.push(this.gs.delete(SERV.AGENT_BINARY, id).subscribe(() => {
      Swal.fire({
        position: 'top-end',
        backdrop: false,
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      })
      this.loadBinaries();
      this.setupTable();
      this.rerender();
    }))
  }

  /**
   * Configure the DataTables options for the agent binary table.
   */
  setupTable(): void {
    const self = this;
    this.dtOptions = {
      dom: 'Bfrtip',
      scrollX: true,
      pageLength: 25,
      lengthMenu: [
        [10, 25, 50, 100, 250, -1],
        [10, 25, 50, 100, 250, 'All']
      ],
      stateSave: true,
      select: true,
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
                  columns: [0, 1]
                },
              },
              {
                extend: 'print',
                exportOptions: {
                  columns: [0, 1]
                },
                customize: function (win) {
                  $(win.document.body)
                    .css('font-size', '10pt')
                  $(win.document.body).find('table')
                    .addClass('compact')
                    .css('font-size', 'inherit');
                }
              },
              {
                extend: 'csvHtml5',
                exportOptions: { modifier: { selected: true } },
                select: true,
                customize: function (dt, csv) {
                  let data = "";
                  for (let i = 0; i < dt.length; i++) {
                    data = "Agent Binaries\n\n" + dt;
                  }
                  return data;
                }
              },
              'copy'
            ]
          }
        ],
      }
    };
  }

  /**
   * Handles the refresh action for the agent binary table.
   */
  onRefresh() {
    this.rerender();
    this.loadBinaries();
    this.setupTable();
  }

  /**
   * Rerender the DataTable instance to update the displayed data.
   */
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      setTimeout(() => {
        if (this.dtTrigger['new']) {
          this.dtTrigger['new'].next();
        }
      });
    });
  }

  /**
   * Handles the deletion of a agent binary entity with user confirmation.
   *
   * @param {number} id - The unique identifier of the binary entity to be deleted.
   * @param {string} name - The name or description of the binary entity.
   */
  onDelete(id: number, name: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: 'Remove ' + name + ' from your Binaries?',
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonColor: '#8A8584',
      confirmButtonColor: '#C53819',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteBinary(id)
      } else {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your Binary is safe!",
          icon: "error",
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }
}
