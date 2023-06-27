import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { ThemeModeService } from 'src/app/shared/partials/layout/theme-mode-switcher/theme-mode.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-custom-image-uploader',
  templateUrl: './custom-image-uploader.component.html',
  styleUrls: ['./custom-image-uploader.component.scss']
})
export class CustomImageUploaderComponent implements OnInit {
  @Input() mutiple: any = false;
  @Input() twBinding : any ;
  @Input() placeholderUrl: string = '';

  @Output() onSelect = new EventEmitter();
  @Output() uploadHandler = new EventEmitter();
  @Output() onClear = new EventEmitter();
  @Output() twBindingChange = new EventEmitter();

  uploadFiles : any = [];
  imageUrls: any[] = [];

  imageBasePath = '';

  constructor(
    private cdr: ChangeDetectorRef,    
    private modeService: ThemeModeService
  ) { 
    this.imageBasePath = environment.CUSTOMER_IMAGE_PATH;
  }

  ngOnInit(): void {
  }

  async onFileSelected(event : any) {
    const files = event.target.files;
    // for(let i = 0; i < files.length ; i++) {
    //   if (files[i].type.startsWith('image/')) {
    //     const reader = new FileReader();
    //     reader.onload = (e: any) => {
    //       this.imageUrls.push({image: e.target.result, name: files[i].name});
    //     };
    //     reader.readAsDataURL(files[i]);
    //   }
    //   if(this.mutiple)
    //     this.uploadFiles.push(files[i]);
    //   else
    //     this.uploadFiles[0] = files[i];
    // }
    // Do something with the file, e.g. upload to server
    await this.setImageUrls(files).then(
      () => {
        for (let i = 0; i < files.length; i++) {
          if (this.mutiple)
            this.uploadFiles.push(files[i]);
          else
            this.uploadFiles[0] = files[i];
        }
        // Do something with the file, e.g. upload to server
        this.placeholderUrl = '';
        this.onSelect.emit({files : this.uploadFiles});
        this.cdr.detectChanges();
      }
    )
  }

  async setImageUrls(files: any) {
    return new Promise(((res, rej) => {
      let counter = 0;
      let expectCounter = 0;
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/'))
          expectCounter++;
      }
      if(expectCounter === 0) {
        res(expectCounter);
      }
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          const reader = new FileReader();

          reader.onload = (e: any) => {
            this.imageUrls.push({ image: e.target.result, name: files[i].name });
            counter++;
            if (counter === expectCounter) {
              res(counter);
            }
          };

          reader.readAsDataURL(files[i]);
        }
      }
    }))
  }

  onRemoveFile(event : any) {
    const index = this.uploadFiles.findIndex((file : any) => file === event);
    if(index > -1) {
      this.uploadFiles.splice(index, 1);
    }
  }

  getImage(filename: any) {
    const index = this.imageUrls.findIndex((imageUrl: any) => imageUrl.name === filename);
    let imageUrl = "";
    if (index > -1) {
      imageUrl = this.imageUrls[index].image;
    } else {
      if(this.placeholderUrl) {
        imageUrl = this.placeholderUrl;
      } else{
        if(this.modeService.mode.value === 'dark') {
          imageUrl = "assets/media/svg/files/blank-image-dark.svg"
        } else {
          imageUrl = "assets/media/svg/files/blank-image.svg";
        }
      }
    }
    return imageUrl;
  }

  onUploadFiles() {
    const params = {
      files: this.uploadFiles
    }
    this.uploadHandler.emit(params);
    // this.uploadFiles = [];
  }

  onClearFiles() {
    this.uploadFiles = [];
    this.placeholderUrl = '';
    this.onClear.emit();
  }
}
