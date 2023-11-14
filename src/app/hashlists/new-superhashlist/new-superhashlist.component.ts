import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-new-superhashlist',
  templateUrl: './new-superhashlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
@PageTitle(['New SuperHashlist'])
export class NewSuperhashlistComponent implements OnInit {
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {}

  createForm: FormGroup;
  private maxResults = environment.config.prodApiMaxResults;
  formArr: FormArray;
  hashlists: any;

  ngOnInit(): void {
    this.createForm = new FormGroup({
      name: new FormControl(''),
      hashlistIds: new FormControl('')
    });

    this.gs
      .getAll(SERV.HASHLISTS, {
        maxResults: this.maxResults,
        filter: 'isArchived=false,format=0'
      })
      .subscribe((tasks: any) => {
        const self = this;
        const response = tasks.values;
        this.hashlists = response;
        ($('#hashlistIds') as any).selectize({
          maxItems: null,
          plugins: ['restore_on_backspace'],
          valueField: 'hashlistId',
          placeholder: 'Search hashlist...',
          labelField: 'name',
          searchField: ['name'],
          loadingClass: 'Loading..',
          highlight: true,
          onChange: function (value) {
            self.OnChangeValue(value); // We need to overide DOM event, Angular vs Jquery
          },
          render: {
            option: function (item, escape) {
              return (
                '<div  class="style_selectize">' +
                escape(item.hashlistId) +
                ' -  ' +
                escape(item.name) +
                '</div>'
              );
            }
          },
          onInitialize: function () {
            const selectize = this;
            selectize.addOption(response); // This is will add to option
            const selected_items = [];
            $.each(response, function (i, obj) {
              selected_items.push(obj.id);
            });
            selectize.setValue(selected_items); //this will set option values as default
          }
        });
      });
  }

  OnChangeValue(value) {
    const formArr = new FormArray([]);
    for (const val of value) {
      formArr.push(new FormControl(+val));
    }
    const cname = this.createForm.get('name').value;
    this.createForm = new FormGroup({
      name: new FormControl(cname),
      hashlistIds: formArr
    });
    this._changeDetectorRef.detectChanges();
  }

  onSubmit() {
    if (this.createForm.valid) {
      console.log(this.createForm.value);
      this.gs
        .chelper(SERV.HELPER, 'createSuperHashlist', this.createForm.value)
        .subscribe(() => {
          this.alert.okAlert('New SuperHashList created!', '');
          this.createForm.reset(); // success, we reset form
          this.router.navigate(['hashlists/superhashlist']);
        });
    }
  }

  hashlistIds = new FormControl();
  selectedHashlistDisplay: any[] = []; // Array for displaying selected hashlists
  selectedHashlistValues: any[] = []; // Array for storing selected hashlist values

  addItem(event: any): void {
    const value = (event.value || '').trim();

    if (value && !this.selectedHashlistValues.includes(value)) {
      this.selectedHashlistValues.push(value);
      this.selectedHashlistDisplay.push(value); // Add to display array
      this.hashlistIds.setValue('');
    }
  }

  removeItem(hashlist: any): void {
    const index = this.selectedHashlistValues.indexOf(hashlist);

    if (index >= 0) {
      this.selectedHashlistValues.splice(index, 1);
      this.selectedHashlistDisplay.splice(index, 1); // Remove from display array
    }
  }

  selectedItem(event: any): void {
    const selectedValue = event.option.value;

    if (!this.selectedHashlistValues.includes(selectedValue)) {
      this.selectedHashlistValues.push(selectedValue);
      this.selectedHashlistDisplay.push(selectedValue); // Add to display array
      this.hashlistIds.setValue('');
    }
  }
}
