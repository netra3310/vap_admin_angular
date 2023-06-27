import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
// //import { Table } from 'primeng/table';
// //import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { Color } from '../../../Helper/models/Color';
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
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styles: [
  ],
})
export class ColorsComponent implements OnInit, OnDestroy {
  // 
  AllColorList: Color[] = [];
  selectedColor: Color;
  public color: Color;
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

  @ViewChild('btn_open_modal_add_color') btn_open_modal_add_color: ElementRef;

  constructor(private apiService: vaplongapi, 
    // private toastService: ToastService
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {

    this.color = new Color();
  }

  ngOnInit(): void {
    this.GetAllColorList(); // Get All Classification List On Page Load

  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    this.EditColor(event.selectedRowData);
  }

  GetAllColorList() // Get All Color Method Get Data from Service
  {
    this.IsSpinner = true;

    this.apiService.GetAllColors().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.AllColorList = response.AllColorsList;
        this.totalRecords = response.AllColorsList.length;
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

  AddColor()// Open Add New Color Section
  {
    this.ResetFields();
    this.IsAdd = true;
    this.btn_open_modal_add_color.nativeElement.click();
  }
  CloseAddSection()// Close Add New Color Section
  {
    this.IsAdd = false;
    this.btn_open_modal_add_color.nativeElement.click();

  }
  SaveUpdateColorDetails() {

    if (this.color.ID > 0)  // for Update
    {
      this.UpdateColor();
    }
    else {
      this.SaveColor(); // for save
    }


  }
  SaveColor() // Save Code Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddColor(this.color).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllColorList();
        this.IsSpinner = false;
        this.IsAdd = false;
        this.btn_open_modal_add_color.nativeElement.click();

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }
  UpdateColor() // Update Color Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.UpdateColor(this.color).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllColorList();
        this.IsSpinner = false;
        this.IsAdd = false;
        this.btn_open_modal_add_color.nativeElement.click();

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }

  EditColor(color: Color) {
    this.color = color;
    this.IsAdd = true;
    this.btn_open_modal_add_color.nativeElement.click();
  }

  UpdateColorStatus(color: any) // Update Color Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = color.ID;
    this.updateStatusModel.Status = color.IsActive;
    this.updateStatusModel.UpdatedByUserID = color.CreatedByUserID;
    this.apiService.UpdateColorStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllColorList();
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
    this.color = new Color();
  }

}
