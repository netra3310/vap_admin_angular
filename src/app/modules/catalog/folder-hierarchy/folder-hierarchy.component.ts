import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
// import { MenuItem } from 'primeng/api';

import { Router } from '@angular/router';
import { FolderHierarchys } from '../../../Helper/models/FolderHierarchys';

import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';

import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { ToastService } from '../../shell/services/toast.service';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { IImageModel } from 'src/app/Helper/models/ImageModel';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { datefilter } from 'src/app/Helper/datefilter';
import { StorageService } from 'src/app/shared/services/storage.service';

import { isNullOrUndefined } from 'src/app/Helper/global-functions';

@Component({
  selector: 'app-folder-hierarchy',
  templateUrl: './folder-hierarchy.component.html',
  styleUrls: ['./folder-hierarchy.component.scss'],
})
export class FolderHierarchyComponent implements OnInit, OnDestroy {

  updateStatusModel: UpdateStatus;
  items: any[];
  IsSpinner = false;
  IsAdd = false;
  rows = 10;
  base64textString: IImageModel[] = [];
  totalRecords = 0;
  folderImagesList: FolderHierarchys;
  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID' },
    { label: 'Images', icon: 'fas fa-pencil-alt', dependedProperty: 'ID' },
  ];
  columns: Columns[] = [
    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },
  ];
  FolderColumn: Columns[] = [
    { field: 'ID', header: 'ID', sorting: 'ID', placeholder: '', },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '' },
  ];

 
  initialCoulumns = ['IsActive', 'Name', 'Description'];

  columns1: Columns[] = [
    { field: 'Image', header: 'Image', sorting: '', placeholder: '', isImage: true, type: TableColumnEnum.IMAGE, translateCol: 'SSGENERIC.IMAGE' },
    { field: 'ImageName', header: 'Image', sorting: 'ImageName', placeholder: '', translateCol: 'SSGENERIC.IMAGE' },
    { field: 'ImageName', header: 'Action', sorting: '', placeholder: '', type: TableColumnEnum.DELETE_BUTTON, translateCol: 'SSGENERIC.ACTION' },

  ];
  initialColumnsImages = ['Image', 'ImageName', 'ImageName']
  globalFilterFields1 = ['Image'];
  rowsPerPageOptions1 = [1, 2, 3, 4, 5];

  globalFilterFields = ['Name', 'Description'];
  rowsPerPageOptions = [10, 20, 50, 100];
  FolderHierarchyList: FolderHierarchys[] = [];
  folderHierarchy: FolderHierarchys;
  FolderHierarchyDropDown: any[] = [];
  filteredFolderHierarchy: any[] = [];
  selectFolderHierarchy: any;
  dataFunc: any = customSearchFn;
  IsOpenHierarchyDialog = false;
  AttachDocumentPopDisplay = false;
  imageBasePath;
  Images: any[] = [];
  ImagesList: any[] = [];

  filterModel = {
    PageNo: 0,
    PageSize: 10,
    Product: '',
  };

  uploadedFiles: any[] = [];
  path: any;
  oldName: any;
  FolderHierarchyID: any;
  FolderHierarchyName: any;
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  usermodel: any;

  isLoading: boolean = true;
  isLoadingImages: boolean = false;
  isLoadingFolders: boolean = true;

  @ViewChild('btn_open_modal_attachment') btn_open_modal_attachment: ElementRef;
  @ViewChild('btn_open_modal_add_folder') btn_open_modal_add_folder: ElementRef;
  @ViewChild('btn_open_modal_folders') btn_open_modal_folders: ElementRef;
  
  loadingAction = false;

  constructor(private apiService: vaplongapi, 
      private toastService: ToastService, 
      private router: Router,
      private storageService: StorageService,
      private cdr: ChangeDetectorRef) {
    this.usermodel = this.storageService.getItem('UserModel');
    this.folderHierarchy = new FolderHierarchys();
    this.imageBasePath = this.apiService.imageBasePath;
  }

  ngOnInit(): void {
    this.GetAllFolderHierarchy(); // Get All Discount Group List On Page Load
    this.GetAllFolderDataWithLazyLoadinFunction(this.filterModel);
  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    if (event.forLabel === 'Update') {
      this.EditFolderHierarchy(event.selectedRowData);
    }
    if (event.forLabel === 'Images') {
      this.UpdateImages(event.selectedRowData);
      this.btn_open_modal_attachment.nativeElement.click();
    }
  }

  getFolderHirarchyByID(Id: any) {
    this.isLoadingImages = true;
    this.apiService.GetFolderImagesById(Id).pipe(untilDestroyed(this)).subscribe((res: any) => {
      this.isLoadingImages = false;
      if (res.ResponseText === 'success') {
        this.folderHierarchy = res.FolderHierarchy;
        // this.getFolderHirarchyByID(this.folderHierarchy.ID);
        this.folderImagesList = res.FolderHierarchy;
        this.folderHierarchy = res.FolderHierarchy;
        
        if (!isNullOrUndefined(this.folderImagesList.Images) && this.folderImagesList.Images != '')
        {
          this.Images = [];
          this.ImagesList = this.folderImagesList.Images?.split('|') ?? [];
          this.ImagesList.forEach(element => {
            let obj = {
              Image: this.folderImagesList.Description + '/' + element,
              ImageName: element
            };
            this.Images.push(obj);
          });
        }
       else {
          this.Images = [];
        }
        this.cdr.detectChanges();
        this.AttachfileFunction();
      }
    });
  }
  UpdateImages(folderHierarchy: FolderHierarchys) {
    this.folderHierarchy = folderHierarchy;

    this.getFolderHirarchyByID(this.folderHierarchy.ID);

    // this.Images = folderHierarchy.Images.split('|')
    // this.AttachfileFunction();
  }
  GetAllFolderDataWithLazyLoadinFunction(filterRM: any) {

    const filterRequestModel = new FilterRequestModel();
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.Product = filterRM.Product;
    this.isLoading = true;
    this.apiService.GetAllFolderHierarchyTotalCount(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoading = false;
      if (response.ResponseCode === 0) {
        this.totalRecords = response.TotalRowCount;
        this.isLoading = true;
        this.apiService.GetAllFolderHierarchyPagination(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
          this.isLoading = false;
          if (response1.ResponseCode === 0) {
            this.FolderHierarchyList = response1.FolderHierarchys;
            this.cdr.detectChanges();
          }
          else {

          }
        });
        this.cdr.detectChanges();
      }
      else {
      }
    });
  }

  GetAllFolderHierarchy() {
    this.isLoadingFolders = true;
    this.apiService.GetAllFolderHierarchy().pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoadingFolders = false;
      if (response.ResponseText === 'success') {
        // console.log(response);
        //this.FolderHierarchyList = response.FolderHierarchys;
        for (const item of response.FolderHierarchys) {
          this.FolderHierarchyDropDown.push({
            value: item.ID,
            label: item.Description,
          });
        }
        this.filteredFolderHierarchy = this.FolderHierarchyDropDown;
        // this.totalRecords = response.FolderHierarchys.length;
        this.cdr.detectChanges();
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    });
  }


  AddFolder()// Open Add New Folder Section
  {
    if(this.isLoadingFolders){
      this.toastService.showInfoToast("Info", "Loading folder data.")
      return;
    }
    this.btn_open_modal_add_folder.nativeElement.click();
    this.ResetFields();
    this.IsAdd = !this.IsAdd;
  }
  CloseAddSection()// Close Add New Folder Section
  {
    this.IsAdd = false;
  }
  SaveUpdateFolderHierarchyDetails() {
    if (this.folderHierarchy.ID && this.folderHierarchy.ID > 0)  // for Update
    {
      this.UpdateFolderHierarchy();
    }
    else {
      this.SaveFolderHierarchy(); // for save
    }
    this.btn_open_modal_add_folder.nativeElement.click();
  }
  validateFields(folderHierarchy: FolderHierarchys) {

    if (folderHierarchy.Name === '') {
      this.toastService.showErrorToast('Error', 'Please Provide folder name');
      return false;
    }

    if (this.selectFolderHierarchy.label === '' || this.selectFolderHierarchy.label == null ||
      this.selectFolderHierarchy.value === '' || this.selectFolderHierarchy.value == null) {
      this.toastService.showErrorToast('Error', 'Please Provide parent folder');
      return false;
    }
    return true;
  }
  alreadyExist() {
    let res = this.FolderHierarchyList.filter((x: any) => x.Name.toLowerCase() === this.folderHierarchy.Name?.toLowerCase());
    if (res.length <= 0) {
      return false;
    } else {
      const exist = res.filter((x: any) => x.ID === this.folderHierarchy.ID);
      if (exist.length > 0) {
        return false;
      } else {
        return true;
      }
    }
  }
  SaveFolderHierarchy() // Save Folder Lable Method To Communicate API
  {
    if (!this.validateFields(this.folderHierarchy)) {
      return;
    }
    if (this.alreadyExist()) {
      this.toastService.showErrorToast('Error', 'Name Already Exist');
      return null;
    }
    this.folderHierarchy.ID = 0;
    this.folderHierarchy.RequestedUserID = this.usermodel.ID;
    this.folderHierarchy.ParentID = this.selectFolderHierarchy.value;
    this.folderHierarchy.Description = this.selectFolderHierarchy.label;
    this.folderHierarchy.Images = this.oldName;

    this.apiService.SaveFolderHierarchy(this.folderHierarchy).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllFolderDataWithLazyLoadinFunction(this.filterModel);
        this.GetAllFolderHierarchy();
        this.IsAdd = false;
      }
      else {
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
    },
    );
  }
  UpdateFolderHierarchy() // Update Discount Group Method To Communicate API
  {
    if (!this.validateFields(this.folderHierarchy)) {
      return;
    }
    if (this.alreadyExist()) {
      this.toastService.showErrorToast('Error', 'Name Already Exist');
      return null;
    }
    this.folderHierarchy.ParentID = this.selectFolderHierarchy.value;
    this.folderHierarchy.Description = this.selectFolderHierarchy.label;
    this.folderHierarchy.Images = this.oldName;
    this.folderHierarchy.RequestedUserID = this.usermodel.ID;
    this.loadingAction = true;
    this.apiService.UpdateFolderHierarchy(this.folderHierarchy).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllFolderDataWithLazyLoadinFunction(this.filterModel);
        this.GetAllFolderHierarchy();
        this.IsAdd = false;

      }
      else {
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
      this.loadingAction = false;
      this.cdr.detectChanges();
    },
    );
  }

  EditFolderHierarchy(folderHierarchy: FolderHierarchys) {
    if(this.isLoadingFolders){
      this.toastService.showInfoToast("Info", "Loading folder data.")
      return;
    }
    this.btn_open_modal_add_folder.nativeElement.click();
    this.oldName = folderHierarchy.Name;
    const selected = this.FolderHierarchyDropDown.filter(
      (x) => x.value === folderHierarchy.ParentID
    ).shift();
    this.selectFolderHierarchy = {
      value: selected.value,
      label: selected.label,
    };

    this.folderHierarchy = folderHierarchy;
    this.IsAdd = true;
  }

  UpdateFolderHierarchyStatus(folderHierarchy: any) // Update Discount Group Status Method To Communicate API
  {
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = folderHierarchy.ID;
    this.updateStatusModel.Status = !folderHierarchy.IsActive;
    this.updateStatusModel.UpdatedByUserID = this.usermodel.ID;

    this.apiService.UpdateFolderHierarchyStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllFolderDataWithLazyLoadinFunction(this.filterModel);
        this.GetAllFolderHierarchy();

      }
      else {
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    });
  }

  ResetFields() // Reset Object
  {
    this.folderHierarchy = new FolderHierarchys();
  }
  OpenHierarchyDialog() {
    this.IsOpenHierarchyDialog = true;
    this.btn_open_modal_folders.nativeElement.click();
  }
  selectValue(newValue: any) {
    // this.folderHierarchy = newValue;
    this.selectFolderHierarchy = {
      value: newValue.ID,
      label: newValue.Description,
    };
    this.IsOpenHierarchyDialog = false;
    // this.btn_open_modal_folders.nativeElement.click();
    this.btn_open_modal_add_folder.nativeElement.click();
  }
  AttachfileFunction() {
    this.AttachDocumentPopDisplay = true;
  }

  onUpload(event: any) {
    if (this.base64textString.length > 0) {
      // form.clear();
      this.base64textString = [];
    }
    for (const file of event) {
      if (file) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        const self = this;
        // tslint:disable-next-line: only-arrow-functions
        reader.onload = function (e) {
          // self.base64textString.push({ Base64String: reader.result.toString(), Extention: file.type.split('/')[1] });
          self.base64textString.push({ Base64String: reader.result?.toString() ?? "", Extention: file.name });

        };
      }

    }
  }
  UpdateImage(form: any) {
    this.IsSpinner = true;
    const obj: FolderHierarchys = {
      AttachedImages: this.base64textString,
      Description: this.folderHierarchy.Description,
      ID: this.folderHierarchy.ID,
      Images: this.folderHierarchy.Images,
      Name: this.folderHierarchy.Name,
      RequestedUserID : this.usermodel.ID,

    };
    this.apiService.UploadImageFolderHierarchy(obj).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseCode === 0) {
        this.getFolderHirarchyByID(this.folderHierarchy.ID);
        // form.clear();
        this.base64textString = [];
        this.toastService.showSuccessToast('Success', response.ResponseText);
      } else {
        this.toastService.showErrorToast('Error', response.ResponseText);
      }

      this.IsSpinner = false;
    },
      error => {
        this.toastService.showErrorToast('Error', 'Something went wrong');
        this.IsSpinner = false;
      });
  }

  DeleteImage(Image: any) {
    ;
    let finalImage = '';
    if (Image == this.folderHierarchy.Images) {
      finalImage = '';
    }
    else {
      let images = this.folderHierarchy.Images?.split('|') ?? [];
      let newImages = images.filter(e => e !== Image);
      finalImage = newImages.join("|");
    }


    const obj: FolderHierarchys = {
      Description: this.folderHierarchy.Description,
      ID: this.folderHierarchy.ID,
      Images: finalImage,
      Name: this.folderHierarchy.Name
    };
    this.apiService.UploadImageFolderHierarchy(obj).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.getFolderHirarchyByID(this.folderHierarchy.ID);
        this.toastService.showSuccessToast('Success', response.ResponseText);
      }
    });
  }

  handleReaderLoaded(e: any) {
    this.base64textString.push({ Base64String: 'data:image/png;base64,' + btoa(e.target.result), Extention: 'png' });
  }
  onCloseFoldersModal() {
    this.btn_open_modal_add_folder.nativeElement.click();
  }
}
