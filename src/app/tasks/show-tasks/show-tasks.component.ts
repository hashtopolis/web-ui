import {  faPencil, faEdit, faTrash, faLock, faFileImport, faFileExport, faPlus, faHomeAlt, faArchive, faCopy, faBookmark, faEye, faMicrochip, faCheckCircle, faTerminal, faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from './../../../environments/environment';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject, Subscription } from 'rxjs';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { ModalSubtasksComponent } from './modal-subtasks/modal-subtasks.component';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from '../../core/_services/main.service';
import { SERV } from '../../core/_services/main.config';

declare let $:any;

@Component({
  selector: 'app-show-tasks',
  templateUrl: './show-tasks.component.html'
})
/**
 * ShowTasksComponent is a component that manages and displays all hashlist data.
 *
 * It uses DataTables to display and interact with the tasks data, including exporting, deleting, bulk actions
 * and refreshing the table.
*/
export class ShowTasksComponent implements OnInit, OnDestroy {

  // Font Awesome icons
  faCheckCircle=faCheckCircle;
  faNoteSticky=faNoteSticky;
  faFileImport=faFileImport;
  faFileExport=faFileExport;
  faMicrochip=faMicrochip;
  faTerminal=faTerminal;
  faBookmark=faBookmark;
  faArchive=faArchive;
  faPencil=faPencil;
  faHome=faHomeAlt;
  faTrash=faTrash;
  faEdit=faEdit;
  faLock=faLock;
  faPlus=faPlus;
  faCopy=faCopy;
  faEye=faEye;

  // ViewChild reference to the DataTableDirective
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtTrigger1: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  dtOptions1: any = {};

  // List of tasks ToDo. Change to interface
  alltasks: any = [];

  // Subscriptions to unsubscribe on component destruction
  subscriptions: Subscription[] = []

  private maxResults = environment.config.prodApiMaxResults;

  // View type,filter options
  isArchived: boolean;
  whichView: string;
  isTaskactive = 0;
  currenspeed = 0;

  constructor(
    private titleService: AutoTitleService,
    private modalService: NgbModal,
    private route:ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
    ) {
      titleService.set(['Show Tasks'])
    }

  /**
   * Initializes DataTable and retrieves pretasks.
  */

  ngOnInit(): void {
    this.loadTasks();
    this.setupTable();
  }

  /**
   * Unsubscribes from active subscriptions.
   */
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  // Refresh the data and the DataTable
  onRefresh() {
    this.rerender();
    this.ngOnInit();
  }

