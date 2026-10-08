import { HashListFormat } from '@constants/hashlist.config';
import { zCrackerBinaryListResponse, zHashlistListResponse, zSupertaskResponse } from '@generated/api/zod';
import { Observable, Subject, map, of, switchMap, tap } from 'rxjs';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { JCrackerBinary } from '@models/cracker-binary.model';
import { JHashlist } from '@models/hashlist.model';
import { CrackerBinaryId, CrackerBinaryTypeId, HashlistId } from '@models/id.types';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { zIdRouteParams } from '@models/routes.schema';
import { JSuperTask } from '@models/supertask.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { CrackerBinaryTypesService } from '@services/crackers/cracker-binary-types.service';
import {
  CrackerHashtypeSupportService,
  SupportedCrackerBinaryIds,
  buildUnsupportedHashtypeMessage,
  filterSupportedCrackerVersions
} from '@services/crackers/cracker-hashtype-support.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { CRACKER_VERSION_FIELD_MAPPING, DEFAULT_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';

export interface ApplyHashlistForm {
  supertaskTemplateId: FormControl<number | null>;
  /** Read-only, name of the supertask */
  supertaskName: FormControl<string | null>;
  /** Read-only, name of the cracker binary type of the supertask */
  crackerBinaryType: FormControl<string | null>;
  hashlistId: FormControl<HashlistId | null>;
  /** The cracker version to run the supertask with */
  crackerBinaryId: FormControl<CrackerBinaryId | null>;
}

/**
 * Runs a supertask on a hashlist. The cracker binary type is dictated by the supertask, only a version of that
 * type can be chosen, restricted to the versions supporting the hashtype of the selected hashlist.
 */
@Component({
  selector: 'app-applyhashlist',
  templateUrl: './applyhashlist.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false
})
export class ApplyHashlistComponent implements OnInit {
  /** Flag indicating whether the hashlists are still loading. */
  isLoading = true;

  form: FormGroup<ApplyHashlistForm>;

  /** On form create show a spinner loading */
  isCreatingLoading = false;

  selectHashlists: SelectOption<HashlistId>[];
  selectCrackerversions: SelectOption<CrackerBinaryId>[] = [];

  /** True if the supertask's cracker type has no accessible version */
  noCrackerVersionsAvailable = false;

  /** Block message when no accessible version of the type supports the hashtype of the selected hashlist */
  unsupportedHashtypeMessage: string | null = null;

  /** Supertask id from the route */
  editedIndex: number;

  /** Accessible versions of the supertask's cracker type, null until they are loaded */
  private versions: JCrackerBinary[] | null = null;

  /** Loaded hashlists, to look up the hashtype of the selected one */
  private hashlists: JHashlist[] = [];

  /** The selected hashlist, undefined without a selection */
  private selectedHashlist: JHashlist | undefined;

  /** Versions supporting the hashtype of the selected hashlist, null while no hashlist is selected */
  private supportedCrackerBinaryIds: SupportedCrackerBinaryIds = null;

  /** Hashlist selections, the latest one wins and superseded support lookups are cancelled */
  private readonly hashlistSelection$ = new Subject<HashlistId | number[] | null>();

