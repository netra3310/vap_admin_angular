import { Component, HostBinding, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu2',
  templateUrl: './dropdown-menu2.component.html',
})
export class DropdownMenu2Component implements OnInit {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold w-200px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @Output() eventFromDrop = new EventEmitter();

  selectId : number = -1;
  constructor() {}

  onClickDrop(value : any) {
    if(this.selectId == Number(value))
      return;
    this.selectId = Number(value);
    this.eventFromDrop.emit(value);
  }

  ngOnInit(): void {}
}
