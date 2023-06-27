import { Component, Input, Output, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { ModalConfig } from 'src/app/shared/partials/layout/modals/modal.config';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html',
})
export class GenericModalComponent {

  @Input() public modalConfig: ModalConfig;
  @Input() transparent: boolean = false;
  @ViewChild('modal') private modalContent: TemplateRef<GenericModalComponent>;
  @Output() afterOpen = new EventEmitter()
  private modalRef: NgbModalRef;
  modalOption: NgbModalOptions ;

  constructor(private modalService: NgbModal) {
  }

  open(): Promise<boolean> {
    this.modalOption = {
      ...Component,
      size: this.modalConfig.modalSize ? this.modalConfig.modalSize : 'md'
    }
    return new Promise<boolean>((resolve) => {
      this.modalRef = this.modalService.open(this.modalContent, this.modalOption);
      this.modalRef.result.then(resolve, resolve);
      this.afterOpen.emit();
    });
  }

  async close(): Promise<void> {
    if (
      this.modalConfig.shouldClose === undefined ||
      (await this.modalConfig.shouldClose())
    ) {
      const result =
        this.modalConfig.onClose === undefined ||
        (await this.modalConfig.onClose());
      this.modalRef.close(result);
    }
  }

  async dismiss(): Promise<void> {
    if (this.modalConfig.disableDismissButton !== undefined) {
      return;
    }

    if (
      this.modalConfig.shouldDismiss === undefined ||
      (await this.modalConfig.shouldDismiss())
    ) {
      const result =
        this.modalConfig.onDismiss === undefined ||
        (await this.modalConfig.onDismiss());
      this.modalRef.dismiss(result);
    }
  }
}
