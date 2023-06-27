import {ChangeDetectorRef, Component, HostBinding, OnInit} from '@angular/core';

@Component({
  selector: 'app-search-result-inner',
  templateUrl: './search-result-inner.component.html',
})
export class SearchResultInnerComponent implements OnInit {
  @HostBinding('class') class = 'menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @HostBinding('attr.data-kt-search-element') dataKtSearch = 'content';

  keyword: string = '';
  searching: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  search(keyword: string) {
    this.keyword = keyword;
    this.searching = true;

    setTimeout(() => {
      this.searching = false;
      this.cdr.detectChanges();
    }, 1000);
  }

  clearSearch() {
    this.keyword = '';
  }
}

interface ResultModel {
  icon?: string;
  image?: string;
  title: string;
  description: string;
}
