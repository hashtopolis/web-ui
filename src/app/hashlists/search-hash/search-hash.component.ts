import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';

@Component({
  selector: 'app-search-hash',
  templateUrl: './search-hash.component.html'
})
@PageTitle(['Search Hash'])
export class SearchHashComponent implements OnInit, OnDestroy {
  /** Form group for Search Hashes. */
  form: FormGroup;

  pageTitle = "Hash Search";
  /** Result of the search. */
  private _searchResults: any[] = [];

  /** On form create show a spinner loading */
  isCreatingLoading = false;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private titleService: AutoTitleService,
    private cdr: ChangeDetectorRef,
    private gs: GlobalService
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

  get searchResults(): any[] {
    return this._searchResults;
  }

  set searchResults(value: any[]) {
    this._searchResults = value;
  }

  /**
   * Search Hash and return results
   */
  onSubmit() {
    if (this.form.valid) {
      this.isCreatingLoading = true;
      const currentSearchResult = this.form.value['hashes']
        .split(/(\s+)/)
        .filter(function (e) {
          return e.trim().length > 0;
        });

      this.searchResults = [currentSearchResult];
      this.cdr.detectChanges();
      this.isCreatingLoading = false;
      this.form.reset();
    }
  }
}
