import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { MetadataService } from 'src/app/core/_services/metadata.service';
import { HorizontalNav } from 'src/app/core/_models/horizontalnav.model';
import { GlobalService } from 'src/app/core/_services/main.service';
import { SERV } from '../../../_services/main.config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: 'formconfig.component.html'
})
/**
 * Component for managing forms, supporting both create and edit modes.
 */
export class FormConfigComponent implements OnInit, OnDestroy {
  // Metadata Text, titles, subtitles, forms, and API path
  globalMetadata: any[] = [];
  apiPath: string;

  /**
   * Flag that indicates whether the data for the form has been loaded and the form is ready for rendering.
   * When true, the form is fully loaded and can be displayed; otherwise, it's still being prepared.
   * @type {boolean}
   */
  isloaded = false;

  /**
   * Title to be displayed in the form.
   * @type {string}
   */
  title: string;

  /**
   * The Angular FormGroup representing the dynamic form.
   * This FormGroup contains form controls for all fields in the formMetadata.
   */
  form: FormGroup;

  /**
   * An array of form field metadata that describes the form structure.
   * Each item in the array represents a form field, including its type, label, and other properties.
   * @type {any[]}
   */
  formMetadata: any[] = [];

  /**
   * Initial values for form fields (optional).
   * If provided, these values are used to initialize form controls in the dynamic form.
   * @type {any[]}
   */
  formValues: any[] = [];

  /**
   * An array of objects containing IDs and corresponding item names.
   * This information is used to map form field names to their associated IDs.
   * @type {any[]}
   */
  formIds: any[] = [];

  // Subscription for managing asynchronous data retrieval
  private mySubscription: Subscription;

  /**
   * Constructor for the FormComponent.
   * @param unsubscribeService - The UnsubscribeService for managing subscriptions.
   * @param metadataService - The MetadataService for accessing form metadata.
   * @param titleService - The AutoTitleService for setting titles.
   * @param route - The ActivatedRoute for retrieving route data.
   * @param alert - The AlertService for displaying alerts.
   * @param gs - The GlobalService for handling global operations.
   * @param router - The Angular Router for navigation.
   */
  constructor(
    private unsubscribeService: UnsubscribeService,
    private metadataService: MetadataService,
    private titleService: AutoTitleService,
    private uicService: UIConfigService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    // Subscribe to route data to initialize component data
    this.route.data.subscribe(
      (data: { kind: string; path: string; type: string }) => {
        const formKind = data.kind;
        this.apiPath = data.path; // Get the API path from route data
        // Load metadata and form information
        this.globalMetadata = this.metadataService.getInfoMetadata(
          formKind + 'Info'
        )[0];
        this.formMetadata = this.metadataService.getFormMetadata(formKind);
        this.title = this.globalMetadata['title'];
        titleService.set([this.title]);
      }
    );
    // Add this.mySubscription to UnsubscribeService
    this.unsubscribeService.add(this.mySubscription);
  }

  /**
   * Horizontal menu and redirection links.
   */
  menuItems: HorizontalNav[] = [
    { label: 'Agent', routeName: 'config/agent' },
    { label: 'Task/Chunk', routeName: 'config/task-chunk' },
    { label: 'Hashes/Cracks/Hashlist', routeName: 'config/hch' },
    { label: 'Notifications', routeName: 'config/notifications' },
    { label: 'General', routeName: 'config/general-settings' }
  ];

  /**
   * Angular lifecycle hook: ngOnInit
   */
  ngOnInit(): void {
    this.loadEdit();
  }

  /**
   * Loads data for editing a form.
   * This function fetches data from the API for editing and prepares it for rendering in a form.
   */
  loadEdit() {
    // Fetch data from the API for editing
    this.mySubscription = this.gs
      .getAll(this.apiPath, { maxResults: 500 })
      .subscribe((result) => {
        // Transform the retrieved array of objects into the desired structure for form rendering
        this.formValues = result.values.reduce((result, item) => {
          if (item.value === 'true') {
            item.value = true;
          } else if (item.value === 'false') {
            item.value = false;
          }
          result[item.item] = item.value;
          return result;
        }, {});
        // Maps the item with the id, so can be used for update
        this.formIds = result.values.reduce((result, item) => {
          result[item.item] = item._id;
          return result;
        }, {});

        this.isloaded = true; // Data is loaded and ready for form rendering
      });
  }

  /**
   * Angular lifecycle hook: ngOnDestroy
   * Unsubscribe from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Handles the submission of the form.
   * @param form - The form object containing the updated values.
   */
  onFormSubmit(form: any) {
    const currentFormValues = form;
    const initialFormValues = this.formValues;
    const changedFields = {};

    for (const key in currentFormValues) {
      if (Object.prototype.hasOwnProperty.call(currentFormValues, key)) {
        if (currentFormValues[key] !== initialFormValues[key]) {
          // Convert boolean values to 1 (true) or 0 (false)
          // const value = currentFormValues[key] === true ? 0 : (currentFormValues[key] === false ? 1 : currentFormValues[key]);
          changedFields[key] = currentFormValues[key];
        }
      }
    }

    const fieldKeys = Object.keys(changedFields);
    let index = 0;

    const showAlertsSequentially = () => {
      if (index < fieldKeys.length) {
        const key = fieldKeys[index];
        const id = this.formIds[key];
        const valueUpdate = changedFields[key];
        const arr = { item: key, value: String(valueUpdate) };

        this.mySubscription = this.gs
          .update(SERV.CONFIGS, id, arr)
          .subscribe((result) => {
            this.uicService.onUpdatingCheck(key);
            this.alert.okAlert('Saved', key);

            // Delay showing the next alert by 2000 milliseconds (2 seconds)
            setTimeout(() => {
              index++;
              showAlertsSequentially();
            }, 2000);
          });
      }
    };

    showAlertsSequentially();
  }
}
