import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { MetadataService } from 'src/app/core/_services/metadata.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { Subscription } from 'rxjs';
import { CookieService } from 'src/app/core/_services/shared/cookies.service';

@Component({
  selector: 'app-form',
  template: `
    <app-dynamic-form [subtitle]='title' [formMetadata]="formMetadata" [formValues]="formValues" [form]="form" [buttonText]="'Update'" [showDeleteButton]="false" (formSubmit)="onFormSubmit($event)"></app-dynamic-form>
  `,
})
/**
 * Component for managing forms, supporting both create and edit modes.
 */
export class FormUIsettingsComponent implements OnDestroy {

  // Metadata Text, titles, subtitles, forms, and API path
  globalMetadata: any[] = [];
  apiPath: string;

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
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    // Subscribe to route data to initialize component data
    this.route.data.subscribe((data: { kind: string, path: string, type: string }) => {
      const formKind = data.kind;
      this.apiPath = data.path; // Get the API path from route data
      // Load metadata and form information
      this.globalMetadata = this.metadataService.getInfoMetadata(formKind+'Info')[0];
      this.formMetadata = this.metadataService.getFormMetadata(formKind);
      // this.formValues =
      this.title = this.globalMetadata['title'];
      titleService.set([this.title]);
    });
    // Add this.mySubscription to UnsubscribeService
    this.unsubscribeService.add(this.mySubscription);
  }

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
    // Use utils
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
   * @param formValues - The values submitted from the form.
  */
  onFormSubmit(formValues: any) {
    // Iterate through form values
    for (const key in formValues) {
      if (Object.prototype.hasOwnProperty.call(formValues, key)) {
        const value = formValues[key];
        // Check if the key is 'autorefresh'
        if (key === 'autorefresh') {
          this.cookieService.setCookie('autorefresh', JSON.stringify({ active: true, value }), 365);
        } else {
          // Set other form values as individual cookies
          this.cookieService.setCookie(key, value, 365);
        }
      }
    }
    // Show an alert or notification
    this.alert.okAlert('Saved!', '');
  }

}

