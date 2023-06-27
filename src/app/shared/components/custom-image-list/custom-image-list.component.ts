import { Component, OnInit, Input, Output, ChangeDetectorRef, EventEmitter, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';
import { SearchPipe } from 'src/app/shared/pipes/search-pipe';

@Component({
  selector: 'app-custom-image-list',
  templateUrl: './custom-image-list.component.html',
  styleUrls: ['./custom-image-list.component.scss']
})
export class CustomImageListComponent implements OnInit {

  @Input() images: any;
  @Input() hideAdd = false;
  @Input() hideRemove = false;
  @Input() imageColumns : any;
  @Output() emitRemove = new EventEmitter();
  @Output() emitAdd = new EventEmitter();
  
  modalImageConfig: ModalConfig = {
    modalTitle: '',
    modalContent: "",
    modalSize: 'lg',
    hideCloseButton: () => true,
    hideDismissButton: () => true,
  };
  @ViewChild('modalImage') private modalImageComponent: ModalComponent;
  
  imgSrc = '';
  imageBasePath = '';
  viewImages: any;
  searchKey = '';
  constructor(private apiService: vaplongapi) { 
    this.imageBasePath = this.apiService.imageBasePath;
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.images) {
      console.log('images list is ', this.images);
      this.viewImages = this.images;
      if(this.searchKey != '') {
        this.searchData();
      }
    }
  }

  removeImage(item: any) {
    this.emitRemove.emit(item);
  }

  addImage(item: any) {
    this.emitAdd.emit(item);
  }

  viewImage(imgSrc: any) {
    this.imgSrc = this.imageBasePath + imgSrc;
    this.modalImageComponent.open();
  }
  
  searchData() {
    let searchResult = new SearchPipe().transform(this.images, this.imageColumns, this.searchKey);
    this.viewImages = searchResult;
  }
}
