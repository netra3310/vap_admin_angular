import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-custom-confirm-dialog',
  templateUrl: './custom-confirm-dialog.component.html',
  styleUrls: ['./custom-confirm-dialog.component.scss']
})
export class CustomConfirmDialogComponent implements OnInit {

  @Input() title = 'Confirmation';
  @Input() message: string;

  constructor(public activeModal: NgbActiveModal) { }
  
  ngOnInit(): void {
  }

}