  /**
   * Rerender the DataTable.
  */
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      setTimeout(() => {
        this.dtTrigger['new'].next();
      });
    });
  }

  /**
   * Depending on route loads live or archived tasks
   *
  */
  loadTasks(): void {
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

    this.getTasks();
   });
  }

  /**
   * Fetches Tasks and SuperTasks from the server filtering by live or archived
   * Subscribes to the API response and updates the task list.
  */
  getTasks():void {
    const params = {'maxResults': this.maxResults, 'expand': 'crackerBinary,crackerBinaryType,hashlist,assignedAgents', 'filter': 'isArchived='+this.isArchived+''};
    this.subscriptions.push(this.gs.getAll(SERV.TASKS_WRAPPER,{'maxResults': this.maxResults}).subscribe((tw: any) => {
      this.subscriptions.push(this.gs.getAll(SERV.TASKS,params).subscribe((tasks: any) => {
        this.subscriptions.push(this.gs.getAll(SERV.HASHLISTS,{'maxResults': this.maxResults}).subscribe((h: any) => {
        let filtersupert = tw.values.filter(u=> (u.taskType == 1 && u.isArchived === this.isArchived)); // Active SuperTasks
        let supertasks = filtersupert.map(mainObject => {
          const matchObject = h.values.find(element => element.hashlistId === mainObject.hashlistId );
          return { ...mainObject, ...matchObject }
        }) //Join Supertasks from TaskWrapper with Hashlist info
        const addSTinfo = []; //Ass tasktype in tasks
        for(let i=0; i < tw.values.length; i++){
          addSTinfo.push( {taskWrapperId: tw.values[i].taskWrapperId, taskType: tw.values[i].taskType});
        }
        let mergeTasks = tasks.values.map(mainObject => {
          const matchObject = addSTinfo.find(element => element.taskWrapperId === mainObject.taskWrapperId );
          return { ...mainObject, ...matchObject }
        }) // Join Tasks with Taskwrapper information for filtering
        let filtertasks = mergeTasks.filter(u=> (u.taskType == 0 && u.isArchived === this.isArchived)); //Filter Active Tasks remove subtasks
        let prepdata = filtertasks.concat(supertasks); // Join with supertasks
        //Order by Task Priority. filter exclude when is cracked && (a.keyspaceProgress < a.keyspace)
        this.alltasks = prepdata.sort((a, b) => Number(b.priority) - Number(a.priority));
        this.dtTrigger.next(null);
       }));
      }));
    }));
  }

  /**
   * Sets up the DataTable options and buttons.
   * Customizes DataTable appearance and behavior.
  */
  setupTable(): void {
    // DataTables options
    const self = this;
    this.dtOptions = {
      dom: 'Bfrtip',
      scrollX: true,
      pageLength: 25,
      lengthMenu: [
          [10, 25, 50, 100, 250, -1],
          [10, 25, 50, 100, 250, 'All']
      ],
      bStateSave:true,
      destroy: true,
      order: [], // Removes the default order by id. We need it to sort by priority.
      select: {
        style: 'multi',
        // selector: 'tr>td:nth-child(1)' //This only allows select the first row
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
                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
              },
            },
            {
              extend: 'print',
              exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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
                  data = "Show Tasks\n\n"+  dt;
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
             ]
        },
        {
          text: !this.isArchived? 'Show Archived':'Show Live',
          action: function () {
            if(!self.isArchived) {
              self.router.navigate(['tasks/show-tasks-archived']);
            }
            if(self.isArchived){
              self.router.navigate(['tasks/show-tasks']);
            }
          }
        },
        {
          extend: 'colvis',
          text: 'Column View',
          columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
        {
          extend: "pageLength",
          className: "btn-sm"
        }
        ],
      }
    };
  }

  // Refresh the table after a delete operation
  onRefreshTable() {
    setTimeout(() => {
      this.ngOnInit();
      this.rerender();  // Rerender the DataTable
    }, 2000);
  }

  /**
   * Archives a tasks with the given ID.
   *
   * @param {number} id - The ID of the tasks to archive.
   * @param {number} type - The type of the task.
  */
  onArchive(id: number, type: number){
    const path = type === 0 ? SERV.TASKS : SERV.TASKS_WRAPPER;
    this.subscriptions.push(this.gs.archive(path,id).subscribe(() => {
      this.alert.okAlert('Archived!','');
      this.onRefresh();
    }));
  }

  /**
   * Handles the deletion of a tasks.
   * Displays a confirmation dialog and deletes the tasks if confirmed.
   *
   * @param {number} id - The ID of the tasks to delete.
   * @param {number} type - The type of the task.
   * @param {string} name - The name of the tasks.
  */
  onDelete(id: number, type: number, name: string){
      this.alert.deleteConfirmation(name,'Task').then((confirmed) => {
        if (confirmed) {
          // Deletion
          const path = type === 0 ? SERV.TASKS : SERV.TASKS_WRAPPER; //Task or supertask
          this.subscriptions.push(this.gs.delete(path, id).subscribe(() => {
            // Successful deletion
            this.alert.okAlert(`Deleted Task ${name}`, '');
            this.onRefreshTable(); // Refresh the table
          }));
        } else {
          // Handle cancellation
          this.alert.okAlert(`Task ${name} is safe!`,'');
        }
      });
  }

  // Bulk actions

  /**
   * Handles task selection for bulk actions.
   *
   * @returns {number[]} - An array of selected hashlist IDs.
  */

  onSelectedTasks(){
    $(".dt-button-background").trigger("click");
    const selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
    if(selection.length == 0) {
      this.alert.okAlert('You have not selected any Task','');
      return;
    }
    const selectionnum = selection.map(i=>Number(i));

    return selectionnum;
  }

  /**
   * Handles bulk deletion
   * Delete the Tasks showing a progress bar
   *
  */
  async onDeleteBulk() {
    const TasksIds = this.onSelectedTasks();
    const type = String($($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(3).toArray());
    const search = type.includes("SuperTask");
    let path = !search ? SERV.TASKS: SERV.TASKS_WRAPPER;
    this.alert.bulkDeleteAlert(TasksIds,'Hashtypes',path);
    this.onRefreshTable();
  }

  /**
   * Updates the selected tasks with the given value.
   *
   * @param {any} value - The value to update the selected tasks with.
  */
  async onUpdateBulk(value: any) {
    const FilesIds = this.onSelectedTasks();
    const type = String($($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(3).toArray());
    const search = type.includes("SuperTask");
    let path = !search ? SERV.TASKS: SERV.TASKS_WRAPPER;
    this.alert.bulkUpdateAlert(FilesIds,value,'Files',path);
    this.onRefreshTable();
  }

  /**
   * Retrieves subtasks for a given task and opens a modal to display them.
   *
   * @param {string} name - The name of the task.
   * @param {number} id - The ID of the task for which subtasks should be retrieved.
  */
  getSubtasks(name: string, id: number){
    this.subscriptions.push(this.gs.getAll(SERV.TASKS,{'maxResults': this.maxResults, 'filter':'taskWrapperId='+id+'', 'expand':'assignedAgents'}).subscribe((subtasks: any) => {
      const ref = this.modalService.open(ModalSubtasksComponent, { centered: true, size: 'xl'  });
      ref.componentInstance.prep = subtasks.values;
      ref.componentInstance.supertaskid = id;
      ref.componentInstance.title = name;
    }))
  }

  /**
   * Opens a modal dialog to update a project name.
   *
   * @param {string} title - The title of the dialog.
  */
  onModalProject(title: string){
    (async () => {

      $(".dt-button-background").trigger("click");
      const selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
      if(selection.length == 0) {
        this.alert.okAlert('You have not selected any Group','');
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
        const edit = {projectName: +formValues};
        this.onUpdateBulk(edit);
      }

      })()
  }

  /**
   * Opens a modal dialog to update a task's properties.
   *
   * @param {string} title - The title of the dialog.
   * @param {number} id - The ID of the task to be updated.
   * @param {any} cvalue - The current value of the property being updated.
   * @param {boolean} formlabel - Indicates whether the property is a label.
   * @param {string} nameref - The name reference of the property.
   * @param {number} type - The type of the task (0 for regular tasks, 1 for supertasks).
  */
  onModalUpdate(title: string, id: number, cvalue: any, formlabel: boolean, nameref: string, type: number){
    (async () => {

      const { value: formValues } = await Swal.fire({
        title: title + ' - '+ nameref,
        html:
          '<input id="project-input" class="swal2-input" type="number" placeholder="'+cvalue+'">',
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonColor: this.alert.cancelButtonColor,
        confirmButtonColor: this.alert.confirmButtonColor,
        cancelButton: true,
        preConfirm: () => {
          return [
            (<HTMLInputElement>document.getElementById('project-input')).value,
          ]
        }
      })

      if (formValues) {
        if(cvalue !== Number(formValues[0])){
          let update;
          if(formlabel){
            update  = {priority: +formValues};
          }else{
            update  = {maxAgents: +formValues};
          }
          const path = type === 0 ? SERV.TASKS : SERV.TASKS_WRAPPER;
          this.subscriptions.push(this.gs.update(path,id, update).subscribe(() => {
            this.alert.okAlert('Task saved!','');
            this.ngOnInit();
            this.rerender();  // rerender datatables
          }));
        }
      }

    })()
  }

}
