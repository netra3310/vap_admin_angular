import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
//import { Table } from 'primeng/table';
////import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { ProductModel } from '../../../Helper/models/ProductModel';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ToastService } from '../../shell/services/toast.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { UserModel } from 'src/app/Helper/models/UserModel';


@Component({
  selector: 'app-product-model',
  templateUrl: './product-model.component.html',
  // styleUrls: ['./product-model.component.scss']
})
export class ProductModelComponent implements OnInit, OnDestroy {
  
  @ViewChild('btn_open_modal_add_product_model') btn_open_modal_add_product_model: ElementRef;
  AllProductModelList: ProductModel[] = [];
  selectedProductModel: ProductModel;
  public productModel: ProductModel;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  filteredModels: any[];
  selectedModel: any;

  valCheck = '';
  ProductSearch = '';
  ProductModels: any[];
  usermodel: UserModel;

  items: any[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  totalRecords = 0;

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID' }
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    // { field: 'DisplayName', header: 'Display Name', sorting: 'DisplayName', placeholder: '', translateCol: 'SSGENERIC.DISPLAYNAME' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },

  ];
  globalFilterFields = ['Name','DisplayName', 'Description'];
  rowsPerPageOptions = [10, 20, 50, 100];

  constructor(
    private apiService: vaplongapi,  
    private storageService: StorageService, 
    private toastService: ToastService,
    private cdr: ChangeDetectorRef) {
    this.productModel = new ProductModel();
    this.usermodel = this.storageService.getItem('UserModel');

    const obj = {
      Action: 'View',
      Description: `View Product Models`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  }

  ngOnInit(): void {  
    this.GetAllProductModelList(); // Get All Product Model List On Page Load
    //this.BindModelDropdownList(); // Bind Autocomplete


  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    this.EditProductModel(event.selectedRowData);
  }

  GetAllProductModelList() // Get All Product Quality Method Get Data from Service 
  {
    this.IsSpinner = true;

    this.apiService.GetAllProductModels().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        //this.AllProductModelList = response.ProductModels;      
        this.AllProductModelList = response.ProductModels.filter((x: any) => x.ParentID === 0 && x.IsActive === true);
        this.totalRecords = this.AllProductModelList.length;

        this.filteredModels = this.AllProductModelList;
        // var rootModel = new ProductModel();
        // rootModel.ID=0;
        // rootModel.DisplayName='No Parent';
        // this.filteredModels.push(rootModel);
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
      this.cdr.detectChanges();
    },
    );

  }

  AddProductModel()// Open Add New Product Model Section
  {
    this.ResetFields();
    this.IsAdd = true;
    this.btn_open_modal_add_product_model.nativeElement.click();
  }
  CloseAddSection()// Close Add New Product Model Section
  {
    this.IsAdd = false;
    this.btn_open_modal_add_product_model.nativeElement.click();

  }
  SaveUpdateProductModelDetails() {

    if (this.productModel.ID > 0)  // for Update
    {
      this.UpdateProductModel();
    }
    else {
      this.SaveProductModel(); // for save
    }


  }
  SaveProductModel() // Save Product Model Method To Communicate API
  {

    // if(this.selectedModel.ID==null || this.selectedModel.ID==undefined )
    // {
    //   this.toastService.showErrorToast('Error', "please select parent model");
    // }
    this.productModel.ID = 0;
    this.productModel.IsActive = true;
    this.productModel.ParentID = 0;
    this.productModel.CreatedByUserID = this.usermodel.ID;

    this.apiService.AddProductModel(this.productModel).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductModelList();
        this.IsAdd = false;

        this.btn_open_modal_add_product_model.nativeElement.click();
      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
    },
    );
  }
  UpdateProductModel() // Update Product Model Method To Communicate API
  {
    // if(this.selectedModel.value==null || this.selectedModel.value==undefined )
    // {
    //   this.toastService.showErrorToast('Error', "please select parent category");
    // }
    this.productModel.IsActive = true;
    this.productModel.ParentID = 0;
    this.productModel.CreatedByUserID = this.usermodel.ID;

    this.apiService.UpdateProductModel(this.productModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductModelList();
        this.IsAdd = false;
        this.btn_open_modal_add_product_model.nativeElement.click();
      }
      else {
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
    },
    );
  }

  EditProductModel(productModel: ProductModel) {
    this.productModel = productModel;
    // var pcategory = this.AllProductModelList.find(x=>x.ID==productModel.ParentID);
    // this.selectedModel = {
    //   value: pcategory.ID,
    //   DisplayName: pcategory.DisplayName
    // };
    this.IsAdd = true;
    this.btn_open_modal_add_product_model.nativeElement.click();
  }

  UpdateProductModelStatus(productModel: any) // Update Product Model Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = productModel.ID;
    this.updateStatusModel.Status = !productModel.IsActive;
    this.updateStatusModel.UpdatedByUserID = this.usermodel.ID;
    this.apiService.UpdateProductModelStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductModelList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }

  ResetFields() // Reset Object
  {
    this.productModel = new ProductModel();
  }

  search(event: any) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.ProductModels.length; i++) {
      const shopCategory = this.ProductModels[i];

      if (shopCategory.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(shopCategory);
      }
    }

    this.filteredModels = filtered;

  }

  BindModelDropdownList() {
    this.ProductModels = [];
    this.apiService.GetProductModelDropDownData().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        for (let i = 0; i < response.DropDownData.length; i++) {
          this.ProductModels.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }
      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
      this.cdr.detectChanges();
    },
    );

  }
}
