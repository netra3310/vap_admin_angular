import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
//import { Table } from 'primeng/table';
////import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { ProductPower } from '../../../Helper/models/ProductPower';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ToastService } from '../../shell/services/toast.service';


@Component({
  selector: 'app-product-power',
  templateUrl: './product-power.component.html',
  styles: [
  ],
})
export class ProductPowerComponent implements OnInit, OnDestroy {
  
  AllProductPowerList: ProductPower[] = [];
  selectedProductPower: ProductPower;
  public ProductPower: ProductPower;
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

  @ViewChild('btn_open_modal_add_product_power') btn_open_modal_add_product_power: ElementRef;

  constructor(private apiService: vaplongapi, 
    private toastService: ToastService,
    private cdr: ChangeDetectorRef) {

    this.ProductPower = new ProductPower();
  }

  ngOnInit(): void {
    this.GetAllProductPowerList(); // Get All Classification List On Page Load

  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    this.EditProductPower(event.selectedRowData);
  }

  GetAllProductPowerList() // Get All ProductPower Method Get Data from Service
  {
    this.IsSpinner = true;

    this.apiService.GetAllPowers().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.AllProductPowerList = response.AllPowerList;
        this.totalRecords = response.AllPowerList.length;
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

  AddProductPower()// Open Add New ProductPower Section
  {
    this.ResetFields();
    this.IsAdd = true;
    this.btn_open_modal_add_product_power.nativeElement.click();
  }
  CloseAddSection()// Close Add New ProductPower Section
  {
    this.IsAdd = false;
    this.btn_open_modal_add_product_power.nativeElement.click();

  }
  SaveUpdateProductPowerDetails() {

    if (this.ProductPower.ID > 0)  // for Update
    {
      this.UpdateProductPower();
    }
    else {
      this.SaveProductPower(); // for save
    }


  }
  SaveProductPower() // Save Code Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddPower(this.ProductPower).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductPowerList();
        this.IsSpinner = false;
        this.IsAdd = false;
        this.btn_open_modal_add_product_power.nativeElement.click();

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }
  UpdateProductPower() // Update ProductPower Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.UpdatePower(this.ProductPower).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductPowerList();
        this.IsSpinner = false;
        this.IsAdd = false;
        this.btn_open_modal_add_product_power.nativeElement.click();

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }

  EditProductPower(ProductPower: ProductPower) {
    this.ProductPower = ProductPower;
    this.IsAdd = true;
    this.btn_open_modal_add_product_power.nativeElement.click();
  }

  UpdateProductPowerStatus(ProductPower: any) // Update ProductPower Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = ProductPower.ID;
    this.updateStatusModel.Status = !ProductPower.IsActive;
    this.updateStatusModel.UpdatedByUserID = ProductPower.CreatedByUserID;
    this.apiService.UpdatePowerStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductPowerList();
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
    this.ProductPower = new ProductPower();
  }

}
