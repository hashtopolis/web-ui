import { Component, OnInit, ChangeDetectionStrategy ,ChangeDetectorRef  } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { faFile, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { environment } from './../../../environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';

import { SuperTasksService } from 'src/app/core/_services/tasks/supertasks.sevice';
import { PreTasksService } from 'src/app/core/_services/tasks/pretasks.sevice';
import { UsersService } from 'src/app/core/_services/users/users.service';

@Component({
  selector: 'app-new-supertasks',
  templateUrl: './new-supertasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewSupertasksComponent implements OnInit {
  isLoading = false;
  faFile=faFile;
  faMagnifyingGlass=faMagnifyingGlass;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private supertaskService: SuperTasksService,
    private pretasksService: PreTasksService,
    private users: UsersService,
    private router: Router
  ) { }

  createForm: FormGroup;
  private maxResults = environment.config.prodApiMaxResults
  formArr: FormArray;

  ngOnInit(): void {

    this.setAccessPermissions();

    this.createForm = new FormGroup({
      supertaskName: new FormControl(''),
      pretasks: new FormControl(''),
    });

    let params = {'maxResults': this.maxResults}

    this.pretasksService.getAllPretasks(params).subscribe((tasks: any) => {
      var self = this;
      var response = tasks.values;
      ($("#preTasks") as any).selectize({
        maxItems: null,
        plugins: ["restore_on_backspace"],
        valueField: "pretaskId",
        placeholder: "Search task...",
        labelField: "taskName",
        searchField: ["taskName"],
        loadingClass: 'Loading..',
        highlight: true,
        onChange: function (value) {
            self.OnChangeValue(value); // We need to overide DOM event, Angular vs Jquery
        },
        render: {
          option: function (item, escape) {
            return '<div  class="hashtype_selectize">' + escape(item.pretaskId) + ' -  ' + escape(item.taskName) + '</div>';
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

  // Set permissions
  manageSupertaskAccess: any;
  createSupertaskAccess: any;

  setAccessPermissions(){
    this.users.getUser(this.users.userId,{'expand':'globalPermissionGroup'}).subscribe((perm: any) => {
        this.manageSupertaskAccess = perm.globalPermissionGroup.permissions.manageSupertaskAccess;
        this.createSupertaskAccess = perm.globalPermissionGroup.permissions.createSupertaskAccess;
    });
  }

  OnChangeValue(value){
    let formArr = new FormArray([]);
    for (let val of value) {
      formArr.push(
        new FormControl(+val)
      );
    }
    let cname = this.createForm.get('supertaskName').value;
    this.createForm = new FormGroup({
      supertaskName: new FormControl(cname),
      pretasks: formArr
    });
    this._changeDetectorRef.detectChanges();
  }

  onSubmit(){
    if(this.createSupertaskAccess || typeof this.createSupertaskAccess == 'undefined'){
    if (this.createForm.valid) {

      this.isLoading = true;

      this.supertaskService.createSupertask(this.createForm.value).subscribe((hasht: any) => {
        const response = hasht;
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "New Supertask created!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.createForm.reset(); // success, we reset form
          this.router.navigate(['tasks/supertasks']);
        },
        errorMessage => {
          // check error status code is 500, if so, do some action
          Swal.fire({
            title: "Error!",
            text: "Supertask was not created, please try again!",
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
}