  private destroyRef = inject(DestroyRef);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private titleService = inject(AutoTitleService);
  private route = inject(ActivatedRoute);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);
  private router = inject(Router);
  private crackerSupport = inject(CrackerHashtypeSupportService);
  private crackerBinaryTypes = inject(CrackerBinaryTypesService);

  constructor() {
    this.titleService.set(['Apply Hashlist']);
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      this.editedIndex = zIdRouteParams.parse(params).id;
      this.initForm();
      this.setupCrackerSelection();
      this.loadData();
    });
  }

  /**
   * Builds the form. The supertask name and type are shown read-only, the version is the only cracker choice.
   */
  initForm(): void {
    this.form = new FormGroup<ApplyHashlistForm>({
      supertaskTemplateId: new FormControl<number | null>(this.editedIndex),
      supertaskName: new FormControl<string | null>({ value: null, disabled: true }),
      crackerBinaryType: new FormControl<string | null>({ value: null, disabled: true }),
      hashlistId: new FormControl<HashlistId | null>(null),
      crackerBinaryId: new FormControl<CrackerBinaryId | null>(null, [Validators.required])
    });

    this.form.controls.hashlistId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((hashlistId) => {
      this.handleChangeHashlist(hashlistId);
    });
  }

  /**
   * Loads the supertask (name, type and then the versions of the type) and the hashlists.
   */
  loadData(): void {
    this.loadSupertask();
    this.loadHashlistSelectOptions();
  }

  /**
   * Load hashlist select options
   */
  loadHashlistSelectOptions(): void {
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
   * Restrict the version select to the versions supporting the hashtype of the selected hashlist.
   * @param hashlistId  Selected hashlist, the multiselect emits [] when it is cleared
   */
  handleChangeHashlist(hashlistId: HashlistId | number[] | null): void {
    this.hashlistSelection$.next(hashlistId);
  }

  /**
   * Load the supertask, show its name and type and load the versions of its type.
   */
  private loadSupertask(): void {
    this.gs
      .get(SERV.SUPER_TASKS, this.editedIndex)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ResponseWrapper) => {
          const supertask: JSuperTask = new JsonAPISerializer().deserialize(response, zSupertaskResponse);
          this.form.controls.supertaskName.setValue(supertask.supertaskName);
          this.crackerBinaryTypes
            .getTypeName(supertask.crackerBinaryTypeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((name) => {
              this.form.controls.crackerBinaryType.setValue(name);
              this.changeDetectorRef.detectChanges();
            });
          this.loadVersions(supertask.crackerBinaryTypeId);
        },
        error: (error: unknown) => {
          // the global HTTP error dialog shows the reason; without the supertask no version can be offered
          console.error('Error loading the supertask:', error);
        }
      });
  }

  /**
   * Load the accessible versions of the supertask's cracker type, once.
   */
  private loadVersions(typeId: CrackerBinaryTypeId): void {
    const requestParams = new RequestParamBuilder()
      .addFilter({ field: 'crackerBinaryTypeId', operator: FilterType.EQUAL, value: typeId })
      .create();
    this.gs
      .getAll(SERV.CRACKERS, requestParams)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ResponseWrapper) => {
          this.versions = new JsonAPISerializer().deserialize(response, zCrackerBinaryListResponse);
          this.applyCrackerSupport();
        },
        error: (error: unknown) => {
          // the global HTTP error dialog shows the reason; fail closed, nothing can be selected
          console.error('Error loading cracker versions:', error);
          this.versions = [];
          this.applyCrackerSupport();
        }
      });
  }

  /**
   * Wire the hashlist selection: a hashlist restricts the version select to the versions supporting its hashtype.
   * switchMap cancels superseded lookups, so the latest selection always wins.
   */
  private setupCrackerSelection(): void {
    this.hashlistSelection$
      .pipe(
        // while a lookup runs, the version selected before must not be submittable
        tap(() => this.form.controls.crackerBinaryId.markAsPending()),
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
      .subscribe(({ hashlist, supported }) => {
        this.selectedHashlist = hashlist;
        this.supportedCrackerBinaryIds = supported;
        this.applyCrackerSupport();
      });
  }

  /**
   * Offer the supported versions of the type and select the current one if it is still supported, else the
   * newest. Without any supported version the selection is blocked with an explanation.
   */
  private applyCrackerSupport(): void {
    if (this.versions === null) {
      // applied once the versions of the supertask's type are loaded
      return;
    }
    const versionCtrl = this.form.controls.crackerBinaryId;
    const supported = filterSupportedCrackerVersions(this.versions, this.supportedCrackerBinaryIds);
    this.selectCrackerversions = transformSelectOptions(supported, CRACKER_VERSION_FIELD_MAPPING);
    this.noCrackerVersionsAvailable = this.versions.length === 0;
    const hashlist = this.selectedHashlist;
    this.unsupportedHashtypeMessage =
      hashlist && this.versions.length > 0 && supported.length === 0
        ? buildUnsupportedHashtypeMessage(hashlist.hashTypeId, hashlist.hashType?.description)
        : null;

    const current = versionCtrl.value;
    const keep = current !== null && supported.some((version) => version.id === current);
    versionCtrl.setValue(keep ? current : (supported.at(-1)?.id ?? null));
    this.changeDetectorRef.detectChanges();
  }

  /**
   * OnSubmit save changes
   */
  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      this.isCreatingLoading = true;
      const adaptedFormValue = {
        supertaskTemplateId: formValue.supertaskTemplateId,
        hashlistId: formValue.hashlistId,
        crackerVersionId: formValue.crackerBinaryId
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
