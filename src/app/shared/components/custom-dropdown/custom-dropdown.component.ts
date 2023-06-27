import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss']
})
export class CustomDropdownComponent implements OnInit {

  @Input() options : any;
  @Input() virtualScroll : boolean;
  @Input() twBinding : any;
  @Input() showClear : any;
  @Input() placeholder : string;
  @Input() enableSearch : boolean = true;
  @Input() optionLabel : string = 'Name';
  @Input() initPlaceholder = 'Select...';

  @Output() onChange = new EventEmitter();
  @Output() twBindingChange = new EventEmitter();

  optionKey : string = 'ID';
  constructor() {
  }

  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if(changes.options || changes.twBinding) {
      if(!(this.options === null || this.options === undefined)) {
        if(this.options.length > 0) {
          let optionKeys = Object.keys(this.options.slice(0, 1)[0]);
          for ( let key of optionKeys) {
            if(key != this.optionLabel && !(key === null || key === undefined)) {
              this.optionKey = key;
              break;
            }
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

  initialDrop() {
    for (let option of this.options) {
      if(option[this.optionKey] == this.twBinding) {
        this.placeholder = option[this.optionLabel];
        break;
      }
    }
  }

  setOptionKey() {
    if(!(this.options === null || this.options === undefined)) {
      if(this.options.length > 0) {
        let optionKeys = Object.keys(this.options.slice(0, 1)[0]);
        for ( let key of optionKeys) {
          if(key != this.optionLabel && !(key === null || key === undefined)) {
            this.optionKey = key;
            break;
          }
        }
      }
    }
  }

    
  onSelOption(event : any) {
    this.setOptionKey();
    this.placeholder = event[this.optionLabel];
    this.twBinding = event[this.optionKey];
    console.log(event, this.optionKey, this.twBinding);
    this.twBindingChange.emit(this.twBinding);
    this.onChange.emit(event);
  }
}
