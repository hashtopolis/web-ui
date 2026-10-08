import { HashListFormat } from '@constants/hashlist.config';
import { zCrackerBinaryListResponse, zCrackerBinaryTypeListResponse, zHashlistListResponse } from '@generated/api/zod';
import { EMPTY, Observable, Subject, catchError, map, of, switchMap, tap } from 'rxjs';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { JCrackerBinary, JCrackerBinaryType, zCrackerBinaryTypeList } from '@models/cracker-binary.model';
import { JHashlist } from '@models/hashlist.model';
import { CrackerBinaryId, CrackerBinaryTypeId, HashlistId } from '@models/id.types';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { zIdRouteParams } from '@models/routes.schema';

import { JsonAPISerializer } from '@services/api/serializer-service';
import {
  CrackerHashtypeSupportService,
  SupportedCrackerBinaryIds,
  buildUnsupportedHashtypeMessage,
  filterSupportedCrackerTypes,
  filterSupportedCrackerVersions,
  pickDefaultCrackerTypeId
} from '@services/crackers/cracker-hashtype-support.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import {
  CRACKER_TYPE_FIELD_MAPPING,
  CRACKER_VERSION_FIELD_MAPPING,
  DEFAULT_FIELD_MAPPING
} from '@src/app/core/_constants/select.config';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';

export interface ApplyHashlistForm {
  supertaskTemplateId: FormControl<number | null>;
  hashlistId: FormControl<HashlistId | null>;
  crackerBinaryId: FormControl<CrackerBinaryId | null>;
  crackerBinaryTypeId: FormControl<CrackerBinaryTypeId | null>;
}

/**
 * ApplyHashlistComponent is a component responsible for managing and applying hashlists.
 *
 */
@Component({
  selector: 'app-applyhashlist',
  templateUrl: './applyhashlist.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false
})
export class ApplyHashlistComponent implements OnInit {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the new Superhashlist. */
  form: FormGroup<ApplyHashlistForm>;

  /** On form create show a spinner loading */
  isCreatingLoading = false;

  /** Select Options. */
  selectHashlists: SelectOption<HashlistId>[];
  selectCrackertype: SelectOption<CrackerBinaryTypeId>[];
  selectCrackerversions: SelectOption<CrackerBinaryId>[];

  /** True if no cracker binary is accessible for the current user */
  noCrackerVersionsAvailable = false;

  /** Block message when no accessible cracker version supports the hashtype of the selected hashlist */
  unsupportedHashtypeMessage: string | null = null;

  /** Accessible cracker types with their versions, null until they are loaded */
  private crackerTypes: JCrackerBinaryType[] | null = null;

  /** Loaded hashlists, to look up the hashtype of the selected one */
  private hashlists: JHashlist[] = [];

  /** Versions supporting the hashtype of the selected hashlist, null while no hashlist is selected */
  private supportedCrackerBinaryIds: SupportedCrackerBinaryIds = null;

  /** Hashlist selections, the latest one wins and superseded support lookups are cancelled */
  private readonly hashlistSelection$ = new Subject<HashlistId | number[] | null>();

  /** Version loads of a cracker type, the latest one wins and superseded requests are cancelled */
  private readonly versionRequest$ = new Subject<{ typeId: number; preferredId: CrackerBinaryId | null }>();

  // Get Supertask Index
  editedIndex: number;

