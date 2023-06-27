import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
//import { Table } from 'primeng/table';
////import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { ProductPackaging } from '../../../Helper/models/ProductPackaging';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ToastService } from '../../shell/services/toast.service';


@Component({
  selector: 'app-product-packaging',
  templateUrl: './product-packaging.component.html',
  styles: [
  ],
})
export class ProductPackagingComponent implements OnInit, OnDestroy {
  
  AllProductPackagingList: ProductPackaging[] = [];
  selectedProductPackaging: ProductPackaging;
  public ProductPackaging: ProductPackaging;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';

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
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },

  ];
  globalFilterFields = ['Name', 'Description'];
  rowsPerPageOptions = [10, 20, 50, 100];

  @ViewChild('btn_open_modal_add_product_packaging') btn_open_modal_add_product_packaging: ElementRef;

  constructor(private apiService: vaplongapi, private toastService: ToastService,
    private cdr: ChangeDetectorRef) {

    this.ProductPackaging = new ProductPackaging();
  }

  ngOnInit(): void {
    this.GetAllProductPackagingList(); // Get All Classification List On Page Load

  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    this.EditProductPackaging(event.selectedRowData);
  }

  GetAllProductPackagingList() // Get All ProductPackaging Method Get Data from Service
  {
    this.IsSpinner = true;

    this.apiService.GetAllPackaging().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.AllProductPackagingList = response.AllPackagingList;
        this.totalRecords = response.AllPackagingList.length;
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

  AddProductPackaging()// Open Add New ProductPackaging Section
  {
    this.ResetFields();
    this.IsAdd = true;
    this.btn_open_modal_add_product_packaging.nativeElement.click();
  }
  CloseAddSection()// Close Add New ProductPackaging Section
  {
    this.IsAdd = false;
    this.btn_open_modal_add_product_packaging.nativeElement.click();

  }
  SaveUpdateProductPackagingDetails() {

    if (this.ProductPackaging.ID > 0)  // for Update
    {
      this.UpdateProductPackaging();
    }
    else {
      this.SaveProductPackaging(); // for save
    }


  }
  SaveProductPackaging() // Save Code Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddPackaging(this.ProductPackaging).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductPackagingList();
        this.IsSpinner = false;
        this.IsAdd = false;
        this.btn_open_modal_add_product_packaging.nativeElement.click();

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }
  UpdateProductPackaging() // Update ProductPackaging Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.UpdatePackaging(this.ProductPackaging).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductPackagingList();
        this.IsSpinner = false;
        this.IsAdd = false;
        this.btn_open_modal_add_product_packaging.nativeElement.click();

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }

  EditProductPackaging(ProductPackaging: ProductPackaging) {
    this.ProductPackaging = ProductPackaging;
    this.IsAdd = true;
    this.btn_open_modal_add_product_packaging.nativeElement.click();
  }

  UpdateProductPackagingStatus(ProductPackaging: any) // Update ProductPackaging Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = ProductPackaging.ID;
    this.updateStatusModel.Status = !ProductPackaging.IsActive;
    this.updateStatusModel.UpdatedByUserID = ProductPackaging.CreatedByUserID;
    this.apiService.UpdatePackagingStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductPackagingList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }

  ResetFields() // Reset Object
  {
    this.ProductPackaging = new ProductPackaging();
  }

}
