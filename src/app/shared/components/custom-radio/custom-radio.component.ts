import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-radio',
  templateUrl: './custom-radio.component.html',
  styleUrls: ['./custom-radio.component.scss']
})
export class CustomRadioComponent implements OnInit {

  @Input() twBinding : any;
  @Input() name : string;
  @Input() value: any;
  @Input() inputId : string;

  @Output() twBindingChange = new EventEmitter();
  @Output() click = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    // if(this.twBinding == this.value) {
    //   alert(this.value);
    // }
  }

  onClick(event : any) {
    this.twBinding = event.target.value;
    this.twBindingChange.emit(event.target.value);
    this.click.emit(this.twBinding);
    // alert(this.twBinding);
  }

}
