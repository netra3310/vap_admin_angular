import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss']
})
export class CustomSelectComponent implements OnInit {

  @Input() items : any[];
  @Input() virtualScroll : boolean;
  @Input() twBinding : any = null;
  @Input() searchFn : any;
  @Input() placeholder : string;
  @Input() enableSearch : boolean = true;
  @Input() bindLabel : string = 'label';
  @Input() disabled : boolean = false;
  @Input() bindKey : string = 'value'
  @Input() initPlaceholder = 'Select...'

  @Output() twBindingChange = new EventEmitter();
  @Output() onChange = new EventEmitter();

  viewData : any = [];

  constructor(
    private cdr : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if(this.twBinding != null) {
      this.placeholder = this.twBinding[this.bindLabel];
    }
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if(changes.placeholder) {
    }
    if(changes.items || changes.twBinding) {
      if(!(this.items === null || this.items === undefined)) {
        if(this.items.length > 0) {
          let itemKeys = Object.keys(this.items.slice(0, 1)[0]);
          for ( let key of itemKeys) {
            if(key != this.bindLabel && !(key === null || key === undefined)) {
              this.bindKey = key;
              break;
            }
          }
          
          if(!(this.twBinding === null || this.twBinding === undefined)) {
            this.initialDrop();
          } else {
            this.placeholder = this.initPlaceholder;
          }
        }
      }

    }
  }
  initialDrop() {
    this.placeholder = this.twBinding[this.bindLabel];
  }
    
  onSelOption(event : any) {
    event = this.items.filter((x: any) => x[this.bindKey] == event)[0];
    this.placeholder = event[this.bindLabel];
    this.twBinding = event;
    this.twBindingChange.emit(this.twBinding);
    this.onChange.emit(event);
  }

}
