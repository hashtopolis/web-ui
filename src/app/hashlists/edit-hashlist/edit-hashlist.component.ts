import { DataTableDirective } from 'angular-datatables';
import { Subject, firstValueFrom } from 'rxjs';

import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { JAccessGroup } from '@models/access-group.model';
import { JHashlist } from '@models/hashlist.model';
import { JHashtype } from '@models/hashtype.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { ConfigService } from '@services/shared/config.service';
import { UnsavedChangesService } from '@services/shared/unsaved-changes.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { ACCESS_GROUP_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { CanComponentDeactivate } from '@src/app/core/_guards/pendingchanges.guard';
import { StaticArrayPipe } from '@src/app/core/_pipes/static-array.pipe';
import { getEditHashlistForm } from '@src/app/hashlists/edit-hashlist/edit-hashlist.form';
import { transformSelectOptions } from '@src/app/shared/utils/forms';

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
  editedHashlist: JHashlist | undefined;
  hashtype: JHashtype | undefined;
  type: number | undefined; // Hashlist or SuperHashlist (format)

  // Lists of Selected inputs
  selectAccessgroup: any[] = [];

  // To Remove for use tables
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  private httpNoInterceptors: HttpClient;

  /**
   * Constructor for the component.
   */
  constructor(
    private unsavedChangesService: UnsavedChangesService,
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private format: StaticArrayPipe,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router,
    private cs: ConfigService,
    httpBackend: HttpBackend
  ) {
    this.updateForm = getEditHashlistForm();
    this.titleService.set(['Edit Hashlist']);
    this.httpNoInterceptors = new HttpClient(httpBackend);
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  async ngOnInit(): Promise<void> {
    this.editedHashlistIndex = +this.route.snapshot.params['id'];

    try {
      // 1) Cargar hashlist; si no existe o 403 lanzará HttpErrorResponse
      await this.loadHashlist();

      // 2) Cargar access groups (select de Access group)
      await this.loadData();

      // 3) Solo si todo ha ido bien pintamos la pantalla
      this.isLoading = false;
    } catch (e: unknown) {
      const status = e instanceof HttpErrorResponse ? e.status : undefined;

      if (status === 403) {
        this.router.navigateByUrl('/forbidden');
        return;
      }

      // 404, 500 “No hashlist found …”, etc → tratamos como not found
      this.router.navigateByUrl('/not-found');
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
    const base = this.gs['cs'].getEndpoint() + SERV.HASHLISTS.URL;
    const url = `${base}/${this.editedHashlistIndex}`;

    // Mismos includes que antes
    const params: { [k: string]: string } = { include: 'tasks,hashlists,hashType' };

    const response = await firstValueFrom<ResponseWrapper>(
      this.httpNoInterceptors.get<ResponseWrapper>(url, { params })
    );

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
  }

  /**
   * Loads data, specifically access groups, for the component.
   */
  private async loadData(): Promise<void> {
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

  exportWordlist() {
    const payload = { hashlistId: this.editedHashlistIndex };
    const helperExportedWordlistSubscription$ = this.gs
      .chelper(SERV.HELPER, 'exportWordlist', payload)
      .subscribe(() => {
        this.alert.showSuccessMessage('Exported Wordlist');
      });

    this.unsubscribeService.add(helperExportedWordlistSubscription$);
  }

  canDeactivate(): boolean {
    const hasUnsavedChanges = this.updateForm.dirty;

    if (hasUnsavedChanges) {
      this.unsavedChangesService.setUnsavedChanges(true);
    }
    return !hasUnsavedChanges;
  }
}
