import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
//import { Table } from 'primeng/table';
////import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ToastService } from '../../shell/services/toast.service';
import { ProductPrint } from 'src/app/Helper/models/ProductPrint';


@Component({
  selector: 'app-product-print',
  templateUrl: './product-print.component.html',
  styles: [
  ],
})
export class ProductPrintComponent implements OnInit, OnDestroy {
  
  AllProductPrintList: ProductPrint[] = [];
  selectedProductPrint: ProductPrint;
  public ProductPrint: ProductPrint;
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

  @ViewChild('btn_open_modal_add_product_print') btn_open_modal_add_product_print: ElementRef;

  constructor(private apiService: vaplongapi, private toastService: ToastService,
    private cdr: ChangeDetectorRef) {

    this.ProductPrint = new ProductPrint();
  }

  ngOnInit(): void {
    this.GetAllProductPrintList(); // Get All Classification List On Page Load

  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    this.EditProductPrint(event.selectedRowData);
  }

  GetAllProductPrintList() // Get All ProductPrint Method Get Data from Service
  {
    this.IsSpinner = true;

    this.apiService.GetAllPrints().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.AllProductPrintList = response.AllPrintList;
        this.totalRecords = response.AllPrintList.length;
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

  AddProductPrint()// Open Add New ProductPrint Section
  {
    this.ResetFields();
    this.IsAdd = true;
    this.btn_open_modal_add_product_print.nativeElement.click();
  }
  CloseAddSection()// Close Add New ProductPrint Section
  {
    this.IsAdd = false;
    this.btn_open_modal_add_product_print.nativeElement.click();

  }
  SaveUpdateDetails() {

    if (this.ProductPrint.ID > 0)  // for Update
    {
      this.UpdateProductPrint();
    }
    else {
      this.SaveProductPrint(); // for save
    }


  }
  SaveProductPrint() // Save Code Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddPrint(this.ProductPrint).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductPrintList();
        this.IsSpinner = false;
        this.IsAdd = false;
        this.btn_open_modal_add_product_print.nativeElement.click();

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }
  UpdateProductPrint() // Update ProductPrint Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.UpdatePrint(this.ProductPrint).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductPrintList();
        this.IsSpinner = false;
        this.IsAdd = false;
        this.btn_open_modal_add_product_print.nativeElement.click();

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }

  EditProductPrint(ProductPrint: ProductPrint) {
    this.ProductPrint = ProductPrint;
    this.IsAdd = true;
    this.btn_open_modal_add_product_print.nativeElement.click();
  }

  UpdateProductPrintStatus(ProductPrint: any) // Update ProductPrint Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = ProductPrint.ID;
    this.updateStatusModel.Status = !ProductPrint.IsActive;
    this.updateStatusModel.UpdatedByUserID = ProductPrint.CreatedByUserID;
    this.apiService.UpdatePrintStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductPrintList();
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
    this.ProductPrint = new ProductPrint();
  }

}
