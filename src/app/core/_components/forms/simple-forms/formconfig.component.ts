import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { JConfig } from '@models/configs.model';
import { HorizontalNav } from '@models/horizontalnav.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV, ServiceConfig } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { InfoMetadataForm, MetadataFormField, MetadataService } from '@services/metadata.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UIConfigService } from '@services/shared/storage.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

type ConfigValues = Record<string, string | boolean>;
type ConfigIds = Record<string, number>;

@Component({
  selector: 'app-form',
  templateUrl: 'formconfig.component.html',
  standalone: false
})
/**
 * Component for managing forms, supporting both create and edit modes.
 */
export class FormConfigComponent implements OnInit, OnDestroy {
  // Metadata Text, titles, subtitles, forms, and API path
  globalMetadata: InfoMetadataForm;
  serviceConfig: ServiceConfig;

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
   */
  formMetadata: MetadataFormField[] = [];

  /**
   * Initial values for form fields (optional).
   * If provided, these values are used to initialize form controls in the dynamic form.

   */
  formValues: object;

  /**
   * An array of objects containing IDs and corresponding item names.
   * This information is used to map form field names to their associated IDs.
   */
  formIds: ConfigIds = {};

  // Subscription for managing asynchronous data retrieval
  private mySubscription: Subscription;

  /**
   * Constructor for the FormComponent.
   * @param unsubscribeService - The UnsubscribeService for managing subscriptions.
   * @param metadataService - The MetadataService for accessing form metadata.
   * @param titleService - The AutoTitleService for setting titles.
   * @param uicService
   * @param route - The ActivatedRoute for retrieving route data.
   * @param alert - The AlertService for displaying alerts.
   * @param gs - The GlobalService for handling global operations.
   * @param serializer - JsonAPISerializer to serialize/deserialize json:api objects
   */
  constructor(
    private unsubscribeService: UnsubscribeService,
    private metadataService: MetadataService,
    private titleService: AutoTitleService,
    private uicService: UIConfigService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private serializer: JsonAPISerializer
  ) {
    // Subscribe to route data to initialize component data
    this.route.data.subscribe((data: { kind: string; serviceConfig: ServiceConfig; type: string }) => {
      const formKind = data.kind;
      this.serviceConfig = data.serviceConfig; // Get the API path from route data
      // Load metadata and form information
      this.globalMetadata = this.metadataService.getInfoMetadata(formKind + 'Info')[0];
      this.formMetadata = this.metadataService.getFormMetadata(formKind);
      this.title = this.globalMetadata['title'];
      this.titleService.set([this.title]);
    });
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
      .getAll(this.serviceConfig, { page: { size: 500 } })
      .subscribe((response: ResponseWrapper) => {
        const responseBody = { data: response.data, included: response.included };
        const config = this.serializer.deserialize<JConfig[]>(responseBody);

        this.formValues = config.reduce<ConfigValues>((configValues, item) => {
          let value: string | boolean = item.value;

          if (item.value === '1') {
            value = true;
          } else if (item.value === '0') {
            value = false;
          }

          configValues[item.item] = value;
          return configValues;
        }, {});
        // Maps the item with the id, so can be used for update
        this.formIds = config.reduce<ConfigIds>((result, item) => {
          result[item.item] = item.id;
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
  onFormSubmit(form: FormGroup) {
    const currentFormValues = form;
    const initialFormValues = this.formValues;
    const changedFields: Record<string, unknown> = {};

    for (const key in currentFormValues) {
      if (Object.prototype.hasOwnProperty.call(currentFormValues, key)) {
        const currentValue = currentFormValues[key];
        const initialValue = initialFormValues[key];

        if (currentValue !== initialValue) {
          // Convert boolean values to 1 (true) or 0 (false)
          changedFields[key] = typeof currentValue === 'boolean' ? (currentValue ? 1 : 0) : currentValue;
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

        this.mySubscription = this.gs.update(SERV.CONFIGS, id, arr).subscribe(() => {
          this.uicService.onUpdatingCheck(key);
          this.alert.showSuccessMessage(`Saved ${key}`);

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
