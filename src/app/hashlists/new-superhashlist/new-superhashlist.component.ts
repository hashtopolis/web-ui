import { Component, OnInit, ChangeDetectionStrategy ,ChangeDetectorRef  } from '@angular/core';
import { faFile, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';

import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment'
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-new-superhashlist',
  templateUrl: './new-superhashlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
@PageTitle(['New SuperHashlist'])
export class NewSuperhashlistComponent implements OnInit {

  faFile=faFile;
  faMagnifyingGlass=faMagnifyingGlass;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private gs: GlobalService,
    private router: Router
  ) { }

  createForm: FormGroup;
  private maxResults = environment.config.prodApiMaxResults
  formArr: FormArray;

  ngOnInit(): void {

    this.createForm = new FormGroup({
      superhashlistName: new FormControl(''),
      hashlists: new FormControl(''),
    });

    const params = {'maxResults': this.maxResults, 'filter': 'isArchived=false'}

    this.gs.getAll(SERV.HASHLISTS,params).subscribe((tasks: any) => {
      const self = this;
      const response = tasks.values;
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
            return '<div  class="style_selectize">' + escape(item.hashlistId) + ' -  ' + escape(item.name) + '</div>';
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
  }

  OnChangeValue(value){
    const formArr = new FormArray([]);
    for (const val of value) {
      formArr.push(
        new FormControl(+val)
      );
    }
    const cname = this.createForm.get('superhashlistName').value;
    this.createForm = new FormGroup({
      superhashlistName: new FormControl(cname),
      hashlists: formArr
    });
    this._changeDetectorRef.detectChanges();
  }

  onSubmit(){
    if (this.createForm.valid) {

      this.gs.create(SERV.SUPER_HASHLISTS,this.createForm.value).subscribe(() => {
          Swal.fire({
            title: "Success",
            text: "New SuperHashList created!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.createForm.reset(); // success, we reset form
          this.router.navigate(['hashlists/superhashlist']);
        }
      );
    }
  }

}
