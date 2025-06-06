import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AlertService } from '@services/shared/alert.service';

import { MAX_SEARCH_LENGTH, MAX_SEARCH_SIZE } from '@components/tables/search-hash-table/search-hash-table.constants';

@Component({
  selector: 'app-search-hash',
  templateUrl: './search-hash.component.html',
  standalone: false
})
@PageTitle(['Search Hash'])
export class SearchHashComponent implements OnInit, OnDestroy {
  /** Form group for Search Hashes. */
  form: FormGroup;

  pageTitle = 'Search Hash';
  /** Result of the search. */
  private _searchResults: string[] = [];

  /** On form create show a spinner loading */
  isCreatingLoading = false;

  constructor(
    private unsubscribeService: UnsubscribeService,
    readonly titleService: AutoTitleService,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService
  ) {
    titleService.set(['Search Hash']);
  }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * Build Form
   */
  buildForm() {
    this.form = new FormGroup({
      hashes: new FormControl('', [Validators.required])
    });
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  get searchResults(): string[] {
    return this._searchResults;
  }

  set searchResults(value: string[]) {
    this._searchResults = value;
  }

  /**
   * Search Hash and return results
   */
  onSubmit() {
    if (this.form.valid) {
      const currentSearchResult = this.form.value['hashes'].split(/(\s+)/).filter(function (element: string) {
        return element.trim().length > 0;
      });
      const totalLength: number = currentSearchResult.reduce((length: number, str: string) => length + str.length, 0);
      if (currentSearchResult.length > MAX_SEARCH_LENGTH) {
        this.alertService.showErrorMessage(
          `You have exceeded the maximum hash search size of ${MAX_SEARCH_LENGTH} hashes. You have entered ${currentSearchResult.length} hashes. Please reduce your hash list.`
        );
      } else if (totalLength > MAX_SEARCH_SIZE) {
        this.alertService.showErrorMessage(
          `You have exceeded the maximum request limit size of ${MAX_SEARCH_SIZE} characters. Your current input size is ${totalLength} characters. Please reduce your search input.`
        );
      } else {
        this.isCreatingLoading = true;
        this.searchResults = [...currentSearchResult];
        this.cdr.detectChanges();
        this.isCreatingLoading = false;
        this.form.reset();
      }
    }
  }
}
