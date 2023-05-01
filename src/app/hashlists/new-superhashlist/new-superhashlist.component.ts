import { Component, OnInit, ChangeDetectionStrategy ,ChangeDetectorRef  } from '@angular/core';
import { faFile, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { SuperHashlistService } from 'src/app/core/_services/hashlist/superhashlist.service';
import { ListsService } from '../../core/_services/hashlist/hashlist.service';
import { UsersService } from 'src/app/core/_services/users/users.service';

@Component({
  selector: 'app-new-superhashlist',
  templateUrl: './new-superhashlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewSuperhashlistComponent implements OnInit {
  isLoading = false;
  faFile=faFile;
  faMagnifyingGlass=faMagnifyingGlass;

  constructor(
    private superHashlistService:SuperHashlistService,
    private _changeDetectorRef: ChangeDetectorRef,
    private hashlistService:ListsService,
    private users: UsersService,
    private router: Router
  ) { }

  createForm: FormGroup;
  private maxResults = environment.config.prodApiMaxResults
  formArr: FormArray;

  ngOnInit(): void {

    this.setAccessPermissions();

    this.createForm = new FormGroup({
      superhashlistName: new FormControl(''),
      hashlists: new FormControl(''),
    });

    let params = {'maxResults': this.maxResults, 'filter': 'isArchived=false'}

    this.hashlistService.getAllhashlists(params).subscribe((tasks: any) => {
      var self = this;
      var response = tasks.values;
      ($("#hashlists") as any).selectize({
        maxItems: null,
        plugins: ["restore_on_backspace"],
        valueField: "hashlistId",
        placeholder: "Search hashlist...",
        labelField: "name",
        searchField: ["name"],
        loadingClass: 'Loading..',
        highlight: true,
        onChange: function (value) {
            self.OnChangeValue(value); // We need to overide DOM event, Angular vs Jquery
        },
        render: {
          option: function (item, escape) {
            return '<div  class="hashtype_selectize">' + escape(item.hashlistId) + ' -  ' + escape(item.name) + '</div>';
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
  createSuperhashlistAccess: any;

  setAccessPermissions(){
    this.users.getUser(this.users.userId,{'expand':'globalPermissionGroup'}).subscribe((perm: any) => {
        this.createSuperhashlistAccess = perm.globalPermissionGroup.permissions.createSuperhashlistAccess;
    });
  }

  OnChangeValue(value){
    let formArr = new FormArray([]);
    for (let val of value) {
      formArr.push(
        new FormControl(+val)
      );
    }
    let cname = this.createForm.get('superhashlistName').value;
    this.createForm = new FormGroup({
      superhashlistName: new FormControl(cname),
      hashlists: formArr
    });
    this._changeDetectorRef.detectChanges();
  }

  onSubmit(){
    if(this.createSuperhashlistAccess || typeof this.createSuperhashlistAccess == 'undefined'){
    if (this.createForm.valid) {

      this.isLoading = true;

      this.superHashlistService.createSuperhashlist(this.createForm.value).subscribe((hasht: any) => {
        const response = hasht;
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "New SuperHashList created!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.createForm.reset(); // success, we reset form
          this.router.navigate(['hashlists/superhashlist']);
        },
        errorMessage => {
          // check error status code is 500, if so, do some action
          Swal.fire({
            title: "Error!",
            text: "SuperHashList was not created, please try again!",
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
