import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-file-uploader',
  templateUrl: './custom-file-uploader.component.html',
  styleUrls: ['./custom-file-uploader.component.scss']
})
export class CustomFileUploaderComponent implements OnInit {
  @Input() mutiple: any = false;
  @Input() twBinding: any;

  @Output() onSelect = new EventEmitter();
  @Output() uploadHandler = new EventEmitter();
  @Output() onClear = new EventEmitter();
  @Output() twBindingChange = new EventEmitter();

  uploadFiles: any = [];
  imageUrls: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  async onFileSelected(event: any) {
    const files = event.target.files;
    await this.setImageUrls(files).then(
      () => {
        for (let i = 0; i < files.length; i++) {
          if (this.mutiple) {
            const index = this.uploadFiles.findIndex((file: any) => (file.name === files[i].name && file.size === files[i].size && file.type === files[i].type));
            if(index > -1) {
              continue;
            }
            
            this.uploadFiles.push(files[i]);
          }
          else
            this.uploadFiles[0] = files[i];
        }
        // Do something with the file, e.g. upload to server
        this.cdr.detectChanges();
        this.onSelect.emit(this.uploadFiles);
      }
    )
    event.target.value = [];
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

  onRemoveFile(event: any) {
    const index = this.uploadFiles.findIndex((file: any) => file === event);
    if (index > -1) {
      this.uploadFiles.splice(index, 1);
    }
  }

  getImage(filename: any) {
    const index = this.imageUrls.findIndex((imageUrl: any) => imageUrl.name === filename);
    let imageUrl = "";
    if (index > -1) {
      imageUrl = this.imageUrls[index].image;
    } else {
      imageUrl = "assets/media/svg/files/upload.svg";
    }
    return imageUrl;
  }

  onUploadFiles() {
    const params = {
      files: this.uploadFiles
    }
    this.uploadHandler.emit(params);
    this.uploadFiles = [];
  }

  onClearFiles() {
    this.uploadFiles = [];
    this.onClear.emit();
  }
}
