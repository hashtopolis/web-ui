import { Component, HostListener, OnInit, ViewChild} from '@angular/core';
import { faHomeAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { environment } from './../../../environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { StaticArrayPipe } from 'src/app/core/_pipes/static-array.pipe';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { ListsService } from '../../core/_services/hashlist/hashlist.service';
import { AccessGroupsService } from '../../core/_services/accessgroups.service';

@Component({
  selector: 'app-edit-hashlist',
  templateUrl: './edit-hashlist.component.html'
})
export class EditHashlistComponent implements OnInit {

  editMode = false;
  editedHashlistIndex: number;
  editedHashlist: any // Change to Model

  faHome=faHomeAlt;
  faInfoCircle=faInfoCircle;
  isLoading = false;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  constructor(
    private listsService: ListsService,
    private accessgroupService:AccessGroupsService,
    private route: ActivatedRoute,
    private router: Router,
    private format: StaticArrayPipe
  ) { }

  updateForm: FormGroup
  accessgroup: any //Change to Interface
  private maxResults = environment.config.prodApiMaxResults;


  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedHashlistIndex = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );

    this.updateForm = new FormGroup({
      'hashlistId': new FormControl({value: '', disabled: true}),
      'accessGroupId': new FormControl(''),
      'hashTypeId': new FormControl({value: '', disabled: true}),
      'useBrain': new FormControl({value: '', disabled: true}),
      'format': new FormControl({value: '', disabled: true}),
      'hashCount': new FormControl({value: '', disabled: true}),
      'cracked': new FormControl({value: '', disabled: true}),
      'updateData': new FormGroup({
        'name': new FormControl(''),
        'notes': new FormControl(''),
        'isSecret': new FormControl(''),
        'isSmall': new FormControl(''),
        'accessGroupId': new FormControl(''),
      }),
    });

    this.listsService.getHashlist(this.editedHashlistIndex).subscribe((result)=>{
      this.editedHashlist = result;
      });

    this.accessgroupService.getAccessGroups().subscribe((agroups: any) => {
      this.accessgroup = agroups.values;
    });

    this.dtOptions[0] = {
      dom: 'Bfrtip',
      scrollY: "700px",
      scrollCollapse: true,
      paging: false,
      autoWidth: false,
      // destroy: true,
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

  onSubmit(){
    if (this.updateForm.valid) {

      this.isLoading = true;

      this.listsService.updateHashlist(this.updateForm.value['updateData']).subscribe((hasht: any) => {
        const response = hasht;
        console.log(response);
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "HashList updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.updateForm.reset(); // success, we reset form
          this.router.navigate(['hashlist']);
        },
        errorMessage => {
          // check error status code is 500, if so, do some action
          Swal.fire({
            title: "Error!",
            text: "HashList was not created, please try again!",
            icon: "warning",
            showConfirmButton: true
          });
        }
      );
    }
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

  private initForm() {
    this.isLoading = true;
    if (this.editMode) {
    this.listsService.getHashlist(this.editedHashlistIndex).subscribe((result)=>{
      this.editedHashlist = result;
      this.updateForm = new FormGroup({
        'hashlistId': new FormControl(result['hashlistId']),
        'accessGroupId': new FormControl(result['accessGroupId']),
        'hashTypeId': new FormControl(result['hashTypeId']),
        'useBrain': new FormControl(result['useBrain'] == 0 ? 'Yes' : 'No'),
        'format': new FormControl(this.format.transform(result['format'],'formats')),
        'hashCount': new FormControl(result['hashCount']),
        'cracked': new FormControl(result['cracked']),
        'updateData': new FormGroup({
          'name': new FormControl(result['name']),
          'notes': new FormControl(result['notes']),
          'isSecret': new FormControl(result['isSecret']),
          'isSmall': new FormControl(result['isSmall']),
          'accessGroupId': new FormControl(result['accessGroupId']),
        }),
      });
      this.isLoading = false;
    });
   }
  }

  // @HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
      if (!this.canDeactivate()) {
        $event.returnValue = "IE and Edge Message";
      }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.updateForm.valid) {
    return false;
      }
    return true;
  }

}



