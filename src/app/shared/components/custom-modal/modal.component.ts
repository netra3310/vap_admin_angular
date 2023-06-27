import { Component, ViewEncapsulation, ElementRef, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';

import { ModalService } from './modal.service';

@Component({
    selector: 'jw-modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['modal.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnDestroy {
    @Input() id?: string;
    @Input() modalId: string;
    @Input() modalTitle: string;
    @Input() modalSize: string;
    @Input() actionClose: boolean = false;

    @Output() emitClose = new EventEmitter();

    isOpen = false;
    private element: any;

    constructor() {
        // this.element = el.nativeElement;
    }

    ngOnInit() {
    //     // add self (this modal instance) to the modal service so it can be opened from any component
    //     this.modalService.add(this);

    //     // move element to bottom of page (just before </body>) so it can be displayed above everything else
    //     document.body.appendChild(this.element);

    //     // close modal on background click
    //     this.element.addEventListener('click', (el: any) => {
    //         if (el.target.className === 'jw-modal') {
    //             this.close();
    //         }
    //     });
    }

    ngOnDestroy() {
    //     // remove self from modal service
    //     this.modalService.remove(this);

    //     // remove modal element from html
    //     this.element.remove();
    }

    // open() {
    //     this.element.style.display = 'block';
    //     document.body.classList.add('jw-modal-open');
    //     this.isOpen = true;
    // }

    // close() {
    //     this.element.style.display = 'none';
    //     document.body.classList.remove('jw-modal-open');
    //     this.isOpen = false;
    // }

    onClose() {
        this.emitClose.emit();
    }
}
