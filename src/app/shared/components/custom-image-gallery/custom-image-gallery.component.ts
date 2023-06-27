import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { Component, OnInit, ViewChild, ElementRef, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-custom-image-gallery',
  templateUrl: './custom-image-gallery.component.html',
  styleUrls: ['./custom-image-gallery.component.scss']
})
export class CustomImageGalleryComponent implements OnInit {
  
  @Input() imgSrc : any;
  arrImg: any;
  imageBasePath;
  @ViewChild('btn_open_img_modal') btn_open_img_modal: ElementRef;

  constructor(
    private apiService: vaplongapi
  ) { 
    this.imageBasePath = this.apiService.imageBasePath;
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes : SimpleChanges) {
    if(changes.imgSrc) {
      console.log(this.imgSrc);
      if(!(this.imgSrc === null || this.imgSrc === undefined || this.imgSrc === '')){
        this.arrImg = [];
        let tmpArr = this.imgSrc.split('|');
        tmpArr.forEach((element: any) => {
          this.arrImg.push(this.imageBasePath +''+ element);
        });
      } else {
        this.arrImg = ['../../../../assets/layout/images/no-image.png'];
      }
    }
  }

  popUpImageFuctionMultiple(imgSrc : any) {
    // this.btn_open_multi_img_modal.nativeElement.click();
  }

}
