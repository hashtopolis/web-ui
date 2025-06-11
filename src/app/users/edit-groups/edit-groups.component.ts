import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { JAccessGroup } from '@src/app/core/_models/access-group.model';
import { ResponseWrapper } from '@src/app/core/_models/response.model';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { SERV } from '@src/app/core/_services/main.config';
import { GlobalService } from '@src/app/core/_services/main.service';
import { AlertService } from '@src/app/core/_services/shared/alert.service';
import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';
import { UIConfigService } from '@src/app/core/_services/shared/storage.service';
import { UnsubscribeService } from '@src/app/core/_services/unsubscribe.service';

@Component({
  selector: 'app-edit-groups',
  templateUrl: './edit-groups.component.html',
  standalone: false
})
export class EditGroupsComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for edit Access group. */
  updateForm: FormGroup;

  /** On form update show a spinner loading */
  isUpdatingLoading = false;

  // Edit Configuration
  editedAccessGroupIndex: number;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private uiService: UIConfigService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    this.onInitialize();
    this.buildForm();
    titleService.set(['Edit Access Group']);
  }

  /**
   * Initializes the component by extracting and setting the user ID,
   */
  onInitialize() {
    this.route.params.subscribe((params: Params) => {
      this.editedAccessGroupIndex = +params['id'];
    });
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
   * Builds the form for editing an access group.
   */
  buildForm(): void {
    this.updateForm = new FormGroup({
      groupName: new FormControl()
    });
  }

  /**
   * Loads data, access group data and select options for the component.
   */
  loadData(): void {
    this.initForm();
  }

  /**
   * Initializes the form with user data retrieved from the server.
   */
  initForm() {
    const loadSubscription$ = this.gs
      .get(SERV.ACCESS_GROUPS, this.editedAccessGroupIndex)
      .subscribe((response: ResponseWrapper) => {
        const accessGroup = new JsonAPISerializer().deserialize<JAccessGroup>({
          data: response.data,
          included: response.included
        });
        this.updateForm = new FormGroup({
          groupName: new FormControl(accessGroup.groupName)
        });
      });
    this.unsubscribeService.add(loadSubscription$);
  }

  /**
   * Handles the form submission for updating access group data.
   * If the form is valid, it triggers the update process and navigates to the user list.
   */
  onSubmit() {
    if (this.updateForm.valid) {
      this.isUpdatingLoading = true;
      const onSubmitSubscription$ = this.gs
        .update(SERV.ACCESS_GROUPS, this.editedAccessGroupIndex, this.updateForm.value)
        .subscribe(() => {
          this.alert.showSuccessMessage('Access Group saved');
          this.isUpdatingLoading = false;
          this.router.navigate(['/users/access-groups']);
        });
      this.unsubscribeService.add(onSubmitSubscription$);
    }
  }

  /**
   * Handles the deletion of a access group.
   * Displays a confirmation dialog and, if confirmed, triggers the deletion process.
   * If the deletion is successful, it navigates to the user list.
   */
  onDelete() {
    this.alert.deleteConfirmation('', 'Access Groups').then((confirmed) => {
      if (confirmed) {
        // Deletion
        const onDeleteSubscription$ = this.gs.delete(SERV.ACCESS_GROUPS, this.editedAccessGroupIndex).subscribe(() => {
          // Successful deletion
          this.alert.showSuccessMessage('Deleted Access Group');
          this.router.navigate(['/users/access-groups']);
        });
        this.unsubscribeService.add(onDeleteSubscription$);
      }
    });
  }
}
