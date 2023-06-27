import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';

@Component({ 
  selector: 'pagination', 
  templateUrl: 'pagination.component.html' ,
  styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent implements OnChanges {
    @Input() items?: Array<any>;
    @Output() changePage = new EventEmitter<any>(true);
    @Input() initialPage = 0;
    @Input() pageSize = 10;
    @Input() maxPages = 5;
    @Input() size: number;
    @Input() rowsPerPageOptions : any;
    @Input() isLazy: boolean;

    @Input() pager: Pager;
    @Output() pagerChange = new EventEmitter();

    isChangePageSize : boolean = false;
    constructor(private cdr: ChangeDetectorRef) {
              
    }

    ngOnInit() {
        this.pager = {
            totalItems: 0,
            currentPage: 0,
            rows: 0,
            totalPages: 0,
            startPage: 0,
            endPage: 0,
            startIndex: 0,
            endIndex: 0,
            pages: [],
        };
        if(Number(this.initialPage) > 0) {
            this.pager.currentPage = Number(this.initialPage) + 1;
        }
        this.pageSize = Number(this.rowsPerPageOptions[0]);
        this.pagerChange.emit(this.pager);
        
    }
    
    ngDoCheck() {
        this.cdr.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges) {
        // set page when items array first set or changed
        if(changes.size || changes.items) {
            if(this.size < 1) {
                return;
            }
            this.size = Number(this.size);
            this.setPage(this.pager?.currentPage ?? 1);
        }
        if(changes.pager) {
            this.cdr.detectChanges();
        }
    }

    onPageSize(event : any) {
        this.pageSize = Number(event.target.value);
        if(this.isLazy) {
            this.isChangePageSize = true;
        }
        if(this.pager)
            this.setPage(this.pager?.currentPage);
        else
            this.setPage(1);
    }

    setPage(page: number = 1) {  
        if(page < 1) {
            page = 1;
        }    
        if(this.isLazy){
            // get new pager object for specified page
            let tempPageNumber = this.pager?.currentPage;
            this.pager = this.paginate(this.size, page, this.pageSize, this.maxPages);
            if(!this.isChangePageSize) {
                if(page === tempPageNumber) {
                    return;
                }
            }
            // this.initialPage = page;
            this.isChangePageSize = false;
            this.changePage.emit(this.pager);
        } else {
            if (!this.items?.length) {
                return;
            }
            this.pager = this.paginate(this.size, page, this.pageSize, this.maxPages);
            // get new pager object for specified page

            // get new page of items from items array
            const pageOfItems = this.items.slice(this.pager.startIndex, this.pager.endIndex + 1);

            // call change page function in parent component
            const event = {
                data: pageOfItems,
                pager: this.pager
            }
            this.changePage.emit(event);
        }
    }

    paginate(totalItems: number, currentPage: number = 1, pageSize: number = 10, maxPages: number = 10): Pager {
        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        // ensure current page isn't out of range
        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        let startPage: number, endPage: number;
        if (totalPages <= maxPages) {
            // total pages less than max so show all pages
            startPage = 1;
            endPage = totalPages;
        } else {
            // total pages more than max so calculate start and end pages
            let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
            let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
            if (currentPage <= maxPagesBeforeCurrentPage) {
                // current page near the start
                startPage = 1;
                endPage = maxPages;
            } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
                // current page near the end
                startPage = totalPages - maxPages + 1;
                endPage = totalPages;
            } else {
                // current page somewhere in the middle
                startPage = currentPage - maxPagesBeforeCurrentPage;
                endPage = currentPage + maxPagesAfterCurrentPage;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

        // return object with all pager properties required by the view
        let rows = pageSize;
        return {
            totalItems,
            currentPage,
            rows,
            totalPages,
            startPage,
            endPage,
            startIndex,
            endIndex,
            pages
        };
    }    
}

export interface Pager {
    totalItems: number;
    currentPage: number;
    rows: number;
    totalPages: number;
    startPage: number;
    endPage: number;
    startIndex: number;
    endIndex: number;
    pages: number[];
}