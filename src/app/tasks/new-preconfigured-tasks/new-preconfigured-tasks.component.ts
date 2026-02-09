import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { JCrackerBinaryType } from '@models/cracker-binary.model';
import { JFile, TaskSelectFile } from '@models/file.model';
import { JPretask } from '@models/pretask.model';
import { ResponseWrapper } from '@models/response.model';
import { JTask } from '@models/task.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UIConfigService } from '@services/shared/storage.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { CRACKER_TYPE_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { benchmarkType } from '@src/app/core/_constants/tasks.config';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';
import { NewPretaskForm, getNewPretaskForm } from '@src/app/tasks/new-preconfigured-tasks/new-preconfigured-tasks.form';

@Component({
  selector: 'app-new-preconfigured-tasks',
  templateUrl: './new-preconfigured-tasks.component.html',
  standalone: false
})
export class NewPreconfiguredTasksComponent implements OnInit, OnDestroy {
  isLoading = true;
  createForm: FormGroup<NewPretaskForm>;

  selectBenchmarktype = benchmarkType;
  selectCrackertype: SelectOption[];
  isCreatingLoading = false;

  selectCrackertypeMap = {
    fieldMapping: CRACKER_TYPE_FIELD_MAPPING
  };

  copyMode = false;
  editedIndex: number;
  whichView: string;

  private unsubscribeService = inject(UnsubscribeService);
  private titleService = inject(AutoTitleService);
  private route = inject(ActivatedRoute);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);
  private router = inject(Router);
  private uiService = inject(UIConfigService);

  constructor() {
    this.onInitialize();
    this.titleService.set(['New Preconfigured Tasks']);
  }

  onInitialize() {
    this.route.params.subscribe((params: Params) => {
      this.editedIndex = +params['id'];
      this.copyMode = params && params['id'] !== null;
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.whichView = this.determineView(data['kind']);
      this.initializeForm(this.whichView);
    });

    this.buildForm();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  private determineView(kind: string): string {
    switch (kind) {
      case 'new-preconfigured-tasks':
        return 'create';
      case 'copy-preconfigured-tasks':
        return 'edit';
      case 'copy-tasks':
        return 'task';
      default:
        return 'create';
    }
  }

  private initializeForm(view: string): void {
    switch (view) {
      case 'edit':
        this.initForm(true);
        break;
      case 'task':
        this.initForm(false);
        break;
    }
  }

  buildForm() {
    this.createForm = getNewPretaskForm(this.uiService);
  }

  loadData() {
    const loadCrackersSubscription$ = this.gs.getAll(SERV.CRACKERS_TYPES).subscribe((response: ResponseWrapper) => {
      const crackerTypes = new JsonAPISerializer().deserialize<JCrackerBinaryType[]>({
        data: response.data,
        included: response.included
      });
      this.selectCrackertype = transformSelectOptions(crackerTypes, CRACKER_TYPE_FIELD_MAPPING);
    });
    this.unsubscribeService.add(loadCrackersSubscription$);
  }

  getFormData() {
    return {
      attackCmd: this.createForm?.get('attackCmd')?.value ?? '',
      files: this.createForm?.get('files')?.value ?? []
    };
  }

  onUpdateForm(event: TaskSelectFile): void {
    this.createForm.patchValue({
      attackCmd: event.attackCmd,
      files: event.files
    });
  }

  private initForm(isPretask: boolean) {
    if (this.copyMode) {
      const endpoint = isPretask ? SERV.PRETASKS : SERV.TASKS;

      const onCopy$ = this.gs
        .get(endpoint, this.editedIndex, {
          include: isPretask ? ['pretaskFiles'] : ['files']
        })
        .subscribe((response: ResponseWrapper) => {
          const result = new JsonAPISerializer().deserialize<JPretask | JTask>({
            data: response.data,
            included: response.included
          });

          const filesArray: number[] = (result[isPretask ? 'pretaskFiles' : 'files'] || []).map(
            (file: JFile) => file['id']
          );

          this.createForm.setValue({
            taskName:
              result['taskName'] + `_(Copied_${isPretask ? 'pretask_id' : 'pretask_from_task_id'}_${this.editedIndex})`,
            attackCmd: result['attackCmd'],
            maxAgents: result['maxAgents'],
            chunkTime: result['chunkTime'],
            statusTimer: result['statusTimer'],
            priority: result['priority'],
            color: result['color'],
            isCpuTask: result['isCpuTask'],
            crackerBinaryTypeId: result['crackerBinaryTypeId'],
            isSmall: result['isSmall'],
            useNewBench: result['useNewBench'],
            isMaskImport: false,
            files: filesArray
          });
        });

      this.unsubscribeService.add(onCopy$);
    }
  }

  onSubmit() {
    if (this.createForm.valid) {
      this.isCreatingLoading = true;
      const onSubmitSubscription$ = this.gs.create(SERV.PRETASKS, this.createForm.value).subscribe(() => {
        this.alert.showSuccessMessage('New PreTask created');
        this.router.navigate(['tasks/preconfigured-tasks']);
        this.isCreatingLoading = false;
      });
      this.unsubscribeService.add(onSubmitSubscription$);
    } else {
      this.createForm.markAllAsTouched();
      this.createForm.updateValueAndValidity();
    }
  }
}
