import { Component, OnInit, ElementRef, Input, HostListener, Output,EventEmitter  } from '@angular/core';
import { PermissionService } from "../../services/permission.service";

@Component({
  selector: 'app-context-drop',
  templateUrl: './context-drop.component.html',
  styleUrls: ['./context-drop.component.scss']
})
export class ContextDropComponent implements OnInit {
  public text: String;
  @Input() items : any[];
  @Input() selectedStock : any;
  @Input() menuItems : any ;

  @Input() switchItem: any = '';
  // @Input() emitOutput : any;

  @HostListener('document:click', ['$event'])
  clickout(event : any) {
    if(this.eRef.nativeElement.contains(event.target)) {
      // alert("clicked inside");
    } else {
      // alert("clicked outside");
      this.showBlock = false;
    }
  }

  @Output() emitMenuAction = new EventEmitter();
  @Output() emitSwitchAction = new EventEmitter();

  showBlock = false;

  constructor(
      private eRef: ElementRef, 
      private permission: PermissionService,
  ) { }

  ngOnInit(): void {
    this.showMenuItems(event);
  }

  onContextDrop(event : any) {
    event.preventDefault();
    this.showBlock = !this.showBlock;
  }

  emitOutput(Property: string, selectedRow: any) {
    const obj = { forLabel: Property, selectedRowData: selectedRow };
    this.emitMenuAction.emit(obj);
  }

  
  showMenuItems(event : any) {
    this.items = [];
    this.menuItems.forEach((x : any) => {
      if (x.permission) {
        if (
          this.selectedStock[x.dependedProperty] &&
          this.permission.getPermissionAccess(x.permission)
        ) {
          const perm = this.selectedStock[x.permissionDisplayProperty];
          // tslint:disable-next-line: deprecation
          if ((perm === null || perm === undefined) || perm === true) {
            const obj = {
              label: x.label,
              icon: x.icon,
              command: () => this.emitOutput(x.label, this.selectedStock),
            };
            this.items.push(obj);
          }
        }
      } else {
        if (this.selectedStock[x.dependedProperty]) {
          const obj = {
            label: x.label,
            icon: x.icon,
            command: () => this.emitOutput(x.label, this.selectedStock),
          };
          this.items.push(obj);
        }
      }
    });

    // temp without permission so when complete this commend remove.
    // this.items = this.menuItems;
  }

  onSwitch() {
    this.emitSwitchAction.emit(this.selectedStock);
  }

}
