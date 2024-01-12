import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CRACKER_TYPE_FIELD_MAPPING } from 'src/app/core/_constants/select.config';
import { benchmarkType } from 'src/app/core/_constants/tasks.config';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';
import { OnDestroy } from '@angular/core';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { ChangeDetectorRef } from '@angular/core';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { transformSelectOptions } from 'src/app/shared/utils/forms';
import { HorizontalNav } from 'src/app/core/_models/horizontalnav.model';

/**
 * ImportSupertaskMaskComponent is a component responsible for importing SuperTasks with masks.
 *
 */
@Component({
  selector: 'app-import-supertasks',
  templateUrl: './masks.component.html'
})
export class MasksComponent implements OnInit, OnDestroy {
  /**
   * Horizontal menu and redirection links.
   */
  menuItems: HorizontalNav[] = [
    { label: 'Masks', routeName: '/tasks/import-supertasks/masks' },
    {
      label: 'WordList/Rules Bulk',
      routeName: '/tasks/import-supertasks/wrbulk'
    }
  ];

  /** Form group for the new Mask. */
  createForm: FormGroup;

  /** Select Options. */
  selectBenchmarktype = benchmarkType;
  selectCrackertype: any;

  /** Select Options Mapping */
  selectCrackertypeMap = {
    fieldMapping: CRACKER_TYPE_FIELD_MAPPING
  };

  /**
   * @param {UnsubscribeService} unsubscribeService - The service responsible for managing subscriptions.
   * @param {ChangeDetectorRef} changeDetectorRef - The reference to the Angular ChangeDetectorRef.
   * @param {AutoTitleService} titleService - The service responsible for setting the page title.
   * @param {AlertService} alert - The service for displaying alert messages.
   * @param {GlobalService} gs - The service providing global functionality.
   * @param {Router} router - The Angular Router service for navigation.
   * @returns {void}
   *
   * @ngModule AppModule
   */
  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    this.buildForm();
    titleService.set(['Import SuperTask - Mask']);
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
   * Builds the form for creating a new Mask.
   */
  buildForm(): void {
    this.createForm = new FormGroup({
      name: new FormControl('ffgf', [Validators.required]),
      isSmall: new FormControl(''),
      isCPU: new FormControl('', [Validators.required]),
      optFlag: new FormControl(''),
      useBench: new FormControl(null || false),
      crackerBinaryId: new FormControl(1),
      masks: new FormControl('')
    });
  }

  /**
   * Loads data, specifically Cracker Type, for the component.
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
   * Handles the submission of the form to create a new Mask.
   *
   */
  onSubmit() {
    if (this.createForm.valid) {
      const createSubscription$ = this.gs
        .create(SERV.TASKS, this.createForm.value)
        .subscribe(() => {
          this.alert.okAlert('New Mask created!', '');
          this.createForm.reset(); // success, we reset form
          this.router.navigate(['tasks/show-tasks']);
        });

      this.unsubscribeService.add(createSubscription$);
    }
  }
}
