import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
//import { Table } from 'primeng/table';
////import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { ProductCapacity } from '../../../Helper/models/ProductCapacity';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ToastService } from '../../shell/services/toast.service';


@Component({
  selector: 'app-product-capacity',
  templateUrl: './product-capacity.component.html',
  styles: [
  ],
})
export class ProductCapacityComponent implements OnInit, OnDestroy {
  
  AllProductCapacityList: ProductCapacity[] = [];
  selectedProductCapacity: ProductCapacity;
  public ProductCapacity: ProductCapacity;
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

  @ViewChild('btn_open_modal_add_product_capacity') btn_open_modal_add_product_capacity: ElementRef;

  constructor(private apiService: vaplongapi, private toastService: ToastService,
    private cdr: ChangeDetectorRef) {

    this.ProductCapacity = new ProductCapacity();
  }

  ngOnInit(): void {
    this.GetAllProductCapacityList(); // Get All Classification List On Page Load

  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    this.EditProductCapacity(event.selectedRowData);
  }

  GetAllProductCapacityList() // Get All ProductCapacity Method Get Data from Service
  {
    this.IsSpinner = true;

    this.apiService.GetAllCapacity().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.AllProductCapacityList = response.AllCapacityList;
        this.totalRecords = response.AllCapacityList.length;
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

  AddProductCapacity()// Open Add New ProductCapacity Section
  {
    this.ResetFields();
    this.IsAdd = true;
    this.btn_open_modal_add_product_capacity.nativeElement.click();

  }
  CloseAddSection()// Close Add New ProductCapacity Section
  {
    this.IsAdd = false;

    this.btn_open_modal_add_product_capacity.nativeElement.click();
  }
  SaveUpdateProductCapacityDetails() {

    if (this.ProductCapacity.ID > 0)  // for Update
    {
      this.UpdateProductCapacity();
    }
    else {
      this.SaveProductCapacity(); // for save
    }


  }
  SaveProductCapacity() // Save Code Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddCapacity(this.ProductCapacity).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductCapacityList();
        this.IsSpinner = false;
        this.IsAdd = false;

        this.btn_open_modal_add_product_capacity.nativeElement.click();
      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }
  UpdateProductCapacity() // Update ProductCapacity Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.UpdateCapacity(this.ProductCapacity).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductCapacityList();
        this.IsSpinner = false;
        this.IsAdd = false;

        this.btn_open_modal_add_product_capacity.nativeElement.click();
      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }

  EditProductCapacity(ProductCapacity: ProductCapacity) {
    this.ProductCapacity = ProductCapacity;
    this.IsAdd = true;
    this.btn_open_modal_add_product_capacity.nativeElement.click();
  }

  UpdateProductCapacityStatus(ProductCapacity: any) // Update ProductCapacity Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = ProductCapacity.ID;
    this.updateStatusModel.Status = !ProductCapacity.IsActive;
    this.updateStatusModel.UpdatedByUserID = ProductCapacity.CreatedByUserID;
    this.apiService.UpdateCapacityStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductCapacityList();
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
    this.ProductCapacity = new ProductCapacity();
  }

}
