import { faAlignJustify, faInfoCircle, faMagnifyingGlass, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { environment } from './../../../environments/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

import { SuperTasksService } from 'src/app/core/_services/tasks/supertasks.sevice';
import { PreTasksService } from 'src/app/core/_services/tasks/pretasks.sevice';
import { UsersService } from 'src/app/core/_services/users/users.service';

declare var options: any;
declare var defaultOptions: any;
declare var parser: any;

@Component({
  selector: 'app-edit-supertasks',
  templateUrl: './edit-supertasks.component.html'
})
export class EditSupertasksComponent implements OnInit {

  editMode = false;
  editedSTIndex: number;
  editedST: any // Change to Model

  isLoading = false;
  faEye=faEye;
  faTrash=faTrash;
  faInfoCircle=faInfoCircle;
  faAlignJustify=faAlignJustify;
  faMagnifyingGlass=faMagnifyingGlass;

  constructor(
    private supertaskService: SuperTasksService,
    private pretasksService: PreTasksService,
    private route:ActivatedRoute,
    private users: UsersService,
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

    this.setAccessPermissions();

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
    this.isLoading = false;
  }

  // Set permissions
  manageSupertaskAccess: any;

  setAccessPermissions(){
    this.users.getUser(this.users.userId,{'expand':'globalPermissionGroup'}).subscribe((perm: any) => {
        this.manageSupertaskAccess = perm.globalPermissionGroup.permissions.manageSupertaskAccess;
    });
  }

  onSubmit(){
    if(this.manageSupertaskAccess || typeof this.manageSupertaskAccess == 'undefined'){
    if (this.updateForm.valid) {

      this.isLoading = true;

      this.supertaskService.updateSupertask(this.editedSTIndex,this.updateForm.value).subscribe((st: any) => {
        const response = st;
        console.log(response);
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "SuperTask updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.updateForm.reset(); // success, we reset form
          this.router.navigate(['/tasks/supertasks']);
        },
        errorMessage => {
          // check error status code is 500, if so, do some action
          Swal.fire({
            title: "Error!",
            text: "SuperTask was not saved, please try again!",
            icon: "warning",
            showConfirmButton: true
          });
        }
      );
    }
    }else{
      Swal.fire({
        title: "ACTION DENIED",
        text: "Please contact your Administrator.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

  ngAfterViewInit() {

    this.pretasksService.getAllPretasks().subscribe((htypes: any) => {
      var self = this;
      var response = htypes.values;
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
            return '<div  class="hashtype_selectize" ngbTooltip="The "">' + escape(item.pretaskId) + ' -  ' + escape(item.taskName) + '</div>';
          },
        },
        onInitialize: function(){
          var selectize = this;
            selectize.addOption(response); // This is will add to option
            var selected_items = [];
            $.each(response, function( i, obj) {
                selected_items.push(obj.id);
            });
            selectize.setValue(selected_items); //this will set option values as default
          }
          });
        });

    }

  OnChangeValue(value){
    let formArr = new FormArray([]);
    for (let val of value) {
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
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, it cannot be recover.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#4B5563',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.supertaskService.deleteSupertask(id).subscribe(() => {
          Swal.fire(
            "Supertask has been deleted!",
            {
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.ngOnInit();
        });
      } else {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'No worries, it is safe!',
          'error'
        )
      }
    });
  }

  private initForm() {
    this.isLoading = true;
    if (this.editMode) {
    this.supertaskService.getSupertask(this.editedSTIndex).subscribe((result)=>{
      this.viewForm = new FormGroup({
        supertaskId: new FormControl(result['supertaskId']),
        supertaskName: new FormControl(result['supertaskName']),
      });
      this.isLoading = false;
    });
   }
  }


  async fetchPreTaskData() {

    let params = {'maxResults': this.maxResults, 'expand': 'pretasks', 'filter': 'supertaskId='+this.editedSTIndex+''};
    let paramspt = { 'maxResults': this.maxResults,'expand': 'pretaskFiles'}
    var matchObjectFiles =[]
    this.supertaskService.getAllsupertasks(params).subscribe((result)=>{
    this.pretasksService.getAllPretasks(paramspt).subscribe((pretasks: any) => {
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

      var totalSecondsSupertask = 0;
      var unknown_runtime_included = 0;
      var benchmarka0 = this.etForm.value.benchmarka0;
      var benchmarka3 = this.etForm.value.benchmarka3;

      $(".taskInSuper").each(function (index) {
          var keyspace_size = $(this).find("td:nth-child(4)").text();
          var seconds = null;
          var runtime = null;

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
              var days = Math.floor(seconds / (3600 * 24));
              seconds -= days * 3600 * 24;
              var hrs = Math.floor(seconds / 3600);
              seconds -= hrs * 3600;
              var mins = Math.floor(seconds / 60);
              seconds -= mins * 60;

              runtime = days + "d, " + hrs + "h, " + mins + "m, " + seconds + "s";
          } else {
              unknown_runtime_included = 1;
              runtime = "Unknown";
          }

          $(this).find("td:nth-child(5)").html(runtime);
      });

      // reduce total runtime to a human format
      var seconds = totalSecondsSupertask;
      var days = Math.floor(seconds / (3600 * 24));
      seconds -= days * 3600 * 24;
      var hrs = Math.floor(seconds / 3600);
      seconds -= hrs * 3600;
      var mins = Math.floor(seconds / 60);
      seconds -= mins * 60;

      let totalRuntimeSupertask = days + "d, " + hrs + "h, " + mins + "m, " + seconds + "s";
      if (unknown_runtime_included === 1) {
          totalRuntimeSupertask = totalRuntimeSupertask + ", plus additional unknown runtime"
      }

      $(".runtimeOfSupertask").html(totalRuntimeSupertask)

    }
  }


}
