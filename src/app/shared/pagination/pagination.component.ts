import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, range, map } from 'rxjs';

@Component({
  selector: 'cm-pagination',
  templateUrl: './pagination.component.html'
})

export class PaginationComponent implements OnInit {

  private pagerTotalItems: number = 0;
  private pagerPageSize: number = 0;
  private pagerRange: number = 0;

  totalPages: number = 0;
  totalRecords: number = 0;
  pages: number[] = [];
  currentPage = 1;
  isVisible = false;
  previousEnabled = false;
  nextEnabled = true;
  showLabel: string;

  @Input() get pageSize(): number {
    return this.pagerPageSize;
  }

  set pageSize(size: number) {
    this.pagerPageSize = size;
    this.update();
  }

  @Input() get totalItems(): number {
    return this.pagerTotalItems;
  }

  @Input() range:number = 10;
  @Input() offset: number;

  set totalItems(itemCount: number) {
    this.pagerTotalItems = itemCount;
    this.sInfoDisplay(1);
    this.update();
  }

  @Output() pageChanged: EventEmitter<number> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {

  }

  update() {
    if (this.pagerTotalItems && this.pagerPageSize) {
      this.totalPages = Math.ceil(Math.max(this.pagerTotalItems,1) / Math.max(this.pageSize,1));
      this.isVisible = true;
      if (this.totalItems >= this.pageSize) {
         this.getTotalPages();
      };
      return;
    }
    this.isVisible = false;
  }

  getTotalPages(startend?:number) {
    if(startend === 3){
      this.currentPage = 0;
    } else if (startend === 4) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    } else if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    let startPage: number, endPage: number;
    if (this.totalPages <= 10) {
      startPage = 1;
      endPage = this.totalPages;
    } else {
      if (this.currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (this.currentPage + 4 >= this.totalPages) {
        startPage = this.totalPages - 9;
        endPage = this.totalPages;
      }else {
        startPage = this.currentPage - 5;
        endPage = this.currentPage + 4;
      }
    }
    this.pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
      (i) => startPage + i
    );
   }

  previousNext(direction: number, event?: MouseEvent) {
    let page: number = this.currentPage;
    if (direction === -1) {
        if (page > 1) {
          page--;
        }
    } else if(direction === 3){ // We use 3 to go to the first page
      page = 1;
    } else if(direction === 4){ // We use 4 to go to the last page
      page = this.totalPages;
    }
    else {
        if (page < this.totalPages ) {
          page++;
      }
    }
    this.changePage(page, event);
    this.getTotalPages(direction);
  }

  changePage(page: number, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
    }
    if (this.currentPage === page) { return; }
    this.currentPage = page;
    this.previousEnabled = this.currentPage > 1;
    this.nextEnabled = this.currentPage < this.totalPages;
    this.sInfoDisplay(page);
    this.pageChanged.emit(page);
  }

  sInfoDisplay(page: number){

    var
      tlen = this.totalItems,
      start = ((page - 1) * this.pageSize)+1,
      ending = start + this.pageSize-1,
      end = tlen-1;

    if (start >= end)
		{
			start = end - tlen;
		}

		if (tlen === -1 || start < 0)
		{
			start = 0;
		}

    if(tlen === -1 || ending > tlen){
      ending = Math.min(tlen, ending);
    }

    this.showLabel = 'Showing '+start+' to '+ending+' of '+tlen+' entries';

  }

  cancelEvent(event) {
    event.preventDefault();
  }

}
