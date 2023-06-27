import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomConfirmDialogComponent } from '../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  constructor(private modalService: NgbModal) { }

  confirm(message: string): Promise<boolean> {
    const modalRef = this.modalService.open(CustomConfirmDialogComponent);
    modalRef.componentInstance.message = message;

    return modalRef.result;
  }

}
