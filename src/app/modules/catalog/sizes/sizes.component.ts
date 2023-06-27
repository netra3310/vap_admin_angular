import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
//import { Table } from 'primeng/table';
////import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { Size } from '../../../Helper/models/Size';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ToastService } from '../../shell/services/toast.service';


@Component({
  selector: 'app-sizes',
  templateUrl: './sizes.component.html',
  styles: [
  ],
})
export class SizesComponent implements OnInit, OnDestroy {
  
  AllSizeList: Size[] = [];
  selectedSize: Size;
  public size: Size;
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

  @ViewChild('btn_open_modal_add_size') btn_open_modal_add_size: ElementRef;

  constructor(private apiService: vaplongapi, private toastService: ToastService,
    private cdr: ChangeDetectorRef) {

    this.size = new Size();
  }

  ngOnInit(): void {
    this.GetAllSizeList(); // Get All Classification List On Page Load

  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    this.EditSize(event.selectedRowData);
  }

  GetAllSizeList() // Get All Size Method Get Data from Service
  {
    this.IsSpinner = true;

    this.apiService.GetAllSizes().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.AllSizeList = response.AllSizesList;
        this.totalRecords = response.AllSizesList.length;
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

  AddSize()// Open Add New Size Section
  {
    this.ResetFields();
    this.IsAdd = true;
    this.btn_open_modal_add_size.nativeElement.click();
  }
  CloseAddSection()// Close Add New Size Section
  {
    this.IsAdd = false;
    this.btn_open_modal_add_size.nativeElement.click();

  }
  SaveUpdateSizeDetails() {

    if (this.size.ID > 0)  // for Update
    {
      this.UpdateSize();
    }
    else {
      this.SaveSize(); // for save
    }


  }
  SaveSize() // Save Code Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddSize(this.size).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllSizeList();
        this.IsSpinner = false;
        this.IsAdd = false;
        this.btn_open_modal_add_size.nativeElement.click();

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }
  UpdateSize() // Update Size Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.UpdateSize(this.size).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllSizeList();
        this.IsSpinner = false;
        this.IsAdd = false;
        this.btn_open_modal_add_size.nativeElement.click();

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }

  EditSize(size: Size) {
    this.size = size;
    this.IsAdd = true;
    this.btn_open_modal_add_size.nativeElement.click();
  }

  UpdateSizeStatus(size: any) // Update Size Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = size.ID;
    this.updateStatusModel.Status = !size.IsActive;
    this.updateStatusModel.UpdatedByUserID = size.CreatedByUserID;
    this.apiService.UpdateSizeStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllSizeList();
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
    this.size = new Size();
  }

}
