import { faAlignJustify, faInfoCircle, faMagnifyingGlass, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

declare let options: any;
declare let defaultOptions: any;
declare let parser: any;

@Component({
  selector: 'app-edit-supertasks',
  templateUrl: './edit-supertasks.component.html'
})
@PageTitle(['Edit SuperTasks'])
export class EditSupertasksComponent implements OnInit {

  editMode = false;
  editedSTIndex: number;
  editedST: any // Change to Model

  faEye=faEye;
  faTrash=faTrash;
  faInfoCircle=faInfoCircle;
  faAlignJustify=faAlignJustify;
  faMagnifyingGlass=faMagnifyingGlass;

  constructor(
    private route:ActivatedRoute,
    private gs: GlobalService,
    private router: Router,
  ) { }

  private maxResults = environment.config.prodApiMaxResults

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  viewForm: FormGroup;
  updateForm: FormGroup;
  etForm:FormGroup; //estimation time form
  pretasks: any = [];
  pretasksFiles: any = [];

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedSTIndex = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );

    this.viewForm = new FormGroup({
      supertaskId: new FormControl({value: '', disabled: true}),
      supertaskName: new FormControl({value: '', disabled: true}),
    });

    this.updateForm = new FormGroup({
      pretasks: new FormControl('')
    });

    this.etForm = new FormGroup({
      benchmarka0: new FormControl(null || 0),
      benchmarka3: new FormControl(null || 0),
    });

    setTimeout(() => {
      this.fetchPreTaskData();
     }, 1000);
  }

  onSubmit(){
    if (this.updateForm.valid) {

      this.gs.update(SERV.SUPER_TASKS,this.editedSTIndex,this.updateForm.value).subscribe(() => {
          Swal.fire({
            title: "Success",
            text: "SuperTask updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.updateForm.reset(); // success, we reset form
          this.router.navigate(['/tasks/supertasks']);
        }
      );
    }
  }

  ngAfterViewInit() {

    const params = { 'maxResults': this.maxResults};
    this.gs.get(SERV.SUPER_TASKS,this.editedSTIndex,{'expand':'pretasks'}).subscribe((res)=>{
    this.gs.getAll(SERV.PRETASKS,params).subscribe((htypes: any) => {
      const self = this;
      const response =  this.getAvalPretasks(res.pretasks,htypes.values);
      ($("#pretasks") as any).selectize({
        plugins: ['remove_button'],
        valueField: "pretaskId",
        placeholder: "Search pretask...",
        labelField: "taskName",
        searchField: ["taskName"],
        loadingClass: 'Loading..',
        highlight: true,
        onChange: function (value) {
            self.OnChangeValue(value); // We need to overide DOM event, Angular vs Jquery
        },
        render: {
          option: function (item, escape) {
            return '<div  class="style_selectize" ngbTooltip="The "">' + escape(item.pretaskId) + ' -  ' + escape(item.taskName) + '</div>';
          },
        },
        onInitialize: function(){
          const selectize = this;
            selectize.addOption(response); // This is will add to option
            const selected_items = [];
            $.each(response, function( i, obj) {
                selected_items.push(obj.id);
            });
            selectize.setValue(selected_items); //this will set option values as default
          }
          });
        });
      });
    }

  getAvalPretasks(assing: any, pretasks: any){

    return pretasks.filter(u => assing.findIndex(lu => lu.pretaskId === u.pretaskId) === -1);

  }

  OnChangeValue(value){
    const formArr = new FormArray([]);
    for (const val of value) {
      formArr.push(
        new FormControl(+val)
      );
    }
    this.updateForm = new FormGroup({
      pretasks: formArr
    });
  }

  onDelete(){
    const id = +this.route.snapshot.params['id'];
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, it can not be recovered!",
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonColor: '#8A8584',
      confirmButtonColor: '#C53819',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.gs.delete(SERV.SUPER_TASKS,id).subscribe(() => {
          Swal.fire({
            title: "Success",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.ngOnInit();
        });
      } else {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your SuperTask is safe!",
          icon: "error",
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }

  private initForm() {
    if (this.editMode) {
    this.gs.get(SERV.SUPER_TASKS,this.editedSTIndex).subscribe((result)=>{
      this.viewForm = new FormGroup({
        supertaskId: new FormControl({value: result['supertaskId'], disabled: true}),
        supertaskName: new FormControl({value: result['supertaskName'], disabled: true}),
      });
    });
   }
  }

  async fetchPreTaskData() {

    const params = {'maxResults': this.maxResults, 'expand': 'pretasks', 'filter': 'supertaskId='+this.editedSTIndex+''};
    const paramspt = { 'maxResults': this.maxResults,'expand': 'pretaskFiles'};
    const matchObjectFiles =[]
    this.gs.getAll(SERV.SUPER_TASKS,params).subscribe((result)=>{
    this.gs.getAll(SERV.PRETASKS,paramspt).subscribe((pretasks: any) => {
      this.pretasks = result.values.map(mainObject => {
          for(let i=0; i < Object.keys(result.values[0].pretasks).length; i++){
            matchObjectFiles.push(pretasks.values.find((element:any) => element?.pretaskId === mainObject.pretasks[i]?.pretaskId))
          }
          return { ...mainObject, matchObjectFiles }
        })
        this.dtTrigger.next(void 0);
      });
    });

    this.dtOptions[0] = {
      dom: 'Bfrtip',
      scrollY: "700px",
      scrollCollapse: true,
      paging: false,
      autoWidth: false,
      searching: false,
      buttons: {
          dom: {
            button: {
              className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
            }
          },
      buttons:[]
      }
    }

  }

  // Calculate Estimated duration

  keyspaceTimeCalc(){
    if(this.etForm.value.benchmarka0 !==0 && this.etForm.value.benchmarka3 !== 0){

      let totalSecondsSupertask = 0;
      let unknown_runtime_included = 0;
      const benchmarka0 = this.etForm.value.benchmarka0;
      const benchmarka3 = this.etForm.value.benchmarka3;

      $(".taskInSuper").each(function (index) {
          const keyspace_size = $(this).find("td:nth-child(4)").text();
          let seconds = null;
          let runtime = null;

          options = defaultOptions;
          options.ruleFiles = [];
          options.posArgs = [];
          options.unrecognizedFlag = [];

          if (keyspace_size === null || !keyspace_size) {
              unknown_runtime_included = 1;
              runtime = "Unknown";
          } else if (options.attackType === 3) {
              seconds = Math.floor(Number(keyspace_size) / Number(benchmarka3));
          } else if (options.attackType === 0) {
              seconds = Math.floor(Number(keyspace_size) / Number(benchmarka0));
          }

          if (Number.isInteger(seconds)) {
              totalSecondsSupertask = totalSecondsSupertask + seconds;
              const days = Math.floor(seconds / (3600 * 24));
              seconds -= days * 3600 * 24;
              const hrs = Math.floor(seconds / 3600);
              seconds -= hrs * 3600;
              const mins = Math.floor(seconds / 60);
              seconds -= mins * 60;

              runtime = days + "d, " + hrs + "h, " + mins + "m, " + seconds + "s";
          } else {
              unknown_runtime_included = 1;
              runtime = "Unknown";
          }

          $(this).find("td:nth-child(5)").html(runtime);
      });

      // reduce total runtime to a human format
      let seconds = totalSecondsSupertask;
      const days = Math.floor(seconds / (3600 * 24));
      seconds -= days * 3600 * 24;
      const hrs = Math.floor(seconds / 3600);
      seconds -= hrs * 3600;
      const mins = Math.floor(seconds / 60);
      seconds -= mins * 60;

      let totalRuntimeSupertask = days + "d, " + hrs + "h, " + mins + "m, " + seconds + "s";
      if (unknown_runtime_included === 1) {
          totalRuntimeSupertask = totalRuntimeSupertask + ", plus additional unknown runtime"
      }

      $(".runtimeOfSupertask").html(totalRuntimeSupertask)

    }
  }


}
