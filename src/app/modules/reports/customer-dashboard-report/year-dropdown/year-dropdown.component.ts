import { Component, HostBinding, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-year-dropdown',
  templateUrl: './year-dropdown.component.html',
  styleUrls: ['./year-dropdown.component.scss']
})
export class YearDropdownComponent implements OnInit {
  @HostBinding('class') class =
  'menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold w-200px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @Output() eventFromDrop = new EventEmitter();

  @Input() years : Array<{ year: number }>;
  selectId : number = -1;
  constructor() {}

  onClickDrop(value : any) {
    if(this.selectId == Number(value))
      return;
    console.log(value);
    this.selectId = Number(value);
    this.eventFromDrop.emit(value);
  }

  ngOnInit(): void {
    
  }

}
