import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faEdit, faTrash, faLock, faFileImport, faFileExport, faPlus, faHomeAlt, faArchive, faCopy, faBookmark, faEye } from '@fortawesome/free-solid-svg-icons';
import { environment } from './../../../environments/environment';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DataTableDirective } from 'angular-datatables';

import { TasksService } from '../../core/_services/tasks/tasks.sevice';

declare let $:any;

@Component({
  selector: 'app-show-tasks',
  templateUrl: './show-tasks.component.html'
})
export class ShowTasksComponent implements OnInit {
  faEdit=faEdit;
  faTrash=faTrash;
  faLock=faLock;
  faFileImport=faFileImport;
  faFileExport=faFileExport;
  faPlus=faPlus;
  faHome=faHomeAlt;
  faArchive=faArchive;
  faCopy=faCopy;
  faBookmark=faBookmark;
  faEye=faEye;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }

  alltasks: any = [];
  isArchived: boolean;
  whichView: string;

  private maxResults = environment.config.prodApiMaxResults

  constructor(
    private tasksService: TasksService,
    private route:ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'show-tasks':
          this.whichView = 'live';
          this.isArchived = false;
        break;

        case 'show-tasks-archived':
          this.whichView = 'archived';
          this.isArchived = true;
        break;

      }

    let params = {'maxResults': this.maxResults, 'expand': 'crackerBinary,crackerBinaryType', 'filter': 'isArchived='+this.isArchived+''}

    this.tasksService.getAlltasks(params).subscribe((tasks: any) => {
      this.alltasks = tasks.values;
      this.dtTrigger.next(void 0);
    });

    const self = this;
    this.dtOptions = {
      dom: 'Bfrtip',
      pageLength: 10,
      stateSave: true,
      destroy: true,
      scrollY: "50vh",
      select: {
        style: 'multi',
        },
      buttons: {
          dom: {
            button: {
              className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
            }
          },
      buttons: [
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
                var data = "";
                for (var i = 0; i < dt.length; i++) {
                  data = "Agents\n\n"+  dt;
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
            var hasRows = this.api().rows({ filter: 'applied' }).data().length > 0;
            $('.buttons-excel')[0].style.visibility = hasRows ? 'visible' : 'hidden'
          },
          buttons: [
                {
                  text: 'Delete Task(s)',
                  autoClose: true,
                  action: function (e, dt, node, config) {
                    self.onDeleteBulk();
                  }
                },
                {
                  text: 'Archive Task(s)',
                  autoClose: true,
                  enabled: !this.isArchived,
                  action: function (e, dt, node, config) {
                    const edit = {isArchived: true};
                    self.onUpdateBulk(edit);
                  }
                },
                {
                  text: 'Assign to Project (under construction)',
                  autoClose: true,
                  enabled: !this.isArchived,
                  action: function ( e, dt, node, config ) {
                    const title = 'Assign to Project'
                    self.onModalProject(title)
                  }
                },
             ]
        }
        ],
      }
    };

 });

}

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      setTimeout(() => {
        this.dtTrigger['new'].next();
      });
    });
  }

  onArchive(id: number){
    this.tasksService.archiveTask(id).subscribe((tasks: any) => {
      Swal.fire({
        title: "Good job!",
        text: "Archived!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
      });
      this.ngOnInit();
      this.rerender();  // rerender datatables
    });
  }

  onDelete(id: number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, it can not be recovered!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#4B5563',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.tasksService.deleteTask(id).subscribe(() => {
          Swal.fire(
            "Task has been deleted!",
            {
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.ngOnInit();
          this.rerender();  // rerender datatables
        });
      } else {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'No worries, your Task is safe!',
          'error'
        )
      }
    });
  }

  // Bulk actions

  onSelectedTasks(){
    $(".dt-button-background").trigger("click");
    let selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
    if(selection.length == 0) {
      Swal.fire({
        title: "You haven't selected any Task",
        type: 'success',
        timer: 1500,
        showConfirmButton: false
      })
      return;
    }
    let selectionnum = selection.map(i=>Number(i));

    return selectionnum;
  }

    onDeleteBulk(){
      const self = this;
      let selectionnum = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
      let sellen = selectionnum.length;
      let errors = [];
      selectionnum.forEach(function (value) {
        Swal.fire('Deleting...'+sellen+' Task(s)...Please wait')
        Swal.showLoading()
      self.tasksService.deleteTask(value)
      .subscribe(
        err => {
          console.log('HTTP Error', err)
          err = 1;
          errors.push(err);
        },
        );
      });
    self.onDone(sellen);
  }

    onUpdateBulk(value: any){
      const self = this;
      let selectionnum = this.onSelectedTasks();
      let sellen = selectionnum.length;
      selectionnum.forEach(function (id) {
        Swal.fire('Updating...'+sellen+' Task(s)...Please wait')
        Swal.showLoading()
      self.tasksService.updateTask(id, value).subscribe(
      );
    });
    self.onDone(sellen);
  }

    onDone(value?: any){
      setTimeout(() => {
        this.ngOnInit();
        this.rerender();  // rerender datatables
        Swal.close();
        Swal.fire({
          title: 'Done!',
          type: 'success',
          timer: 1500,
          showConfirmButton: false
        })
      },3000);
   }

    onModalProject(title: string){
      (async () => {

        $(".dt-button-background").trigger("click");
        let selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
        if(selection.length == 0) {
          Swal.fire({
            title: "You haven't selected any Task",
            type: 'success',
            timer: 1500,
            showConfirmButton: false
          })
          return;
        }

        const { value: formValues } = await Swal.fire({
          title: title,
          html:
            '<input id="project-input" class="swal2-input">',
          focusConfirm: false,
          confirmButtonColor: '#4B5563',
          preConfirm: () => {
            return [
              (<HTMLInputElement>document.getElementById('project-input')).value,
            ]
          }
        })

        if (formValues) {
          let edit = {projectName: +formValues};
          this.onUpdateBulk(edit);
        }

        })()
    }

}
