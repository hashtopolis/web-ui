import { catchError, finalize, of } from 'rxjs';

import { JHash, SearchHashModel } from '@models/hash.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

export class SearchHashDataSource extends BaseDataSource<SearchHashModel> {
  private search: string[];
  private dateFormat: string;

  /**
   * Set search input array from form field
   * @param hashArray - array of hashes to search for
   */
  setSearch(hashArray: string[]): void {
    if (hashArray && hashArray.length > 0) {
      this.search = [...hashArray];
    }
  }

  /**
   * Set user's preferred date and time format from UI settings
   * @param dateFormat - preferred date and time format as string
   */
  setDateFormat(dateFormat: string): void {
    this.dateFormat = dateFormat;
  }

  /**
   * Perform API request and create response data from API response
   */
  loadAll(): void {
    this.loading = true;

    const params = new RequestParamBuilder().addInclude('hashlist').addFilter({
      field: 'hash',
      operator: FilterType.IN,
      value: this.search
    });

    this.subscriptions.push(
      this.service
        .getAll(SERV.HASHES, params.create())
        .pipe(
          catchError((error) => {
            console.error('Error loading hashes', error);
            return of([]);
          }),
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((response: ResponseWrapper) => {
          const responseData = { data: response.data, included: response.included };
          const hashes = this.convertHashes(this.serializer.deserialize<JHash[]>(responseData));
          this.checkMissingHashes(hashes);
          this.setData(hashes);
        })
    );
  }

  /**
   * Reload data
   */
  reload(): void {
    this.clearSelection();
    this.loadAll();
  }

  /**
   * Convert the JHash array from the backen response to a collection of simple SearchHashModels for rendering
   * @param hashes - input array of JHash objects retrieved from backend
   * @return collection of SearchHashModel objects, contains only hashes the API could retrieve from the database
   * @private
   */
  private convertHashes(hashes: JHash[]): SearchHashModel[] {
    const searchHashes: SearchHashModel[] = [];
    for (const hash of hashes) {
      if (!this.conditionallyAddHashlist(searchHashes, hash)) {
        searchHashes.push({
          id: hash.id,
          hash: hash.hash,
          plaintext: hash.plaintext,
          hashlists: [hash.hashlist],
          hashInfo: hash.isCracked
            ? `Cracked on ${formatUnixTimestamp(hash.timeCracked, this.dateFormat)}`
            : 'Not cracked yet',
          type: 'SearchHash'
        });
      }
    }
    return searchHashes;
  }

  /**
   * Check, if a hash is already in the result collection, if yes, only add the hashlist to the result
   * @param searchHashes - current result collection of SearchHahsModel objects
   * @param hash - hash object from API response to check
   * @return true: hash already in collection, false: hash not in collection
   * @private
   */
  private conditionallyAddHashlist(searchHashes: SearchHashModel[], hash: JHash): boolean {
    for (const element of searchHashes) {
      if (element.hash === hash.hash) {
        element.hashlists.push(hash.hashlist);
        return true;
      }
    }
    return false;
  }

  /**
   * Add all hashes, which are in the user input but could not be found in the DB to the reult collection with a 'not found' info field
   * @param hashes - result collection to adjust with internal this.search collection, which holds the user input
   * @private
   */
  private checkMissingHashes(hashes: SearchHashModel[]) {
    const rawHashes: Array<string> = hashes.map((element) => element.hash);
    this.search.forEach((hash, index) => {
      if (!rawHashes.includes(hash)) {
        const emptyHash: SearchHashModel = {
          id: -1,
          hash: hash,
          plaintext: '',
          hashlists: [],
          hashInfo: 'Not found in any hashlist',
          type: 'SearchHash'
        };
        if (index < hashes.length) {
          hashes.splice(index, 0, emptyHash);
        } else {
          hashes.push(emptyHash);
        }
      }
    });
  }
}
