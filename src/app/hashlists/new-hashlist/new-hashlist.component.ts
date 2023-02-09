import { Component, OnInit, ChangeDetectionStrategy ,ChangeDetectorRef, HostListener  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js'; //ToDo Change to a Common Module
// import * as $ from "jquery"; //Fixes Test error but affects

import { faMagnifyingGlass, faUpload } from '@fortawesome/free-solid-svg-icons';

import { ShowHideTypeFile } from '../../shared/utils/forms';
import { fileSizeValue, validateFileExt } from '../../shared/utils/util';

import { ListsService } from '../../core/_services/hashlist/hashlist.service';
import { HashtypeService } from 'src/app/core/_services/hashtype.service';
import { AccessGroupsService } from '../../core/_services/accessgroups.service';
import { UploadTUSService } from '../../core/_services/files/files_tus.service';

import { AccessGroup } from '../../core/_models/access-group';
import { UploadFileTUS } from '../../core/_models/files';

@Component({
  selector: 'app-new-hashlist',
  templateUrl: './new-hashlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewHashlistComponent implements OnInit {
  /**
   * Fa Icons
   *
  */
  isLoading = false;
  faUpload=faUpload;
  faMagnifyingGlass=faMagnifyingGlass;

  /**
   * Form Settings
   *
  */
  signupForm: FormGroup;
  ShowHideTypeFile = ShowHideTypeFile;
  radio=true;
  hashcatbrain: string;

  // accessgroup: AccessGroup; //Use models when data structure is reliable
  accessgroup: any[]

  constructor(private hlService: ListsService,
     private _changeDetectorRef: ChangeDetectorRef,
     private hashtypeService: HashtypeService,
     private accessgroupService: AccessGroupsService,
     private router: Router,
     private uploadService:UploadTUSService,
     ) { }

  ngOnInit(): void {

    this.accessgroupService.getAccessGroups().subscribe((agroups: any) => {
      this.accessgroup = agroups.values;
    });

    this.signupForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'hashTypeId': new FormControl('', [Validators.required]),
      'format': new FormControl(null),
      'separator': new FormControl(null || ';'),
      'isSalted': new FormControl(false),
      'isHexSalt': new FormControl(false),
      'accessGroupId': new FormControl(null, [Validators.required]),
      'useBrain': new FormControl(false),
      'brainFeatures': new FormControl(null || 3),
      'notes': new FormControl(''),
      "sourceType": new FormControl('upload' || null),
      "sourceData": new FormControl(''),
      'hashCount': new FormControl(0),
      'cracked': new FormControl(0),
      'isArchived': new FormControl(false),
      'isSecret': new FormControl(true),
    });

  }

  ngAfterViewInit() {


    this.hashtypeService.getHashTypes().subscribe((htypes: any) => {
      var self = this;
      var response = htypes.values;
      ($("#hashtype") as any).selectize({
        plugins: ['remove_button'],
        valueField: "hashTypeId",
        placeholder: "Search hashtype...",
        labelField: "description",
        searchField: ["description"],
        loadingClass: 'Loading..',
        highlight: true,
        onChange: function (value) {
            self.OnChangeValue(value); // We need to overide DOM event, Angular vs Jquery
        },
        render: {
          option: function (item, escape) {
            return '<div  class="hashtype_selectize">' + escape(item.hashTypeId) + ' -  ' + escape(item.description) + '</div>';
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
    this.signupForm.patchValue({
      hashTypeId: value
    });
    this._changeDetectorRef.detectChanges();
  }


}
