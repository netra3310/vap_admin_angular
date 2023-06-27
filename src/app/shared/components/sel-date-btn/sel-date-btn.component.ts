import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-sel-date-btn',
  templateUrl: './sel-date-btn.component.html',
  styleUrls: ['./sel-date-btn.component.scss']
})
export class SelDateBtnComponent implements OnInit {
  @Input() options : any = [];
  @Input() placeholderSelector : string = '';
  @Input() twBinding : any = '';


  @Output() twBindingChange = new EventEmitter();
  @Output() emitSelDate = new EventEmitter();

  selectValue:any = "Select Search By Date";

  constructor() { }

  ngOnInit(): void {
    // this.selectValue = this.placeholderSelector || "Select Search By Date"; // set default value if placeholderSelector is null
    // console.log('ngoninit this date list is ', this.options);
    // if(this.twBinding !== null) {
    //   this.selectValue = this.options[this.twBinding].label;
    // }
    console.log("init twbinding is ", this.twBinding);
    console.log("init options is ", this.options);
    this.selectValue = this.placeholderSelector || "Select Search By Date"; // set default value if placeholderSelector is null
    if(this.twBinding == null) {
      this.twBinding = 0; // or any other default value that is appropriate for your use case
    }
    if(this.twBinding !== null) {
      this.selectValue = this.options[this.twBinding].label;
      this.onSelOption(this.options[this.twBinding]);
    }
    
    // console.log("ssssssss", this.options[this.twBinding]?.value);
    // this.emitSelDate.emit(this.options[this.twBinding]?.value)
  }

  test(event : any) {
    console.log(event);
  }

  ngOnchanges(changes : SimpleChanges) {
    if(changes.twBinding) {
      console.log('date twbinding is ', this.twBinding);
    }
  }
  
  onSelOption(event : any) {
    this.selectValue = event.label
    this.twBinding = event.value;
    this.twBindingChange.emit(event.value);
    this.emitSelDate.emit(event.value);
  }

}
