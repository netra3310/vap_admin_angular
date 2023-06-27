// import { Component, HostBinding, OnInit, EventEmitter, Output, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';

// @Component({
//   selector: 'app-custom-select-option',
//   templateUrl: './custom-select-option.component.html',
//   styleUrls: ['./custom-select-option.component.scss']
// })
// export class CustomSelectOptionComponent implements OnInit {
//   @HostBinding('class') class =
//   'menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold position-absolute';
//   @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  
//   @Output() emitSelOption = new EventEmitter();
  
//   @Input() items : any = [];
//   @Input() virtualScroll : boolean;
//   @Input() enableSearch : boolean = false;
//   @Input() bindLabel : string;
//   @Input() bindKey : string;

//   selectValue:any = "Select...";
//   selectId : number = -1;
//   viewItems : any = [];
//   constructor(
//     private cdr : ChangeDetectorRef
//   ) {
//   }

//   ngOnInit(): void {
//     this.viewItems = this.items;
//   }

//   ngOnChanges(changes : SimpleChanges) {
//     if(changes.items) {
//       this.viewItems = this.items;
//       this.cdr.detectChanges();
//     }
//   }

//   onClickDrop(option : any) {
//     this.selectId = option[this.bindKey];
//     this.emitSelOption.emit(this.selectId);
//   }

//   onSearch(event : any) {
//     let key = event.target.value;
//     this.viewItems = this.items.filter((item : any) => item[this.bindLabel].toUpperCase().includes(key.toUpperCase()));
//     this.cdr.detectChanges();
//   }

//   trackByItem(index: number, item: any): any {
//     return item.id;
//   }
// }
import { Component, HostBinding, OnInit, EventEmitter, Output, Input, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
@Component({
  selector: 'app-custom-select-option',
  templateUrl: './custom-select-option.component.html',
  styleUrls: ['./custom-select-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSelectOptionComponent implements OnInit {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold position-absolute';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  @ViewChild("virtual_scroll") viewport: CdkVirtualScrollViewport;
  
  @Output() emitSelOption = new EventEmitter();

  @Input() items: any = [];
  @Input() virtualScroll: boolean;
  @Input() enableSearch = false;
  @Input() bindLabel: string;
  @Input() bindKey: string;

  selectValue: any = 'Select...';
  selectId: number = -1;
  viewItems: any = [];
  viewOptions: string[] = []; // Current visible options in the viewport
  optionLabel = 'label'; // Property name for the option's label

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.viewItems = this.items;
    console.log("this viewport is ", this.viewport);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      this.viewItems = this.items;
      this.cdr.detectChanges();
    }
  }

  onClickDrop(option: any) {
    this.selectId = option[this.bindKey];
    this.emitSelOption.emit(this.selectId);
  }

  onSearch(event: any) {
    const key = event.target.value.toUpperCase();
    this.viewItems = this.items.filter((item: any) =>
      item[this.bindLabel].toUpperCase().includes(key)
    );
    this.cdr.detectChanges();
  }

  onScroll(): void {
    const start = this.viewport.getRenderedRange().start;
    const end = this.viewport.getRenderedRange().end;
    this.viewOptions = this.viewItems.slice(start, end);
  }
}
