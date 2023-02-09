import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from './../../../environments/environment';
import { faAlignJustify, faInfoCircle, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { SuperTasksService } from 'src/app/core/_services/tasks/supertasks.sevice';
import { PreTasksService } from 'src/app/core/_services/tasks/pretasks.sevice';

@Component({
  selector: 'app-edit-supertasks',
  templateUrl: './edit-supertasks.component.html'
})
export class EditSupertasksComponent implements OnInit {

  editMode = false;
  editedSTIndex: number;
  editedST: any // Change to Model

  isLoading = false;
  faAlignJustify=faAlignJustify;
  faInfoCircle=faInfoCircle;
  faMagnifyingGlass=faMagnifyingGlass;

  constructor(
    private supertaskService: SuperTasksService,
    private pretasksService: PreTasksService,
    private route:ActivatedRoute,
    private router: Router,
  ) { }

  private maxResults = environment.config.prodApiMaxResults

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  viewForm: FormGroup;
  updateForm: FormGroup;
  pretasks: any = [];

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
      supertaskName: new FormControl(''),
      pretasks: new FormControl(''),
    });

    setTimeout(() => {
      this.fetchPreTaskData();
     }, 1000);
    this.isLoading = false;
  }

  onSubmit(){
    if (this.updateForm.valid) {

      this.isLoading = true;

      this.supertaskService.updateSupertask(this.editedSTIndex,this.updateForm.value).subscribe((agent: any) => {
        const response = agent;
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
            // self.OnChangeValue(value); // We need to overide DOM event, Angular vs Jquery
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
    // this.signupForm.patchValue({
    //     hashTypeId: value
    // });
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

    this.supertaskService.getAllsupertasks(params).subscribe((result)=>{
         this.pretasks = result.values;
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

}
