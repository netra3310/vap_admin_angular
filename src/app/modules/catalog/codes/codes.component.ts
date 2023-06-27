import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
// //import { Table } from 'primeng/table';
// //import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { Size } from '../../../Helper/models/Size';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
// 
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ToastService } from '../../shell/services/toast.service';
// import { ToastService } from '../../shell/services/toast.service';

@Component({
  selector: 'app-codes',
  templateUrl: './codes.component.html',
  styles: [
  ],
})
export class CodesComponent implements OnInit, OnDestroy {
  AllCodeList: Size[] = [];
  selectedCode: Size;
  public code: Size;
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
  globalFilterFields = ['Name','Description'];
  rowsPerPageOptions = [10, 20, 50, 100];

  @ViewChild('btn_open_modal_add_code') btn_open_modal_add_code: ElementRef;

  constructor(private apiService: vaplongapi, 
    // private toastService: ToastService
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {

    this.code = new Size();
  }

  ngOnInit(): void {
    this.GetAllCodeList(); // Get All Code List On Page Load
  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    this.EditCode(event.selectedRowData);
  }

  GetAllCodeList() // Get All Code Method Get Data from Service 
  {
    this.IsSpinner = true;

    this.apiService.GetAllCodes().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.AllCodeList = response.AllSizesList;
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

  AddCode()// Open Add New Code Section
  {
    this.ResetFields();
    this.IsAdd = true;
    this.btn_open_modal_add_code.nativeElement.click();
  }
  CloseAddSection()// Close Add New Code Section
  {
    this.IsAdd = false;
    this.btn_open_modal_add_code.nativeElement.click();

  }
  SaveUpdateCodeDetails() {

    if (this.code.ID > 0)  // for Update
    {
      this.UpdateCode();
    }
    else {
      this.SaveCode(); // for save
    }


  }
  SaveCode() // Save Code Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddColor(this.code).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllCodeList();
        this.IsSpinner = false;
        this.IsAdd = false;
        this.btn_open_modal_add_code.nativeElement.click();

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
    },
    );
  }
  UpdateCode() // Update Code Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.UpdateColor(this.code).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllCodeList();
        this.IsSpinner = false;
        this.IsAdd = false;

        this.btn_open_modal_add_code.nativeElement.click();
      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
    },
    );
  }

  EditCode(code: Size) {
    this.code = code;
    this.IsAdd = true;
    this.btn_open_modal_add_code.nativeElement.click();
  }

  UpdateCodeStatus(code: any) // Update Code Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = code.ID;
    this.updateStatusModel.Status = !code.IsActive;
    this.updateStatusModel.UpdatedByUserID = code.CreatedByUserID;
    this.apiService.UpdateCodeStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllCodeList();
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
    this.code = new Size();
  }

}
