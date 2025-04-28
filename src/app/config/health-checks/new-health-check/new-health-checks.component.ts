import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  CRACKER_TYPE_FIELD_MAPPING,
  CRACKER_VERSION_FIELD_MAPPING
} from 'src/app/core/_constants/select.config';
import { attack, hashtype } from 'src/app/core/_constants/healthchecks.config';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';
import { transformSelectOptions } from 'src/app/shared/utils/forms';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

@Component({
  selector: 'app-new-health-checks',
  templateUrl: './new-health-checks.component.html'
})
export class NewHealthChecksComponent implements OnInit, OnDestroy {
  /** Form group for Health Checks */
  form: FormGroup;

  /** On form update show a spinner loading */
  isCreatingLoading = false;

  // Lists of Selected inputs
  selectAttack = attack;
  selectHashtypes = hashtype;
  selectCrackertype: any;
  selectCrackerversions: any = [];

  /** Select Options Mapping */
  selectCrackertypeMap = {
    fieldMapping: CRACKER_TYPE_FIELD_MAPPING
  };

  selectCrackervMap = {
    fieldMapping: CRACKER_VERSION_FIELD_MAPPING
  };

  /**
   * @param {UnsubscribeService} unsubscribeService - The service managing unsubscribing from observables.
   * @param {AutoTitleService} titleService - The service for managing the title of the component.
   * @param {AlertService} alert - The service for displaying alerts.
   * @param {GlobalService} gs - The global service used for API calls and global functionalities.
   * @param {Router} router - The Angular router service for navigation.
   */
  constructor(
    private unsubscribeService: UnsubscribeService,
    private titleService: AutoTitleService,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    this.buildForm();
    titleService.set(['New Health Check']);
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Builds the form for creating a new SuperHashlist.
   */
  buildForm(): void {
    this.form = new FormGroup({
      checkType: new FormControl(0),
      hashtypeId: new FormControl(null || 0, [Validators.required]),
      crackerBinaryId: new FormControl('', [Validators.required]),
      crackerBinaryType: new FormControl('')
    });

    const onHandleBinarySubscription$ = this.form
      .get('crackerBinaryType')
      .valueChanges.subscribe((newvalue) => {
        this.handleChangeBinary(newvalue);
      });
    this.unsubscribeService.add(onHandleBinarySubscription$);
  }

  /**
   * Loads data, specifically hashlists, for the component.
   */
  loadData(): void {
    const loadSubscription$ = this.gs
      .getAll(SERV.CRACKERS_TYPES)
      .subscribe((response: any) => {
        const transformedOptions = transformSelectOptions(
          response.values,
          this.selectCrackertypeMap
        );
        this.selectCrackertype = transformedOptions;
      });
    this.unsubscribeService.add(loadSubscription$);
  }

  /**
   * Handles the change event when the cracker binary type is selected.
   * Fetches cracker versions based on the selected cracker binary type.
   *
   * @param {string} id - The ID of the selected cracker binary type.
   * @returns {void}
   */
  handleChangeBinary(id: string) {
    const params = { filter: 'crackerBinaryTypeId=' + id + '' };
    const onChangeBinarySubscription$ = this.gs
      .getAll(SERV.CRACKERS, params)
      .subscribe((response: any) => {
        const transformedOptions = transformSelectOptions(
          response.values,
          this.selectCrackervMap
        );
        this.selectCrackerversions = transformedOptions;
        const lastItem = this.selectCrackerversions.slice(-1)[0]['_id'];
        this.form.get('crackerBinaryId').patchValue(lastItem);
      });
    this.unsubscribeService.add(onChangeBinarySubscription$);
  }

  /**
   * Handles the form submission for creating a new health check.
   *
   * @returns {void}
   */
  onSubmit() {
    if (this.form.valid) {
      this.isCreatingLoading = true;
      const { checkType, hashtypeId, crackerBinaryId } = this.form.value;

      const payload = {
        checkType,
        hashtypeId,
        crackerBinaryId
      };

      const onSubmitSubscription$ = this.gs
        .create(SERV.HEALTH_CHECKS, payload)
        .subscribe(() => {
          this.alert.okAlert('New Health Check created!', '');
          this.router.navigate(['/config/health-checks']);
          this.isCreatingLoading = false;
        });
      this.unsubscribeService.add(onSubmitSubscription$);
    }
  }
}
