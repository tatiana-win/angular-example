import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {

  @Input()
  currentPage = 1;

  @Input()
  pagesCount = 1;

  @Input()
  displayCount = 10;

  @Output()
  pageChanged: EventEmitter<number> = new EventEmitter<number>();

  pages: number[] = [];

  constructor() {
  }

  setPage(page: number): void {
    if (this.currentPage !== page) {
      this.pageChanged.emit(page);
    }
  }

  private calculatePages() {
    let startPage;
    let endPage;

    if (this.pagesCount <= this.displayCount) {
      startPage = 1;
      endPage = this.pagesCount;
    } else {
      const middle = Math.floor(this.pagesCount / 2);
      const sideMaxCount = Math.floor(this.displayCount / 2);

      if (this.currentPage <= middle) {
        if (this.currentPage <= sideMaxCount) {
          startPage = 1;
        } else {
          startPage = this.currentPage - sideMaxCount;
        }

        endPage = startPage + this.displayCount - 1;
      } else {
        if (this.pagesCount - this.currentPage <= sideMaxCount) {
          endPage = this.pagesCount;
        } else {
          endPage = this.currentPage + sideMaxCount;
        }

        startPage = endPage - this.displayCount + 1;
      }
    }

    this.pages = this.range(startPage, endPage + 1);
  }

  /**
   * Create array of pages numbers
   * @param start
   * @param end
   * @return {number[]}
   */
  private range(start: number, end: number) {
    const pages = [];

    for (let i = start; i < end; i++) {
      pages.push(i);
    }

    return pages;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePages();
  }

}
