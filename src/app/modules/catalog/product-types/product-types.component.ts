import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
//import { Table } from 'primeng/table';
////import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { Type } from '../../../Helper/models/Type';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ToastService } from '../../shell/services/toast.service';


@Component({
  selector: 'app-product-types',
  templateUrl: './product-types.component.html',
  styles: [
  ],
})
export class ProductTypesComponent implements OnInit, OnDestroy {
  
  AllTypeList: Type[] = [];
  selectedType: Type;
  public Type: Type;
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

  constructor(private apiService: vaplongapi, private toastService: ToastService) {

    this.Type = new Type();
  }

  ngOnInit(): void {
    this.GetAllTypeList(); // Get All Classification List On Page Load

  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    this.EditType(event.selectedRowData);
  }

  GetAllTypeList() // Get All Type Method Get Data from Service
  {
    this.IsSpinner = true;

    this.apiService.GetAllTypes().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.AllTypeList = response.AllProductTypesList;
        this.totalRecords = response.AllProductTypesList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  AddType()// Open Add New Type Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()// Close Add New Type Section
  {
    this.IsAdd = false;

  }
  SaveUpdateTypeDetails() {

    if (this.Type.ID > 0)  // for Update
    {
      this.UpdateType();
    }
    else {
      this.SaveType(); // for save
    }


  }
  SaveType() // Save Code Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddType(this.Type).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllTypeList();
        this.IsSpinner = false;
        this.IsAdd = false;

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }
  UpdateType() // Update Type Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.UpdateType(this.Type).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllTypeList();
        this.IsSpinner = false;
        this.IsAdd = false;

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }

  EditType(Type: Type) {
    this.Type = Type;
    this.IsAdd = true;
  }

  UpdateTypeStatus(Type: any) // Update Type Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = Type.ID;
    this.updateStatusModel.Status = !Type.IsActive;
    this.updateStatusModel.UpdatedByUserID = Type.CreatedByUserID;
    this.apiService.UpdateTypeStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllTypeList();
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
    this.Type = new Type();
  }

}
