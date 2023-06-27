import { Component, HostBinding, OnInit, Input, 
        EventEmitter, OnChanges, SimpleChanges, 
        ChangeDetectionStrategy, ChangeDetectorRef  
      } from '@angular/core';

@Component({
  selector: 'app-sel-col-drop',
  templateUrl: './sel-col-drop.component.html',
  styleUrls: ['./sel-col-drop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelColDropComponent implements OnInit {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  @Input() options: any;
  @Input() selectedColumns: any;
  @Input() selectedItemsLabel: any;
  @Input() placeholder: string;
  @Input() initialColumns: any;

  checkedOptions: { [key: string]: boolean } = {};

  constructor(private cdr : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.setCheckedOptions();
  }
  ngAfterViewInit() {
    // Detect changes manually after the view has been initialized
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    // set page when items array first set or changed
    if (changes.selectedColumns) {
      this.setCheckedOptions();
    }
  }
  
  setCheckedOptions() {
    this.options.forEach((option : any) => {
  
      if(this.selectedColumns.includes(option)) {
        this.checkedOptions[option.field] = true;
      } else {   
        this.checkedOptions[option.field] = false;
      }
  
      // if(this.selectedColumns.includes(option)){
  
      // }
    });
  }

  setSelectedColumn(option : any) {
    if (this.checkedOptions[option.field]) {
      // Checkbox is checked
      const index = this.selectedColumns.indexOf(option);
      if (index !== -1) {
        this.selectedColumns.splice(index, 1);
      }
    } else {
      // Checkbox is unchecked
      this.selectedColumns.push(option);
    }
  }

}
