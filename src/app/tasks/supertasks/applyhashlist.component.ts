import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from '../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-applyhashlist',
  templateUrl: './applyhashlist.component.html',
  // changeDetection: ChangeDetectionStrategy.Default
})
@PageTitle(['Apply Hashlist'])
export class ApplyHashlistComponent  {

  Index: number;
  private maxResults = environment.config.prodApiMaxResults;
  crackertype: any;
  crackerversions: any = [];
  createForm: FormGroup;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private route:ActivatedRoute,
    private gs: GlobalService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.Index = +params['id'];
        this.initForm();
      }
    );

    this.createForm = new FormGroup({
      "supertaskTemplateId":  new FormControl(this.Index),
      'hashlistId': new FormControl(),
      "crackerVersionId": new FormControl(),
    });

  }

  initForm(){

    this.gs.getAll(SERV.TASKS_WRAPPER,{'maxResults': this.maxResults}).subscribe((crackers) => {})

    this.createForm = new FormGroup({
      "supertaskTemplateId":  new FormControl(this.Index),
      'hashlistId': new FormControl(),
      "crackerVersionId": new FormControl(),
    });

    this.gs.getAll(SERV.CRACKERS_TYPES).subscribe((crackers) => {
      this.crackertype = crackers.values;
      let crackerBinaryTypeId = '';
      if(this.crackertype.find(obj => obj.typeName === 'hashcat').crackerBinaryTypeId){
        crackerBinaryTypeId = this.crackertype.find(obj => obj.typeName === 'hashcat').crackerBinaryTypeId;
      }else{
        crackerBinaryTypeId = this.crackertype.slice(-1)[0]['crackerBinaryTypeId'];
      }
      this.gs.getAll(SERV.CRACKERS,{'maxResults': this.maxResults,'filter': 'crackerBinaryTypeId='+crackerBinaryTypeId+'' }).subscribe((crackers) => {
        this.crackerversions = crackers.values;
        const lastItem = this.crackerversions.slice(-1)[0]['crackerBinaryId'];
        this.createForm.get('crackerBinaryTypeId').patchValue(lastItem);
      })
    });

  }

  ngAfterViewInit() {

    const params = {'maxResults': this.maxResults};

    this.gs.getAll(SERV.HASHLISTS,params).subscribe((hlist: any) => {
      const self = this;
      const response = hlist.values;
      ($("#hashlist") as any).selectize({
        plugins: ['remove_button'],
        preload: true,
        create: false,
        valueField: "hashlistId",
        placeholder: "Search hashlist...",
        labelField: "name",
        searchField: ["name"],
        loadingClass: 'Loading...',
        highlight: true,
        onChange: function (value) {
          self.OnChangeHashlist(value);
        },
        render: {
          option: function (item, escape) {
            return '<div  class="style_selectize">' + escape(item.hashlistId) + ' -  ' + escape(item.name) + '</div>';
          },
        },
        onInitialize: function(){
            const selectize = this;
            selectize.addOption(response);
            const selected_items = [];
            $.each(response, function( i, obj) {
                selected_items.push(obj.id);
            });
            selectize.setValue(selected_items);
          },
          });
      });

  }

  OnChangeHashlist(value){
    this.createForm.patchValue({
      hashlistId: Number(value)
    });
    // this._changeDetectorRef.detectChanges();
  }

  onChangeBinary(id: string){
    const params = {'filter': 'crackerBinaryTypeId='+id+''};
    this.gs.getAll(SERV.CRACKERS,params).subscribe((crackers: any) => {
      this.crackerversions = crackers.values;
      const lastItem = this.crackerversions.slice(-1)[0]['crackerBinaryId'];
      this.createForm.get('crackerVersionId').patchValue(lastItem);
    });
  }

  onSubmit(){
    this.gs.chelper(SERV.HELPER,'createSupertask', this.createForm.value).subscribe(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: "Success",
          showConfirmButton: false,
          timer: 1500
        })
        this.createForm.reset();
        this.router.navigate(['tasks/show-tasks']);
      }
    );
  }


}
