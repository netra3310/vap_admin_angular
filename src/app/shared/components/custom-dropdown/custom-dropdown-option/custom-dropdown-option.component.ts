import { Component, HostBinding, OnInit, EventEmitter, Output, Input, ChangeDetectorRef, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-custom-dropdown-option',
  templateUrl: './custom-dropdown-option.component.html',
  styleUrls: ['./custom-dropdown-option.component.scss']
})
export class CustomDropdownOptionComponent implements OnInit {
  @HostBinding('class') class =
  'menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold position-absolute';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  
  @Output() emitSelOption = new EventEmitter();
  
  @Input() options : any;
  @Input() virtualScroll : boolean;
  @Input() enableSearch : boolean = true;
  @Input() optionLabel : string;
  @Input() optionKey : string;

  viewOptions : any = [];

  selectValue:any = "Select...";
  keyValue : number = -1;
  constructor(
    private cdr : ChangeDetectorRef
  ) {}

  onClickDrop(option : any) {
    this.keyValue = option[this.optionKey];
    this.emitSelOption.emit(option);
  }

  ngOnInit(): void {
    this.viewOptions = this.options;
  }

  ngOnChanges(changes : SimpleChanges) {
    if(changes.options) {
      this.viewOptions = this.options;
      this.cdr.detectChanges();
    }
  }

  onSearch(event : any) {
    let key = event.target.value;
    this.viewOptions = this.options.filter((option : any) => option[this.optionLabel].toUpperCase().includes(key.toUpperCase()));
    this.cdr.detectChanges();
  }

}