  /**
   * Constructor for the ApplyHashlistComponent.
   * Initializes and sets up necessary services, properties, and the form.
   *
   * @param {ChangeDetectorRef} changeDetectorRef - The reference to the Angular ChangeDetectorRef.
   * @param {AutoTitleService} titleService - The service responsible for setting the page title.
   * @param {ActivatedRoute} route - The Angular ActivatedRoute service for accessing route parameters.
   * @param {AlertService} alert - The service for displaying alert messages.
   * @param {GlobalService} gs - The service providing global functionality.
   * @param {Router} router - The Angular Router service for navigation.
   */
  private destroyRef = inject(DestroyRef);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private titleService = inject(AutoTitleService);
  private route = inject(ActivatedRoute);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);
  private router = inject(Router);
  private crackerSupport = inject(CrackerHashtypeSupportService);

  constructor() {
    this.setupCrackerSelection();
    this.onInitialize();
    this.buildForm();
    this.titleService.set(['Apply Hashlist']);
  }

  /**
   * Initializes the component by extracting and setting the user ID,
   */
  onInitialize() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      this.editedIndex = zIdRouteParams.parse(params).id;
      this.initForm();
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Builds the form for creating a new Superhashlist.
   */
  buildForm(): void {
    this.form = new FormGroup<ApplyHashlistForm>({
      supertaskTemplateId: new FormControl<number | null>(null),
      hashlistId: new FormControl<HashlistId | null>(null),
      crackerBinaryId: new FormControl<CrackerBinaryId | null>(null),
      crackerBinaryTypeId: new FormControl<CrackerBinaryTypeId | null>(null, [Validators.required])
    });
  }

  /**
   * Initializes the form for creating a new Superhashlist.
   * Sets up form controls with default values and subscribes to changes for handling select cracker binary.
   * Loads necessary data.
   *
   * @returns {void}
   */
  initForm() {
    this.form = new FormGroup<ApplyHashlistForm>({
      supertaskTemplateId: new FormControl<number | null>(this.editedIndex),
      hashlistId: new FormControl<HashlistId | null>(null),
      crackerBinaryId: new FormControl<CrackerBinaryId | null>(null),
      crackerBinaryTypeId: new FormControl<CrackerBinaryTypeId | null>(null, [Validators.required])
    });

    //subscribe to changes to handle select cracker binary
    this.form.controls.crackerBinaryId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((newvalue) => {
      if (newvalue !== null) {
        this.handleChangeBinary(newvalue);
      }
    });

    this.form.controls.hashlistId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((hashlistId) => {
      this.handleChangeHashlist(hashlistId);
    });

    this.loadData();
  }

  /**
   * Loads necessary data for the form, such as Hashlists, Cracker Types, and Crackers.
   * Populates select options for Hashlists, Cracker Types, and Crackers.
   * Handles subscriptions and updates form controls accordingly.
   */
  loadData() {
    this.loadHashlistSelectOptions();
    this.loadCrackerSelectOptions();
  }

  /**
   * Load hashlist select options
   */
  loadHashlistSelectOptions() {
    const requestParams = new RequestParamBuilder()
      .addFilter({ field: 'isArchived', operator: FilterType.EQUAL, value: false })
      .addFilter({ field: 'format', operator: FilterType.EQUAL, value: HashListFormat.TEXT })
      .addInclude('hashType')
      .create();

    this.gs
      .getAll(SERV.HASHLISTS, requestParams)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: ResponseWrapper) => {
        const hashlists: JHashlist[] = new JsonAPISerializer().deserialize(response, zHashlistListResponse);
        this.hashlists = hashlists;
        this.selectHashlists = transformSelectOptions(hashlists, DEFAULT_FIELD_MAPPING);
        this.isLoading = false;
        if (!this.selectHashlists.length) {
          this.alert.showErrorMessage('Before proceeding, you need to create a Hashlist.');
        }
        this.changeDetectorRef.detectChanges();
      });
  }

  /**
   * Load cracker type and version select options
   */
  loadCrackerSelectOptions() {
    this.gs
      .getAll(SERV.CRACKERS_TYPES, { include: ['crackerVersions'] })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: ResponseWrapper) => {
        const crackerTypes: JCrackerBinaryType[] = zCrackerBinaryTypeList.parse(
          new JsonAPISerializer().deserialize(response, zCrackerBinaryTypeListResponse)
        );
        const accessibleTypes = crackerTypes.filter((type) => type.crackerVersions.length > 0);
        this.crackerTypes = accessibleTypes;
        // the default type and version go through the cracker selection as well, so a hashlist chosen while the
        // types were loading is applied instead of being overwritten
        this.handleChangeHashlist(this.form.controls.hashlistId.value);
      });
  }

  /**
   * Handles the change event for the Cracker Binary select control (holding the type).
   * Loads the versions of the type, restricted to the ones supporting the hashtype of the selected hashlist.
   *
   * @param id           The selected cracker binary type id.
   * @param preferredId  Version to keep if it is still available, else the last version is selected.
   */
  handleChangeBinary(id: number, preferredId: CrackerBinaryId | null = null): void {
    this.versionRequest$.next({ typeId: id, preferredId });
  }

  /**
   * Restrict the cracker selects to the versions supporting the hashtype of the selected hashlist.
   * @param hashlistId  Selected hashlist, the multiselect emits [] when it is cleared
   */
  handleChangeHashlist(hashlistId: HashlistId | number[] | null): void {
    this.hashlistSelection$.next(hashlistId);
  }

  /**
   * Wire the cracker selection: a hashlist restricts the cracker selects to the versions supporting its hashtype,
   * a type loads its versions. switchMap cancels superseded requests, so the latest selection always wins.
   */
  private setupCrackerSelection(): void {
    // while a lookup or version load runs, the version selected before must not be submittable
    // (in this form crackerBinaryTypeId holds the version)
    const markVersionPending = () => this.form.controls.crackerBinaryTypeId.markAsPending();

    this.hashlistSelection$
      .pipe(
        tap(markVersionPending),
        switchMap((hashlistId) => {
          const hashlist =
            typeof hashlistId === 'number' ? this.hashlists.find((item) => item.id === hashlistId) : undefined;
          const supported$: Observable<SupportedCrackerBinaryIds> = hashlist
            ? this.crackerSupport.getSupportedCrackerBinaryIds(hashlist.hashTypeId)
            : of(null);
          return supported$.pipe(map((supported) => ({ hashlist, supported })));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ hashlist, supported }) => this.applyCrackerSupport(hashlist, supported));

    this.versionRequest$
      .pipe(
        tap(markVersionPending),
        switchMap(({ typeId, preferredId }) => {
          const requestParams = new RequestParamBuilder()
            .addFilter({ field: 'crackerBinaryTypeId', operator: FilterType.EQUAL, value: typeId })
            .create();
          return this.gs.getAll(SERV.CRACKERS, requestParams).pipe(
            map((response: ResponseWrapper) => ({ response, preferredId })),
            catchError((error: unknown) => {
              // the global HTTP error dialog shows the reason; fail closed, the version selected before belongs
              // to another type or hashlist
              console.error('Error loading cracker versions:', error);
              this.selectCrackerversions = [];
              this.form.controls.crackerBinaryTypeId.setValue(null);
              this.changeDetectorRef.detectChanges();
              return EMPTY;
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ response, preferredId }) => this.applyCrackerVersions(response, preferredId));
  }

  /**
   * Restrict the cracker types to the ones with a supported version and load the versions of the selected type.
   * Without any supported version the selection is blocked with an explanation.
   */
  private applyCrackerSupport(hashlist: JHashlist | undefined, supported: SupportedCrackerBinaryIds): void {
    this.supportedCrackerBinaryIds = supported;
    if (this.crackerTypes === null) {
      // the initial cracker selection applies the hashlist once the types are loaded
      return;
    }

    const types = filterSupportedCrackerTypes(this.crackerTypes, supported);
    this.selectCrackertype = transformSelectOptions(types, CRACKER_TYPE_FIELD_MAPPING);
    // in this form crackerBinaryId holds the type and crackerBinaryTypeId the version
    const typeCtrl = this.form.controls.crackerBinaryId;
    const versionCtrl = this.form.controls.crackerBinaryTypeId;

    if (types.length === 0) {
      this.unsupportedHashtypeMessage =
        hashlist && this.crackerTypes.length > 0
          ? buildUnsupportedHashtypeMessage(hashlist.hashTypeId, hashlist.hashType?.description)
          : null;
      this.selectCrackerversions = [];
      typeCtrl.setValue(null, { emitEvent: false });
      versionCtrl.setValue(null);
      this.noCrackerVersionsAvailable = this.crackerTypes.length === 0;
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.unsupportedHashtypeMessage = null;
    const currentTypeId = typeCtrl.value;
    const keepType = currentTypeId !== null && types.some((type) => type.id === currentTypeId);
    const typeId = (keepType ? currentTypeId : pickDefaultCrackerTypeId(types)) as CrackerBinaryTypeId;
    typeCtrl.setValue(typeId, { emitEvent: false });
    this.handleChangeBinary(typeId, versionCtrl.value);
  }

  /**
   * Offer the supported versions and select the preferred one if it is available, else the last version.
   */
  private applyCrackerVersions(response: ResponseWrapper, preferredId: CrackerBinaryId | null): void {
    const crackers: JCrackerBinary[] = filterSupportedCrackerVersions(
      new JsonAPISerializer().deserialize(response, zCrackerBinaryListResponse),
      this.supportedCrackerBinaryIds
    );
    this.selectCrackerversions = transformSelectOptions(crackers, CRACKER_VERSION_FIELD_MAPPING);
    const versionIds = this.selectCrackerversions.map((option) => option.id);
    const selected =
      preferredId !== null && versionIds.includes(preferredId) ? preferredId : (versionIds.at(-1) ?? null);
    this.form.controls.crackerBinaryTypeId.patchValue(selected);
    this.noCrackerVersionsAvailable = selected === null;
    this.changeDetectorRef.detectChanges();
  }

  /**
   * OnSubmit save changes
   */
  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      this.isCreatingLoading = true;
      // Adapt the form structure
      const adaptedFormValue = {
        supertaskTemplateId: formValue.supertaskTemplateId,
        hashlistId: formValue.hashlistId,
        crackerVersionId: formValue.crackerBinaryTypeId
      };
      this.gs
        .chelper(SERV.HELPER, 'createSupertask', adaptedFormValue)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.alert.showSuccessMessage('New Supertask created');
            this.router.navigate(['tasks/show-tasks']);
            this.isCreatingLoading = false;
          },
          error: () => {
            // the global error dialog shows the reason
            this.isCreatingLoading = false;
          }
        });
    } else {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
  }
}
