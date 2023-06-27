import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-custom-date-picker',
  templateUrl: './custom-date-picker.component.html',
  styleUrls: ['./custom-date-picker.component.scss']
})
export class CustomDatePickerComponent implements OnInit {

  @Input() twBinding : any;
  @Input() showIcon : any;
  
  @Output() twBindingChange = new EventEmitter();

  selectedDate: NgbDateStruct;
   
  constructor() { 
    this.selectedDate = this.getToday();
  }

  ngOnInit(): void {
  }
    
  ngOnChanges(changes: SimpleChanges) {
    // if(changes.twBinding) {
    //   if(this.twBinding === null || this.twBinding === undefined) {
    //     console.log('select date picker twbinding is ', this.twBinding)
    //     this.selectedDate = this.twBinding;
    //   }
    // }
  }

  getToday(): NgbDateStruct {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
  }

  setDate(event : any) {
    this.twBinding = new Date(event.year, event.month - 1, event.day);
    this.twBindingChange.emit(this.twBinding);
  }
}
