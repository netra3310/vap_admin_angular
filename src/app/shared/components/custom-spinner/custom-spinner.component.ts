import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-custom-spinner',
  templateUrl: './custom-spinner.component.html',
  styleUrls: ['./custom-spinner.component.scss']
})
export class CustomSpinnerComponent implements OnInit {

  @Input() isLoading : boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}
