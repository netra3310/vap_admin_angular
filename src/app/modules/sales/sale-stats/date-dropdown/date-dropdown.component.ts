import { Component, HostBinding, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-date-dropdown',
  templateUrl: './date-dropdown.component.html',
  styleUrls: ['./date-dropdown.component.scss']
})
export class DateDropdownComponent implements OnInit {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold w-200px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @Output() eventFromDrop = new EventEmitter();

  selectId : number = -1;
  constructor() {}

  onClickDrop(value : any) {
    if(this.selectId == Number(value) && !(Number(value) == 7))
      return;
    this.selectId = Number(value);
    this.eventFromDrop.emit(value);
  }

  ngOnInit(): void {}
}
