import { zPreTaskResponse } from '@generated/api/zod';
import { firstValueFrom } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PretaskId } from '@models/id.types';
import { JPretask } from '@models/pretask.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import {
  PreconfiguredTasksRoleService,
  PretaskRole
} from '@services/roles/tasks/preconfiguredTasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { ConfigService } from '@services/shared/config.service';

import { yesNo } from '@src/app/core/_constants/general.config';
import {
  EditPretaskForm,
  getEmptyEditPretaskForm
} from '@src/app/tasks/edit-preconfigured-tasks/edit-preconfigured-tasks.form';
import { FileEditType, TaskRoutePath } from '@src/app/tasks/tasks-routing.constants';

@Component({
  selector: 'app-edit-preconfigured-tasks',
  templateUrl: './edit-preconfigured-tasks.component.html',
  standalone: false
})
export class EditPreconfiguredTasksComponent implements OnInit {
  isLoading = true;
  isUpdatingLoading = false;
  isReadOnly = false;

  updateForm!: FormGroup<EditPretaskForm>;

  selectYesno = yesNo;

  editedPretaskIndex!: PretaskId;

  protected readonly FileEditType = FileEditType;
  protected readonly PretaskRole = PretaskRole;

  private titleService = inject(AutoTitleService);
  private route = inject(ActivatedRoute);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);
  private router = inject(Router);
  private serializer = inject(JsonAPISerializer);
  private cs = inject(ConfigService);
  private http = inject(HttpClient);
  protected roleService = inject(PreconfiguredTasksRoleService);

  constructor() {
    this.titleService.set(['Edit Preconfigured Tasks']);
  }

  async ngOnInit(): Promise<void> {
    this.isReadOnly = !this.roleService.hasRole(PretaskRole.Edit);
    this.updateForm = getEmptyEditPretaskForm(this.isReadOnly);

    this.editedPretaskIndex = +this.route.snapshot.params['id'];

    try {
      await this.loadPretask();
      this.isLoading = false;
    } catch (e: unknown) {
      const status = e instanceof HttpErrorResponse ? e.status : undefined;
      if (status === 403) {
        this.router.navigateByUrl('/forbidden');
        return;
      }

      if (status === 404) {
        this.router.navigateByUrl('/not-found');
        return;
      }

      console.error('Error loading pretask:', e);
      const msg = status ? `Error loading pretask (server returned ${status}).` : 'Error loading pretask.';
      this.alert.showErrorMessage(msg);
      this.isLoading = false;
    }
  }

  private async loadPretask(): Promise<void> {
    const url = `${this.cs.getEndpoint()}${SERV.PRETASKS.URL}/${this.editedPretaskIndex}`;

    const response = await firstValueFrom<ResponseWrapper>(this.http.get<ResponseWrapper>(url));
    const pretask: JPretask = this.serializer.deserialize(response, zPreTaskResponse);

    this.updateForm.setValue({
      pretaskId: pretask.id,
      statusTimer: pretask.statusTimer,
      useNewBench: pretask.useNewBench,
      updateData: {
        taskName: pretask.taskName,
        attackCmd: pretask.attackCmd,
        color: pretask.color ?? null,
        chunkTime: pretask.chunkTime,
        priority: pretask.priority,
        maxAgents: pretask.maxAgents,
        isCpuTask: pretask.isCpuTask,
        isSmall: pretask.isSmall
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.isReadOnly) {
      return;
    }

    if (!this.updateForm.valid) {
      this.updateForm.markAllAsTouched();
      this.updateForm.updateValueAndValidity();
      return;
    }

    this.isUpdatingLoading = true;
    try {
      await firstValueFrom(
        this.gs.update(SERV.PRETASKS, this.editedPretaskIndex, this.updateForm.controls.updateData.getRawValue())
      );
      this.alert.showSuccessMessage('PreTask saved');
      this.router.navigate([TaskRoutePath.PretaskList]);
    } catch (err) {
      console.error('Error updating preconfigured Task', err);
    } finally {
      this.isUpdatingLoading = false;
    }
  }
}
