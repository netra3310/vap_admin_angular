import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2  } from '@angular/core';
import {NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: CustomInputComponent
    }
  ] 
})
export class CustomInputComponent implements OnInit {

  @Input() type : string;
  @Input() twBinding : any ;
  @Input() isDisabled : any;
  @Input() classGroup : string = '';
  @Input() placeholder: string = '';

  @Output() twBindingChange = new EventEmitter();
  @Output() blur = new EventEmitter();
  @Output() change = new EventEmitter();

  @ViewChild('input_custom') private input_custom: ElementRef;
  constructor(
    private renderer: Renderer2) { }

  ngOnInit(): void {
    if(this.type == 'number'){
      this.twBinding = Number(this.twBinding);
      console.log("twbinding is ", this.twBinding)
    } 
  }

  onChange(event : any) {
    this.twBinding = event.target.value;
    if(this.type == 'number'){
      this.twBinding = Number(this.twBinding);
      console.log("twbinding is ", this.twBinding)
    }
    this.twBindingChange.emit(event.target.value);
    this.blur.emit(event);
    this.change.emit(event);
  }

  focusInput() {
    this.renderer.selectRootElement(this.input_custom.nativeElement).focus();
  }

}
