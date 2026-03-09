import { firstValueFrom } from 'rxjs';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { JCrackerBinary, JCrackerBinaryType } from '@models/cracker-binary.model';
import { FileType, TaskSelectFile } from '@models/file.model';
import { JHashlist } from '@models/hashlist.model';
import { JPreprocessor } from '@models/preprocessor.model';
import { JPretask } from '@models/pretask.model';
import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JTask } from '@models/task.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UIConfigService } from '@services/shared/storage.service';
import { TaskTooltipsLevel, TooltipService } from '@services/shared/tooltip.service';

import {
  CRACKER_TYPE_FIELD_MAPPING,
  CRACKER_VERSION_FIELD_MAPPING,
  DEFAULT_FIELD_MAPPING
} from '@src/app/core/_constants/select.config';
import { benchmarkType, staticChunking } from '@src/app/core/_constants/tasks.config';
import { CheatsheetComponent } from '@src/app/shared/alert/cheatsheet/cheatsheet.component';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';
import { AttackCommandData, NewTaskForm, getNewTaskForm } from '@src/app/tasks/new-tasks/new-tasks.form';
import { NewTaskRouteKind } from '@src/app/tasks/tasks-routing.constants';
import { environment } from '@src/environments/environment';

type FileId = number;

type HashListId = number;

type CopyData = Pick<
  JTask,
  | 'skipKeyspace'
  | 'crackerBinaryId'
  | 'staticChunks'
  | 'chunkSize'
  | 'forcePipe'
  | 'preprocessorId'
  | 'preprocessorCommand'
> & {
  files: FileId[];
  hashlistId: HashListId | null;
};

/**
 * Represents the NewTasksComponent responsible for creating a new Tasks.
 */
@Component({
  selector: 'app-new-tasks',
  templateUrl: './new-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false
})
export class NewTasksComponent implements OnInit {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the new Task. */
  form: FormGroup<NewTaskForm>;

  /** On form create show a spinner loading */
  isCreatingLoading = false;

  /** Select Options. */
  selectHashlists: SelectOption[];
  selectStaticChunking = staticChunking;
  selectBenchmarktype = benchmarkType;
  selectCrackertype: SelectOption[];
  selectCrackerversions: SelectOption[];
  selectPreprocessor: SelectOption[];

  // Copy Task or PreTask configuration
  copyMode = false;
  copyFiles: FileId[];
  editedIndex: number;

  // Tooltips
  tasktip: TaskTooltipsLevel;

  // Tables File Types
  protected readonly FileType = FileType;

  private formReady = false;

  private destroyRef = inject(DestroyRef);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private titleService = inject(AutoTitleService);
  private tooltipService = inject(TooltipService);
  private uiService = inject(UIConfigService);
  private route = inject(ActivatedRoute);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  constructor() {
    this.titleService.set(['New Task']);
  }

  /**
   * Initialize the component: subscribe to route params, build form,
   * load select options, and determine the view.
   */
  async ngOnInit(): Promise<void> {
    const params = await firstValueFrom(this.route.params);
    this.editedIndex = +params['id'];
    this.copyMode = params['id'] != null;
    this.tasktip = this.tooltipService.getTaskTooltips();

    const data = await firstValueFrom(this.route.data);
    this.buildForm();
    await this.loadSelectOptions();
    await this.determineView(data['kind'] as NewTaskRouteKind);
  }

  /**
   * Determine the view and set up the component accordingly.
   * @param kind The type of data (e.g., 'new-task', 'copy-task', 'copy-pretask').
   */
  private async determineView(kind: NewTaskRouteKind): Promise<void> {
    switch (kind) {
      case NewTaskRouteKind.CopyTask:
        await this.initForm(true);
        break;

      case NewTaskRouteKind.CopyPreTask:
        await this.initForm(false);
        break;
    }
  }

