import { CRACKER_TYPE_FIELD_MAPPING } from '@constants/select.config';
import { benchmarkType } from '@constants/tasks.config';
import { zCrackerBinaryTypeListResponse } from '@generated/api/zod';

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { JCrackerBinaryType, zCrackerBinaryTypeList } from '@models/cracker-binary.model';
import { HorizontalNav } from '@models/horizontalnav.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { ResponseWrapper } from '@src/app/core/_models/response.model';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { transformSelectOptions } from '@src/app/shared/utils/forms';

/**
 * ImportSupertaskMaskComponent is a component responsible for importing SuperTasks with masks.
 *
 */
@Component({
  selector: 'app-import-supertasks',
  templateUrl: './masks.component.html',
  standalone: false
})
export class MasksComponent implements OnInit, OnDestroy {
  /**
   * @private unsubscribeService - The service responsible for managing subscriptions.
   * @private changeDetectorRef - The reference to the Angular ChangeDetectorRef.
   * @private titleService - The service responsible for setting the page title.
   * @private alert - The service for displaying alert messages.
   * @private gs - The service providing global functionality.
   * @private router - The Angular Router service for navigation.
   * @private serializer - The serializer service for API response.
   */

  private unsubscribeService = inject(UnsubscribeService);
  private titleService = inject(AutoTitleService);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);
  private router = inject(Router);
  private serializer = inject(JsonAPISerializer);

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
  selectCrackertype = undefined;

  /** Select Options Mapping */
  selectCrackertypeMap = {
    fieldMapping: CRACKER_TYPE_FIELD_MAPPING
  };

  /** on create loading */
  isLoading = false;

  /**
   * @returns {void}
   *
   * @ngModule AppModule
   */
  constructor() {
    this.buildForm();
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
      name: new FormControl('', [Validators.required]),
      maxAgents: new FormControl(0),
      isSmall: new FormControl(false),
      isCpuTask: new FormControl(false),
      optFlag: new FormControl(false),
      useNewBench: new FormControl(true),
      crackerBinaryId: new FormControl(1),
      masks: new FormControl('', [Validators.required])
    });
  }

  /**
   * Loads data, specifically Cracker Type, for the component.
   */
  loadData(): void {
    const loadSubscription$ = this.gs
      .getAll(SERV.CRACKERS_TYPES, { include: ['crackerVersions'] })
      .subscribe((response: ResponseWrapper) => {
        const crackerBinaryTypes: JCrackerBinaryType[] = zCrackerBinaryTypeList.parse(
          this.serializer.deserialize(response, zCrackerBinaryTypeListResponse)
        );

        this.selectCrackertype = transformSelectOptions(crackerBinaryTypes, CRACKER_TYPE_FIELD_MAPPING);
      });
    this.unsubscribeService.add(loadSubscription$);
  }

  /**
   * Handles the submission of the form to create a new super task via the backend helper.
   * The backend handles all hcmask parsing, pretask creation and supertask creation.
   */
  onSubmit(): void {
    if (this.createForm.valid) {
      this.isLoading = true;
      const form = this.createForm.value;
      const payload = {
        name: form.name,
        masks: form.masks,
        isCpu: form.isCpuTask,
        isSmall: form.isSmall,
        optimized: form.optFlag,
        crackerBinaryTypeId: form.crackerBinaryId,
        benchtype: form.useNewBench ? 'speed' : 'runtime',
        maxAgents: form.maxAgents
      };

      const subscription$ = this.gs.chelper(SERV.HELPER, 'maskSupertaskBuilder', payload).subscribe({
        next: () => {
          this.alert.showSuccessMessage('New Supertask Mask created');
          this.router.navigate(['/tasks/supertasks']);
        },
        error: (error) => {
          console.error('Error creating mask supertask:', error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });

      this.unsubscribeService.add(subscription$);
    } else {
      this.createForm.markAllAsTouched();
      this.createForm.updateValueAndValidity();
    }
  }
}
