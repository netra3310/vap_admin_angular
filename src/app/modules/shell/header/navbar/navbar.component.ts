import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() appHeaderDefaulMenuDisplay: boolean;
  @Input() isRtl: boolean;
  @Input() isNewActivity: any;

  @Output() changeNewActivity = new EventEmitter();
  isNewOpenCartLog: boolean = false;

  itemClass: string = 'ms-1 ms-lg-3';
  btnClass: string =
    'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
  userAvatarClass: string = 'symbol-35px symbol-md-40px';
  btnIconClass: string = 'svg-icon-1';

  constructor() {}

  ngOnInit(): void {}

  onViewOpenCart(event : any) {
    this.isNewOpenCartLog = false;
  }

  onActivity($event : any) {
    this.changeNewActivity.emit(false);
  }

  setNewOpenCart(event : any) {
    this.isNewOpenCartLog = event;
  }
}
