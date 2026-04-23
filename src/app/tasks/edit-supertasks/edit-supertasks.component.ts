import { zPreTaskListResponse, zSupertaskResponse } from '@generated/api/zod';
import { firstValueFrom } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PretaskId } from '@models/id.types';
import { JPretask } from '@models/pretask.model';
import { ResponseWrapper } from '@models/response.model';
import { JSuperTask } from '@models/supertask.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { RelationshipType, SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { SupertaskRole, SupertasksRoleService } from '@services/roles/tasks/supertasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { PretasksTableComponent } from '@components/tables/pretasks-table/pretasks-table.component';

import { SUPER_TASK_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';
import {
  EditSupertaskViewForm,
  getEmptyEditSupertaskViewForm
} from '@src/app/tasks/edit-supertasks/edit-supertasks.form';
import { TaskRoutePath } from '@src/app/tasks/tasks-routing.constants';

@Component({
  selector: 'app-edit-supertasks',
  templateUrl: './edit-supertasks.component.html',
  standalone: false
})
export class EditSupertasksComponent implements OnInit {
  isLoading = true;

  viewForm: FormGroup<EditSupertaskViewForm> = getEmptyEditSupertaskViewForm();

  selectPretasks: SelectOption<PretaskId>[] | undefined;

  editedSTIndex = 0;
  editName = '';

  protected readonly SupertaskRole = SupertaskRole;

  @ViewChild('superTasksPretasksTable') superTasksPretasksTable?: PretasksTableComponent;
  @ViewChild('superTasksPretaskNotContainedTable') superTasksPretasksNotContainedTable?: PretasksTableComponent;

  private changeDetectorRef = inject(ChangeDetectorRef);
  private titleService = inject(AutoTitleService);
  private route = inject(ActivatedRoute);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);
  private router = inject(Router);
  private serializer = inject(JsonAPISerializer);
  private confirmDialog = inject(ConfirmDialogService);
  protected roleService = inject(SupertasksRoleService);

  constructor() {
    this.titleService.set(['Edit SuperTasks']);
  }

  async ngOnInit(): Promise<void> {
    this.editedSTIndex = +this.route.snapshot.params['id'];
    await this.loadData();
  }

  async loadData(): Promise<void> {
    const params = new RequestParamBuilder().addInclude('pretasks').create();
    try {
      const response = await firstValueFrom<ResponseWrapper>(this.gs.get(SERV.SUPER_TASKS, this.editedSTIndex, params));
      await this.applySupertaskResponse(response, true);
    } catch (err) {
      await this.handleLoadError(err);
    }
  }

  refresh(): void {
    this.isLoading = true;
    void this.loadData();
  }

  private async applySupertaskResponse(response: ResponseWrapper, loadAvailablePretasks: boolean): Promise<void> {
    const supertask: JSuperTask = this.serializer.deserialize(response, zSupertaskResponse);
    this.editName = supertask.supertaskName;
    this.viewForm.patchValue({
      supertaskId: supertask.id,
      supertaskName: supertask.supertaskName
    });

    if (loadAvailablePretasks && this.roleService.hasRole(SupertaskRole.EditSupertaskPreTasks)) {
      const responsePT = await firstValueFrom<ResponseWrapper>(this.gs.getAll(SERV.PRETASKS));
      const pretasks: JPretask[] = this.serializer.deserialize(responsePT, zPreTaskListResponse);
      const availablePretasks = this.getAvailablePretasks(supertask.pretasks ?? [], pretasks);
      this.selectPretasks = transformSelectOptions(availablePretasks, SUPER_TASK_FIELD_MAPPING);
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
    } else {
      this.isLoading = false;
    }
  }

  private async handleLoadError(err: unknown): Promise<void> {
    const status = err instanceof HttpErrorResponse ? err.status : undefined;
    if (status === 403) {
      this.router.navigateByUrl('/forbidden');
      return;
    }
    if (status === 404) {
      this.router.navigateByUrl('/not-found');
      return;
    }

    // For server errors retry a fallback request without includes so at least
    // the primary record can be displayed.
    if (err instanceof HttpErrorResponse && status && status >= 500) {
      console.warn('loadData(): request with includes failed, retrying without includes', err);
      try {
        const response = await firstValueFrom<ResponseWrapper>(this.gs.get(SERV.SUPER_TASKS, this.editedSTIndex));
        await this.applySupertaskResponse(response, true);
      } catch (err2: unknown) {
        console.error('Error loading supertask:', err2);
        const msg =
          err2 instanceof HttpErrorResponse && err2.status
            ? `Error loading supertask (server returned ${err2.status}).`
            : 'Error loading supertask.';
        this.alert.showErrorMessage(msg);
        this.isLoading = false;
      }
      return;
    }

    console.error('Error loading supertask:', err);
    const msg = status ? `Error loading supertask (server returned ${status}).` : 'Error loading supertask.';
    this.alert.showErrorMessage(msg);
    this.isLoading = false;
  }

  getAvailablePretasks(assigning: JPretask[], pretasks: JPretask[]): JPretask[] {
    return pretasks.filter((pretask) => assigning.findIndex((assignedTask) => assignedTask.id === pretask.id) === -1);
  }

  async onPretaskAdd(pretasks: JPretask[]): Promise<void> {
    if (!pretasks.length || !this.editedSTIndex) return;

    const body = {
      data: pretasks.map((pretask) => ({
        type: RelationshipType.PRETASKS,
        id: pretask.id
      }))
    };

    try {
      await firstValueFrom(
        this.gs.postRelationships(SERV.SUPER_TASKS, this.editedSTIndex, RelationshipType.PRETASKS, body)
      );
      this.alert.showSuccessMessage(`${pretasks.length} pretask(s) added to Supertask`);
      this.refresh();
      this.onPretaskChanged();
    } catch (err) {
      this.alert.showErrorMessage('Failed to add pretask(s).');
      console.error('Failed to add pretasks:', err);
    }
  }

  onPretaskChanged(): void {
    this.superTasksPretasksTable?.reload();
    this.superTasksPretasksNotContainedTable?.reload();
  }

  async onDelete(): Promise<void> {
    const confirmed = await firstValueFrom(this.confirmDialog.confirmDeletion('Supertask', this.editName));
    if (!confirmed) return;

    await firstValueFrom(this.gs.delete(SERV.SUPER_TASKS, this.editedSTIndex));
    await this.router.navigate([TaskRoutePath.SupertaskList]);
    this.alert.showSuccessMessage(`Succesfully deleted Supertask: ${this.editedSTIndex}`);
  }
}