  /**
   * Builds the form for creating a Task.
   * Initializes the form controls with default or UI settings values.
   */
  buildForm(): void {
    this.form = getNewTaskForm(this.uiService);
    this.formReady = true;

    this.form.controls.crackerBinaryTypeId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newTypeId) => {
        this.handleChangeBinary(newTypeId);
      });

    this.form.controls.preprocessorId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((newValue) => {
      this.handleChangePreprocessor(newValue);
    });
  }

  /**
   * Loads all select options required for the form.
   */
  async loadSelectOptions(): Promise<void> {
    await Promise.all([
      this.loadHashlistSelectOptions(),
      this.loadCrackerSelectOptions(),
      this.loadPreprocessorSelectOptions()
    ]);
  }

  /**
   * Loads hashlists select options.
   */
  private async loadHashlistSelectOptions(): Promise<void> {
    const filter: Filter[] = [{ field: 'isArchived', operator: FilterType.EQUAL, value: false }];
    try {
      const response: ResponseWrapper = await firstValueFrom(this.gs.getAll(SERV.HASHLISTS, { filter }));
      const hashlists = new JsonAPISerializer().deserialize<JHashlist[]>({
        data: response.data,
        included: response.included
      });
      this.selectHashlists = transformSelectOptions(hashlists, DEFAULT_FIELD_MAPPING);
      this.isLoading = false;
      if (!this.selectHashlists.length) {
        this.alert.showErrorMessage('You need to create a Hashlist to continue creating a Task');
      }
      this.changeDetectorRef.detectChanges();
    } catch (error) {
      console.error('Error loading hashlist select options', error);
      this.alert.showErrorMessage('Failed to load hashlists');
    }
  }

  /**
   * Loads cracker type and version select options.
   */
  private async loadCrackerSelectOptions(): Promise<void> {
    try {
      const typeResponse: ResponseWrapper = await firstValueFrom(this.gs.getAll(SERV.CRACKERS_TYPES));
      const crackerTypes = new JsonAPISerializer().deserialize<JCrackerBinaryType[]>({
        data: typeResponse.data,
        included: typeResponse.included
      });
      this.selectCrackertype = transformSelectOptions(crackerTypes, CRACKER_TYPE_FIELD_MAPPING);

      let typeId = this.selectCrackertype.find((obj) => obj.name === 'hashcat')?.id;
      if (!typeId && this.selectCrackertype.length > 0) {
        typeId = this.selectCrackertype.slice(-1)[0].id;
      }
      if (!typeId) {
        console.warn('No cracker type found');
        return;
      }

      const requestParams = new RequestParamBuilder()
        .addFilter({ field: 'crackerBinaryTypeId', operator: FilterType.EQUAL, value: typeId })
        .create();

      const versionResponse: ResponseWrapper = await firstValueFrom(this.gs.getAll(SERV.CRACKERS, requestParams));

      const crackers = new JsonAPISerializer().deserialize<JCrackerBinary[]>({
        data: versionResponse.data,
        included: versionResponse.included
      });

      this.selectCrackerversions = transformSelectOptions(crackers, CRACKER_VERSION_FIELD_MAPPING);

      const lastItemId = this.selectCrackerversions.slice(-1)[0]?.id;
      if (typeId) this.form.controls.crackerBinaryTypeId.patchValue(Number(typeId), { emitEvent: false });
      if (lastItemId) this.form.controls.crackerBinaryId.patchValue(Number(lastItemId), { emitEvent: false });

      this.changeDetectorRef.detectChanges();
    } catch (error) {
      console.error('Error loading cracker options', error);
      this.alert.showErrorMessage('Failed to load cracker types or versions');
    }
  }

  /**
   * Loads preprocessor select options.
   */
  private async loadPreprocessorSelectOptions(): Promise<void> {
    try {
      const response: ResponseWrapper = await firstValueFrom(this.gs.getAll(SERV.PREPROCESSORS));
      const preprocessors = new JsonAPISerializer().deserialize<JPreprocessor[]>({
        data: response.data,
        included: response.included
      });
      this.selectPreprocessor = transformSelectOptions(preprocessors, DEFAULT_FIELD_MAPPING);
      this.changeDetectorRef.detectChanges();
    } catch (error) {
      console.error('Error loading preprocessor options', error);
      this.alert.showErrorMessage('Failed to load preprocessors');
    }
  }

  /**
   * Retrieves the form data containing attack command and files.
   * @returns An object with attack command and files.
   */
  protected getFormData(): AttackCommandData {
    if (!this.formReady) return { attackCmd: '', files: [], preprocessorCommand: '' };
    return {
      attackCmd: this.form.controls.attackCmd.value,
      files: this.form.controls.files.value,
      preprocessorCommand: this.form.controls.preprocessorCommand.value
    };
  }

  /**
   * Check if the current form has preprocessor enabled, otherwise dont show on table
   * @returns {boolean} True if the form is for a preprocessor task, false otherwise.
   */
  protected isPreprocessor(): boolean {
    if (!this.formReady) return false;
    return this.form.controls.preprocessorId.value !== 0;
  }

  /**
   * Updates the form based on the provided event data.
   * @param event - The event data containing attack command and files.
   */
  protected onUpdateForm(event: TaskSelectFile): void {
    if (event.type === 'CMD') {
      this.form.patchValue({
        attackCmd: event.attackCmd,
        files: event.files
      });
    } else {
      this.form.patchValue({
        preprocessorCommand: event.attackCmd
      });
    }
  }

  /**
   * Handle the change of cracker binary type and update the available cracker versions.
   * @param {number} id - The identifier of the selected cracker binary type.
   */
  private async handleChangeBinary(id: number): Promise<void> {
    const requestParams = new RequestParamBuilder()
      .addFilter({ field: 'crackerBinaryTypeId', operator: FilterType.EQUAL, value: id })
      .create();

    try {
      const response: ResponseWrapper = await firstValueFrom(this.gs.getAll(SERV.CRACKERS, requestParams));
      const crackers = new JsonAPISerializer().deserialize<JCrackerBinary[]>({
        data: response.data,
        included: response.included
      });
      this.selectCrackerversions = transformSelectOptions(crackers, CRACKER_VERSION_FIELD_MAPPING);

      // Select the last version by default
      const lastVersionId = this.selectCrackerversions.slice(-1)[0]?.id;
      const crackerCtrl = this.form.controls.crackerBinaryId;

      if (lastVersionId) {
        crackerCtrl.patchValue(Number(lastVersionId), { emitEvent: false });
        crackerCtrl.setErrors(null);
      } else {
        crackerCtrl.setErrors({ required: true });
        crackerCtrl.markAsTouched();
        crackerCtrl.markAsDirty();
        this.changeDetectorRef.detectChanges();
      }
    } catch (error) {
      console.error('Error loading cracker versions:', error);
      this.alert.showErrorMessage('Failed to load cracker versions');
    }
  }

  /**
   * Handle the change of preprocessor ID and update the form value accordingly.
   * - Only update value when necessary to avoid recursive calls
   * @param newId
   */
  private handleChangePreprocessor(newId: number): void {
    if (newId !== this.form.controls.preprocessorId.value) {
      this.form.controls.preprocessorId.setValue(newId, { emitEvent: false });
    }
  }

  /**
   * Initialize the form based on the copied data.
   * @param isTask Determines whether the copied data is a Task or Pretask.
   */
  private async initForm(isTask: boolean): Promise<void> {
    if (!this.copyMode) return;

    const endpoint = isTask ? SERV.TASKS : SERV.PRETASKS;
    const includedResources: (keyof JTask | keyof JPretask)[] = isTask
      ? ['hashlist', 'speeds', 'crackerBinary', 'crackerBinaryType', 'files']
      : ['pretaskFiles'];

    const requestParamBuilder = new RequestParamBuilder();
    includedResources.forEach((resource) => requestParamBuilder.addInclude(resource));
    const requestParams = requestParamBuilder.create();

    try {
      const response: ResponseWrapper = await firstValueFrom(this.gs.get(endpoint, this.editedIndex, requestParams));
      const task = new JsonAPISerializer().deserialize<JTask | JPretask>({
        data: response.data,
        included: response.included
      });

      const copyData = this.extractCopyData(task, isTask);
      this.copyFiles = copyData.files;

      this.form.patchValue({
        taskName: task.taskName + `_(Copied_${isTask ? 'task_id' : 'pretask_id'}_${this.editedIndex})`,
        notes: `Copied from ${isTask ? 'task' : 'pretask'} id ${this.editedIndex}`,
        attackCmd: task.attackCmd,
        maxAgents: task.maxAgents,
        chunkTime: task.chunkTime,
        priority: task.priority,
        color: task.color,
        isCpuTask: task.isCpuTask,
        crackerBinaryTypeId: task.crackerBinaryTypeId,
        isSmall: task.isSmall,
        useNewBench: task.useNewBench,
        isArchived: false,
        statusTimer: task.statusTimer,
        ...copyData
      });
    } catch (error) {
      console.error('Error initializing form with task data:', error);
      this.alert.showErrorMessage('Failed to load task for copying.');
    }
  }

  /**
   * Submits the form data and creates a new Task.
   */
  protected onSubmit(): void {
    if (this.form.valid) {
      this.isCreatingLoading = true;
      this.gs.create(SERV.TASKS, this.form.value).subscribe({
        next: () => {
          this.alert.showSuccessMessage('New Task created');
          this.isCreatingLoading = false;
          this.router
            .navigate(['tasks/show-tasks'])
            .then((success) => {
              if (!success) {
                console.error('Navigation failed.');
              }
            })
            .catch((error) => {
              console.error('Error navigating to tasks/show-tasks:', error);
            });
        },
        error: (err) => {
          console.error('Error creating task:', err);
          this.isCreatingLoading = false;
        }
      });
    } else {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
  }

  // Modal Information
  protected openHelpDialog(): void {
    this.dialog.open(CheatsheetComponent, { width: '100%' });
  }

  /**
   * Returns values that differ between JTask and JPretask as a single object.
   */
  private extractCopyData(task: JTask | JPretask, isTask: boolean): CopyData {
    if (isTask) {
      const t = task as JTask;
      return {
        files: (t.files ?? []).map((f) => f.id),
        hashlistId: t.hashlist?.id ?? null,
        skipKeyspace: t.skipKeyspace,
        crackerBinaryId: t.crackerBinaryId,
        staticChunks: t.staticChunks,
        chunkSize: t.chunkSize,
        forcePipe: t.forcePipe,
        preprocessorId: t.preprocessorId,
        preprocessorCommand: t.preprocessorCommand
      };
    }

    const p = task as JPretask;
    return {
      files: (p.pretaskFiles ?? []).map((f) => f.id),
      hashlistId: null,
      skipKeyspace: 0,
      crackerBinaryId: 1,
      staticChunks: 0,
      chunkSize: environment.config.tasks.chunkSize,
      forcePipe: false,
      preprocessorId: 0,
      preprocessorCommand: ''
    };
  }
}
