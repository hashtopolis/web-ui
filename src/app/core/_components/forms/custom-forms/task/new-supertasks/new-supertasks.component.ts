import { zPreTaskListResponse } from '@generated/api/zod';
import { distinctUntilChanged } from 'rxjs';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DEFAULT_CRACKER_BINARY_TYPE_NAME } from '@models/cracker-binary.model';
import { CrackerBinaryTypeId, PretaskId } from '@models/id.types';
import { JPretask } from '@models/pretask.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { CrackerBinaryTypeName, CrackerBinaryTypesService } from '@services/crackers/cracker-binary-types.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { CRACKER_TYPE_FIELD_MAPPING, PRETASKS_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';

export interface NewSupertaskForm {
  supertaskName: FormControl<string>;
  crackerBinaryTypeId: FormControl<CrackerBinaryTypeId | null>;
  pretasks: FormControl<PretaskId[]>;
}

/**
 * Creates a supertask. A supertask has exactly one cracker binary type, so the type is chosen first and only
 * pretasks of that type can be added.
 */
@Component({
  selector: 'app-new-supertasks',
  templateUrl: './new-supertasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class NewSupertasksComponent implements OnInit {
  /** Flag indicating whether the pretasks are still loading. */
  isLoading = true;

  form = new FormGroup<NewSupertaskForm>({
    supertaskName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    crackerBinaryTypeId: new FormControl<CrackerBinaryTypeId | null>(null, [Validators.required]),
    pretasks: new FormControl<PretaskId[]>([], { nonNullable: true, validators: [Validators.required] })
  });

  selectCrackerTypes: SelectOption<CrackerBinaryTypeId>[] = [];

  /** Pretasks of the selected cracker type */
  selectPretasks: SelectOption<PretaskId>[] = [];

  /** All loaded pretasks, filtered into selectPretasks by the selected type */
  private pretasks: JPretask[] = [];

  private destroyRef = inject(DestroyRef);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private titleService = inject(AutoTitleService);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);
  private router = inject(Router);
  private crackerBinaryTypes = inject(CrackerBinaryTypesService);

  constructor() {
    this.titleService.set(['New Supertask']);
  }

  ngOnInit(): void {
    // pretasks of another type must never be sent, a type change starts the selection over; the HTTP cache may
    // emit the type list twice (stale, then fresh), which preselects the same type again and must not clear
    this.form.controls.crackerBinaryTypeId.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.form.controls.pretasks.setValue([]);
        this.filterPretasks();
      });
    this.loadData();
  }

  /**
   * Loads the cracker types (preselecting hashcat) and the pretasks.
   */
  loadData(): void {
    this.crackerBinaryTypes
      .getTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (types: CrackerBinaryTypeName[]) => {
          this.selectCrackerTypes = transformSelectOptions(types, CRACKER_TYPE_FIELD_MAPPING);
          const preferred = types.find((type) => type.typeName === DEFAULT_CRACKER_BINARY_TYPE_NAME) ?? types[0];
          this.form.controls.crackerBinaryTypeId.setValue(preferred?.id ?? null);
          this.changeDetectorRef.detectChanges();
        },
        error: (error: unknown) => {
          // the global HTTP error dialog shows the reason
          console.error('Failed to load the cracker types:', error);
        }
      });

    this.gs
      .getAll(SERV.PRETASKS)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: ResponseWrapper) => {
        this.pretasks = new JsonAPISerializer().deserialize(response, zPreTaskListResponse);
        this.filterPretasks();
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
  }

  /**
   * Creates the supertask with the selected type and pretasks.
   */
  onSubmit(): void {
    if (this.form.valid) {
      this.gs
        .create(SERV.SUPER_TASKS, this.form.getRawValue())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.alert.showSuccessMessage('New Supertask created');
          this.router.navigate(['tasks/supertasks']);
        });
    } else {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
  }

  /** Offer the pretasks of the selected cracker type */
  private filterPretasks(): void {
    const typeId = this.form.controls.crackerBinaryTypeId.value;
    const ofType = this.pretasks.filter((pretask) => pretask.crackerBinaryTypeId === typeId);
    this.selectPretasks = transformSelectOptions(ofType, PRETASKS_FIELD_MAPPING);
  }
}
