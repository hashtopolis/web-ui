import { DataTableDirective } from 'angular-datatables';
import { Subject, firstValueFrom } from 'rxjs';

import { HttpBackend, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { JAccessGroup } from '@models/access-group.model';
import { JHashlist } from '@models/hashlist.model';
import { JHashtype } from '@models/hashtype.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { HashListRoleService } from '@services/roles/hashlists/hashlist-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { ConfigService } from '@services/shared/config.service';
import { UnsavedChangesService } from '@services/shared/unsaved-changes.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { ACCESS_GROUP_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { CanComponentDeactivate } from '@src/app/core/_guards/pendingchanges.guard';
import { StaticArrayPipe } from '@src/app/core/_pipes/static-array.pipe';
import { getEditHashlistForm } from '@src/app/hashlists/edit-hashlist/edit-hashlist.form';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';

/**
 * Represents the EditHashlistComponent responsible for editing a new hashlists.
 */
@Component({
  selector: 'app-edit-hashlist',
  templateUrl: './edit-hashlist.component.html',
  standalone: false
})
export class EditHashlistComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the Hashlist. */
  updateForm: FormGroup;

  // Edit variables
  editedHashlistIndex: number;
  editedHashlist: JHashlist | undefined; // Change to Model
  hashtype: JHashtype | undefined;
  type: number | undefined; // Hashlist or SuperHashlist (format)

  // Lists of Selected inputs
  selectAccessgroup: Array<SelectOption> = [];

  // To Remove for use tables
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtTrigger: Subject<unknown> = new Subject<unknown>();

  private httpNoInterceptors: HttpClient;

  private unsavedChangesService = inject(UnsavedChangesService);
  private unsubscribeService = inject(UnsubscribeService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private titleService = inject(AutoTitleService);
  private format = inject(StaticArrayPipe);
  private route = inject(ActivatedRoute);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);
  private router = inject(Router);
  private cs = inject(ConfigService);
  private http = inject(HttpClient);
  private httpBackend = inject(HttpBackend);
  protected roleService = inject(HashListRoleService);

  /**
   * Constructor for the component.
   */
  constructor() {
    this.updateForm = getEditHashlistForm();
    this.titleService.set(['Edit Hashlist']);
    this.httpNoInterceptors = new HttpClient(this.httpBackend);
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  async ngOnInit(): Promise<void> {
    this.editedHashlistIndex = +this.route.snapshot.params['id'];

    try {
      await this.loadHashlist();

      await this.loadData();

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

      // For other errors (500 etc.) show a friendly message instead of redirecting
      // so the user knows the server failed. Keep the loading flag disabled.

      console.error('Error loading hashlist:', e);
      const msg = status ? `Error loading hashlist (server returned ${status}).` : 'Error loading hashlist.';
      this.alert.showErrorMessage(msg);
      this.isLoading = false;
      return;
    }
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  private async loadHashlist(): Promise<void> {
    const base = this.cs.getEndpoint() + SERV.HASHLISTS.URL;
    const url = `${base}/${this.editedHashlistIndex}`;

    // Mismos includes que antes
    const params: { [k: string]: string } = { include: 'tasks,hashlists,hashType' };

    try {
      const response = await firstValueFrom<ResponseWrapper>(this.http.get<ResponseWrapper>(url, { params }));
      const hashlist = new JsonAPISerializer().deserialize<JHashlist>({
        data: response.data,
        included: response.included
      });

      this.editedHashlist = hashlist;
      this.type = hashlist.format;
      this.hashtype = hashlist.hashType;

      this.updateForm.setValue({
        hashlistId: hashlist.id,
        accessGroupId: hashlist.accessGroupId,
        useBrain: hashlist.useBrain,
        format: this.format.transform(hashlist.format, 'formats'),
        hashCount: hashlist.hashCount,
        cracked: hashlist.cracked,
        remaining: hashlist.hashCount - hashlist.cracked,
        updateData: {
          name: hashlist.name,
          notes: hashlist.notes,
          isSecret: hashlist.isSecret,
          accessGroupId: hashlist.accessGroupId
        }
      });
      return;
    } catch (err: unknown) {
      if (err instanceof HttpErrorResponse && err.status && err.status >= 500) {
        // Retry without includes if server failed resolving relationships

        console.warn('loadHashlist(): request with includes failed, retrying without includes', err);
        const responseFallback = await firstValueFrom<ResponseWrapper>(this.http.get<ResponseWrapper>(url));
        const hashlist = new JsonAPISerializer().deserialize<JHashlist>({
          data: responseFallback.data,
          included: responseFallback.included
        });

        this.editedHashlist = hashlist;
        this.type = hashlist.format;
        this.hashtype = hashlist.hashType;

        this.updateForm.setValue({
          hashlistId: hashlist.id,
          accessGroupId: hashlist.accessGroupId,
          useBrain: hashlist.useBrain,
          format: this.format.transform(hashlist.format, 'formats'),
          hashCount: hashlist.hashCount,
          cracked: hashlist.cracked,
          remaining: hashlist.hashCount - hashlist.cracked,
          updateData: {
            name: hashlist.name,
            notes: hashlist.notes,
            isSecret: hashlist.isSecret,
            accessGroupId: hashlist.accessGroupId
          }
        });
        return;
      }
      throw err;
    }
  }

  /**
   * Loads data, specifically access groups, for the component.
   */
  private async loadData(): Promise<void> {
    if (!this.roleService.hasRole('groups')) {
      return;
    }

    const response = await firstValueFrom<ResponseWrapper>(this.gs.getAll(SERV.ACCESS_GROUPS));

    const accessGroups = new JsonAPISerializer().deserialize<JAccessGroup[]>({
      data: response.data,
      included: response.included
    });

    this.selectAccessgroup = transformSelectOptions(accessGroups, ACCESS_GROUP_FIELD_MAPPING);
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Handles the form submission.
   * If the form is valid, it updates the hashlist using the provided data.
   */
  onSubmit(): void {
    if (this.updateForm.valid) {
      const createSubscription$ = this.gs
        .update(SERV.HASHLISTS, this.editedHashlistIndex, this.updateForm.value['updateData'])
        .subscribe(() => {
          this.alert.showSuccessMessage('Hashlist saved');
          this.updateForm.reset(); // success, we reset form
          const path = this.type === 3 ? '/hashlists/superhashlist' : '/hashlists/hashlist';
          this.router.navigate([path]);
        });
      this.unsubscribeService.add(createSubscription$);
    } else {
      this.updateForm.markAllAsTouched();
      this.updateForm.updateValueAndValidity();
    }
  }

  // Actions; Import Cracked Hashes, Export left Hashes and Generate Wordlist

  importCrackedHashes(): void {
    this.router.navigate(['/hashlists/hashlist/' + this.editedHashlistIndex + '/import-cracked-hashes']);
  }

  exportLeftHashes(): void {
    const payload = { hashlistId: this.editedHashlistIndex };
    const helperExportedLeftSubscription$ = this.gs.chelper(SERV.HELPER, 'exportLeftHashes', payload).subscribe(() => {
      this.alert.showSuccessMessage('Exported Left Hashes');
    });

    this.unsubscribeService.add(helperExportedLeftSubscription$);
  }

  exortPreCrackedHashes(): void {
    const payload = { hashlistId: this.editedHashlistIndex };
    const helperExportedPreCrackedHashesSubscription$ = this.gs
      .chelper(SERV.HELPER, 'exportCrackedHashes', payload)
      .subscribe(() => {
        this.alert.showSuccessMessage('Cracked hashes from hashlist exported');
      });

    this.unsubscribeService.add(helperExportedPreCrackedHashesSubscription$);
  }

  exportWordlist(): void {
    const payload = { hashlistId: this.editedHashlistIndex };
    const helperExportedWordlistSubscription$ = this.gs
      .chelper(SERV.HELPER, 'exportWordlist', payload)
      .subscribe(() => {
        this.alert.showSuccessMessage('Exported Wordlist');
      });

    this.unsubscribeService.add(helperExportedWordlistSubscription$);
  }

  /**
   * Navigate to the hashes view for this hashlist.
   */
  goToHashes(): void {
    this.router.navigate(['/hashlists', 'hashes', 'hashlists', this.editedHashlistIndex]);
  }

  canDeactivate(): boolean {
    const hasUnsavedChanges = this.updateForm.dirty;

    if (hasUnsavedChanges) {
      this.unsavedChangesService.setUnsavedChanges(true);
    }
    return !hasUnsavedChanges;
  }
}
