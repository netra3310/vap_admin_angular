import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
//import { Table } from 'primeng/table';
////import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { ProductQuality } from '../../../Helper/models/ProductQuality';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ToastService } from '../../shell/services/toast.service';


@Component({
  selector: 'app-quality-label',
  templateUrl: './quality-label.component.html',
  styles: []
})
export class QualityLabelComponent implements OnInit, OnDestroy {
  AllProductQualityList: ProductQuality[] = [];
  selectedProductQuality: ProductQuality;
  public productQuality: ProductQuality;
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
  @ViewChild('btn_open_modal_add_quality') btn_open_modal_add_quality: ElementRef;

  constructor(
    private apiService: vaplongapi, 
    private toastService: ToastService,
    private cdr: ChangeDetectorRef) {

    this.productQuality = new ProductQuality();
  }

  ngOnInit(): void {
    this.GetAllProductQualityList(); // Get All Quality Label List On Page Load
  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    this.EditProductQuality(event.selectedRowData);
  }
  GetAllProductQualityList() // Get All Product Quality Method Get Data from Service 
  {
    this.IsSpinner = true;

    this.apiService.GetAllQualityLabels().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllProductQualityList = response.ProductQualities;
        this.totalRecords = response.ProductQualities.length;
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

  AddProductQuality()// Open Add New Product Quality Section
  {
    this.ResetFields();
    this.IsAdd = true;
    this.btn_open_modal_add_quality.nativeElement.click();
  }
  CloseAddSection()// Close Add New Product Quality Section
  {
    this.IsAdd = false;

    this.btn_open_modal_add_quality.nativeElement.click();
  }
  SaveUpdateProductQualityDetails() {

    if (this.productQuality.ID > 0)  // for Update
    {
      this.UpdateProductQuality();
    }
    else {
      this.SaveProductQuality(); // for save
    }


  }
  SaveProductQuality() // Save Product Quality Lable Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddQualityLabel(this.productQuality).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductQualityList();
        this.IsSpinner = false;
        this.IsAdd = false;

        this.btn_open_modal_add_quality.nativeElement.click();
      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
    },
    );
  }
  UpdateProductQuality() // Update Product Quality Method To Communicate API
  {
    this.apiService.UpdateQualityLabel(this.productQuality).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductQualityList();
        this.IsSpinner = false;
        this.IsAdd = false;

        this.btn_open_modal_add_quality.nativeElement.click();
      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
    },
    );
  }

  EditProductQuality(productQuality: ProductQuality) {
    this.productQuality = productQuality;
    this.IsAdd = true;
    this.btn_open_modal_add_quality.nativeElement.click();
  }

  UpdateProductQualityStatus(productQuality: any) // Update Product Quality Label Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = productQuality.ID;
    this.updateStatusModel.Status = !productQuality.IsActive;
    this.updateStatusModel.UpdatedByUserID = productQuality.CreatedByUserID;
    this.apiService.UpdateQualityLabelStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductQualityList();
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
    this.productQuality = new ProductQuality();
  }
}
