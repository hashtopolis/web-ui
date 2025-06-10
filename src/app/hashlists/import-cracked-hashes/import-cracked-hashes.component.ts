import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { JHashlist } from '@models/hashlist.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { StaticArrayPipe } from '@src/app/core/_pipes/static-array.pipe';
import {
  ImportCrackedHashesForm,
  getImportCrackedHashesForm
} from '@src/app/hashlists/import-cracked-hashes/import-cracked-hashes.form';
import { handleEncode } from '@src/app/shared/utils/forms';

/**
 * Component for import pre cracked hashes
 */
@Component({
  selector: 'app-import-cracked-hashes',
  templateUrl: './import-cracked-hashes.component.html',
  standalone: false
})
export class ImportCrackedHashesComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** On form create show a spinner loading */
  isCreatingLoading = false;

  /** Form group for the new File. */
  form: FormGroup<ImportCrackedHashesForm>;

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
  ngOnInit(): void {
    this.getInitialization();
  }

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
    this.form = getImportCrackedHashesForm();
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
      const createSubscription$ = this.gs.chelper(SERV.HELPER, 'importCrackedHashes', payload).subscribe(() => {
        this.alert.showSuccessMessage('Imported Cracked Hashes');
        this.isCreatingLoading = false;
        const path = this.type === 3 ? '/hashlists/superhashlist' : '/hashlists/hashlist';
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
        include: ['tasks,hashlists,hashType']
      })
      .subscribe((response: ResponseWrapper) => {
        const hashlist = new JsonAPISerializer().deserialize<JHashlist>({
          data: response.data,
          included: response.included
        });
        this.type = hashlist.format;
        this.hashtype = hashlist.hashType;

        this.form.setValue({
          name: hashlist.name,
          format: this.format.transform(hashlist.format, 'formats'),
          isSalted: hashlist.isSalted,
          hashCount: hashlist.hashCount,
          separator: hashlist.separator || ':',
          hashes: ''
        });

        this.isLoading = false; // Set isLoading to false after data is loaded
      });
    this.unsubscribeService.add(updateSubscription$);
  }
}
