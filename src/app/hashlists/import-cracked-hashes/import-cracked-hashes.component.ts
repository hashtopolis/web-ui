import { StaticArrayPipe } from 'src/app/core/_pipes/static-array.pipe';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from '../../../environments/environment';
import { SERV } from '../../core/_services/main.config';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { handleEncode } from 'src/app/shared/utils/forms';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { OnDestroy } from '@angular/core';
import { UnsavedChangesService } from 'src/app/core/_services/shared/unsaved-changes.service';
import { ACCESS_GROUP_FIELD_MAPPING } from 'src/app/core/_constants/select.config';

/**
 * Component for import pre cracked hashes
 */
@Component({
  selector: 'app-import-cracked-hashes',
  templateUrl: './import-cracked-hashes.component.html'
})
export class ImportCrackedHashesComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** On form create show a spinner loading */
  isCreatingLoading = false;

  /** Form group for the new File. */
  form: FormGroup;

  // Edit variables
  editedHashlistIndex: number;
  hashtype: any;
  type: any; // Hashlist or SuperHashlist

  /**
   * Initializes and injects required services and dependencies.
   * Calls necessary methods to set up the component.
   * @param {UnsubscribeService} unsubscribeService - Service for managing subscriptions.
   * @param {AutoTitleService} titleService - Service for managing page titles.
   * @param {StaticArrayPipe} format - Angular pipe for formatting static arrays.
   * @param {ActivatedRoute} route - The activated route, representing the route associated with this component.
   * @param {AlertService} alert - Service for displaying alerts.
   * @param {GlobalService} gs - Service for global application functionality.
   * @param {Router} router - Angular router service for navigation.
   */
  constructor(
    private unsubscribeService: UnsubscribeService,
    private titleService: AutoTitleService,
    private format: StaticArrayPipe,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    this.getInitialization();
    this.buildForm();
    titleService.set(['Import Cracked Hashes']);
  }

  /**
   * Initializes the form based on route parameters.
   */
  getInitialization() {
    this.route.params.subscribe((params: Params) => {
      this.editedHashlistIndex = +params['id'];
      this.formValues();
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {}

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Builds the form for creating a new Hashlist.
   */
  buildForm(): void {
    this.form = new FormGroup({
      name: new FormControl({ value: '', disabled: true }),
      format: new FormControl({ value: '', disabled: true }),
      isSalted: new FormControl({ value: '', disabled: true }),
      hashCount: new FormControl({ value: '', disabled: true }),
      separator: new FormControl(''),
      hashes: new FormControl('')
    });
  }

  /**
   * Handles the form submission.
   * If the form is valid, it updates the hashlist using the provided data.
   * @returns {void}
   */
  onSubmit() {
    if (this.form.valid) {
      this.isCreatingLoading = true;
      const payload = {
        hashlistId: this.editedHashlistIndex,
        separator: this.form.get('separator').value,
        sourceData: handleEncode(this.form.get('hashes').value)
      };
      const createSubscription$ = this.gs
        .chelper(SERV.HELPER, 'importCrackedHashes', payload)
        .subscribe(() => {
          this.alert.okAlert('Imported Cracked Hashes!', '');
          this.isCreatingLoading = false;
          const path =
            this.type === 3
              ? '/hashlists/superhashlist'
              : '/hashlists/hashlist';
          this.router.navigate([path]);
        });
      this.isCreatingLoading = false;
      this.unsubscribeService.add(createSubscription$);
    }
  }

  /**
   * Sets form values after fetching hashlist details.
   * @returns {void}
   */
  private formValues() {
    const updateSubscription$ = this.gs
      .get(SERV.HASHLISTS, this.editedHashlistIndex, {
        expand: 'tasks,hashlists,hashType'
      })
      .subscribe((result) => {
        this.type = result['format'];
        this.hashtype = result['hashType'];
        console.log(result);
        this.form = new FormGroup({
          name: new FormControl({
            value: result['name'],
            disabled: true
          }),
          format: new FormControl({
            value: this.format.transform(result['format'], 'formats'),
            disabled: true
          }),
          isSalted: new FormControl({
            value: result['isSalted'] ? 'Yes' : 'No',
            disabled: true
          }),
          hashCount: new FormControl({
            value: result['hashCount'],
            disabled: true
          }),
          separator: new FormControl(result['separator'] || ':'),
          hashes: new FormControl('')
        });
        this.isLoading = false; // Set isLoading to false after data is loaded
      });
    this.unsubscribeService.add(updateSubscription$);
  }
}
