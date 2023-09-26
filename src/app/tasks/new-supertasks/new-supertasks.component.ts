import { Component, OnInit, ChangeDetectionStrategy ,ChangeDetectorRef  } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { faFile, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';

import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-new-supertasks',
  templateUrl: './new-supertasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
@PageTitle(['New SuperTask'])
export class NewSupertasksComponent implements OnInit {

  faMagnifyingGlass=faMagnifyingGlass;
  faFile=faFile;

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
      supertaskName: new FormControl(''),
      pretasks: new FormControl(''),
    });

    const params = {'maxResults': this.maxResults}

    this.gs.getAll(SERV.PRETASKS,params).subscribe((tasks: any) => {
      const self = this;
      const response = tasks.values;
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
            return '<div  class="style_selectize">' + escape(item.pretaskId) + ' -  ' + escape(item.taskName) + '</div>';
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
    const cname = this.createForm.get('supertaskName').value;
    this.createForm = new FormGroup({
      supertaskName: new FormControl(cname),
      pretasks: formArr
    });
    this._changeDetectorRef.detectChanges();
  }

  onSubmit(){
    if (this.createForm.valid) {

      this.gs.create(SERV.SUPER_TASKS,this.createForm.value).subscribe(() => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Success!",
            text: "New Supertask created!",
            showConfirmButton: false,
            timer: 1500
          })
          this.createForm.reset(); // success, we reset form
          this.router.navigate(['tasks/supertasks']);
        }
      );
    }
  }
}
