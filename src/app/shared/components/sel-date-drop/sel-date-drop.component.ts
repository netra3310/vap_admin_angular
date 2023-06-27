import { Component, HostBinding, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-sel-date-drop',
  templateUrl: './sel-date-drop.component.html',
  styleUrls: ['./sel-date-drop.component.scss']
})
export class SelDateDropComponent implements OnInit {
  @HostBinding('class') class =
  'menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold w-200px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  
  @Output() emitSelOption = new EventEmitter();
  
  @Input() items : any;

  selectValue:any = "Select Search By Date";
  selectId : number = -1;
  constructor() {}

  onClickDrop(item : any) {
    if(this.selectId == Number(item.value) && Number(item.value) != 7)
      return;
    this.selectId = Number(item.value);
    this.emitSelOption.emit(item);
  }

  ngOnInit(): void {
    
  }
}
