import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
//import { Table } from 'primeng/table';
////import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { Level } from '../../../Helper/models/Level';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';

import { DatePipe } from '@angular/common';

import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ToastService } from '../../shell/services/toast.service';
import { CatalogPermissionEnum } from 'src/app/shared/constant/catalog-permission';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { StorageService } from 'src/app/shared/services/storage.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';


@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  providers: [DatePipe]

})
export class LevelsComponent implements OnInit, OnDestroy {
  CatalogPermission = CatalogPermissionEnum;

  
  AllLevelList: Level[] = [];
  selectedLevel: Level;
  level: Level;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  QRDetails:any;
  imageBasePath = "";
  valCheck = '';
  prodcutSearch = '';
  selectedWarehouseID :any;
  selectedZoneID :any;
  selectedSectionID:any;

  items: any[];
  WarehouseDropdown: any[];
  ZoneDropdown: any[];
  SectionDropdown: any[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 10;
  alwaysShowPaginator = true;
  // last = 10;
  totalRecords = 0;

  filterModel = {
    PageNo: 0,
    PageSize: 10,
    Product: '',
  };

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID', permission: CatalogPermissionEnum.UpdateLevel }
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'WareHouse', header: 'WareHouse', sorting: 'WareHouse', placeholder: '', translateCol: 'SSGENERIC.WAREHOUSE' },
    { field: 'Zone', header: 'Zone', sorting: 'Zone', placeholder: '', translateCol: 'SSGENERIC.ZONE' },
    { field: 'Section', header: 'Section', sorting: 'Section', placeholder: '', translateCol: 'SSGENERIC.SECTION' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },

  ];
  initialColumns = ['IsActive', 'Name', 'WareHouse', 'Zone', 'Section', 'Description']
  globalFilterFields = ['Name', 'WareHouse', 'Zone', 'Section', 'Description'];
  rowsPerPageOptions = [10, 20, 50, 100];
  usermodel: UserModel;

  @ViewChild('btn_open_modal_add_level') btn_open_modal_add_level: ElementRef;

  constructor(
    private apiService: vaplongapi, private datepipe: DatePipe,
    private storageService: StorageService, private toastService: ToastService,
    private cdr: ChangeDetectorRef) {
    this.level = new Level();
    this.imageBasePath = this.apiService.imageBasePath;

  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    // this.GetAllLevelList();
    this.GetWarehouseList(0,0,0);
    this.GetAllLevelDataWithLazyLoadinFunction(this.filterModel);     
  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    this.EditLevel(event.selectedRowData);
  }
  GetAllLevelDataWithLazyLoadinFunction(filterRM: any) {

    const filterRequestModel = new FilterRequestModel();
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.Product = filterRM.Product;
    this.IsSpinner = true;
    this.apiService.GetAllLevelTotalCount(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.totalRecords = response.TotalRowCount;
      }
      else {
      }
      this.cdr.detectChanges();
    },
    );
    this.apiService.GetAllLevelPagination(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      this.IsSpinner = false;
      if (response1.ResponseCode === 0) {
        this.AllLevelList = response1.AllLevelList;
        console.log("all level lists is ", this.AllLevelList);
      }
      else {
        console.log('internal serve error ! not getting api data');
      }
      this.cdr.detectChanges();
    },
    );

  }
  GetAllLevelList() // Get All Level Method Get Data from Service
  {
    
    this.apiService.GetAllLevel().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllLevelList = response.AllLevelList;
        this.totalRecords = response.AllLevelList.length;
        

      }
      else {
        
        console.log('internal server error ! not getting api data');
      }
      this.cdr.detectChanges();
    },
    );

  }

  GetWarehouseList(WareHouseId: any, ZoneId: any, SectionId: any) {
    this.WarehouseDropdown = [];
    this.apiService.GetWarehouseDropDownData().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        for (const item of response.DropDownData) {
          this.WarehouseDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        if (this.WarehouseDropdown.length > 0) {
          this.selectedWarehouseID=undefined;
          if(WareHouseId!=0)
          {
            this.selectedWarehouseID = WareHouseId;
          }
          else{
            this.selectedWarehouseID = response.DropDownData[0].ID;
          }
         this.GetZoneList(this.selectedWarehouseID,ZoneId,SectionId);
        }

      }
      else {
        console.log('internal serve Error', response);
      }
      this.cdr.detectChanges();

    }
    );
  }

  GenerateQRCode() {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = this.level.ID;
    this.updateStatusModel.Status = this.level.IsActive ?? false;
    this.updateStatusModel.UpdatedByUserID = this.usermodel.ID;
    this.apiService.GenerateLevelQRCode(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.EditLevel(response.Level);
        this.IsSpinner = false;

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

  GetZoneList(wareHouseId: any, ZoneId: any, SectionId: any) {
    this.ZoneDropdown = [];

    const id = {
      ID: wareHouseId
    };
    this.IsSpinner = true;
    this.apiService.GetZonesByWarehouseIDForDropdown(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseText === 'success') {

        for (const item of response.DropDownData) {
          this.ZoneDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }

        if (this.ZoneDropdown.length > 0) {
          if(ZoneId!=0)
          {
            this.selectedZoneID = ZoneId;
          }
          else{
            this.selectedZoneID = response.DropDownData[0].ID;
          }
          this.GetSecionsList(this.selectedZoneID,SectionId);
        }

      }
      else {
        console.log('internal serve Error', response);
      }
      this.cdr.detectChanges();

    }
    );
  }



  GetSecionsList(ZoneId: any,SectionId: any) {
    this.SectionDropdown = [];

    const id = {
      ID: ZoneId
    };
    this.IsSpinner = true;
    this.apiService.GetSectionsByZoneIDForDropdown(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseText === 'success') {

        for (const item of response.DropDownData) {
          this.SectionDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }

        if (this.SectionDropdown.length > 0) {
          if(SectionId!=0)
          {
            this.selectedSectionID = SectionId;
          }
          else{
            this.selectedSectionID = response.DropDownData[0].ID;
          }
        }

      }
      else {
        console.log('internal serve Error', response);
      }

      this.cdr.detectChanges();
    }
    );
  }


  AddLevel() // Open Add New Level Section
  {
    this.ResetFields();
    this.IsAdd = true;
    this.btn_open_modal_add_level.nativeElement.click();
  }
  CloseAddSection() // Close Add New Level Section
  {
    this.IsAdd = false;
    this.btn_open_modal_add_level.nativeElement.click();

  }

  SaveUpdateLevelDetails() {
    if (this.level.ID > 0) {
      this.UpdateLevel();
    }
    else {
      this.SaveLevel();
    }
  }

  SaveLevel() // Save Level Method To Communicate API
  {
    
    this.level = new Level();
    this.level.WareHouseID = Number(this.selectedWarehouseID);
    this.level.ZoneID = Number(this.selectedZoneID);
    this.level.SectionID = Number(this.selectedSectionID);
    this.level.CreatedByUserID = this.usermodel.ID;
    
    this.apiService.AddLevel(this.level).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        //this.GetAllLevelList();
        this.PrintQRCode();
        this.GetAllLevelDataWithLazyLoadinFunction(this.filterModel);     
        this.IsAdd = false;
        this.btn_open_modal_add_level.nativeElement.click();

      }
      else {
        
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
    },
    );
  }

  EditLevel(level: Level) {
    this.level = level;
    this.QRDetails = {"ID":this.level.ID, "Name":this.level.Location, "QRCode":this.level.QRCode};

    if(this.selectedWarehouseID !== this.level.WareHouseID)
    {
      this.GetWarehouseList(this.level.WareHouseID,this.level.ZoneID,this.level.SectionID);
    }
    else if(this.selectedZoneID !== this.level.ZoneID){
      this.GetZoneList(this.level.WareHouseID,this.level.ZoneID,this.level.SectionID);
    }
    else if(this.selectedSectionID !== this.level.SectionID){
      this.GetSecionsList(this.level.ZoneID,this.level.SectionID);
    }
    
    this.IsAdd = true;
    this.cdr.detectChanges();
    this.btn_open_modal_add_level.nativeElement.click();
  }

  UpdateLevel() // Update Level Method To Communicate API
  {

    
    this.level.WareHouseID = Number(this.selectedWarehouseID);
    this.level.ZoneID = Number(this.selectedZoneID);
    this.level.SectionID = Number(this.selectedSectionID);
    this.level.CreatedByUserID = this.usermodel.ID;
    this.apiService.UpdateLevel(this.level).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        //this.GetAllLevelList();
        this.GetAllLevelDataWithLazyLoadinFunction(this.filterModel);

        this.IsAdd = false;
        
        this.btn_open_modal_add_level.nativeElement.click();

      }
      else {
        
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
    },
    );
  }

  UpdateLevelStatus(level: any) // Update Level Status Method To Communicate API
  {
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = level.ID;
    this.updateStatusModel.Status = !level.IsActive;
    this.updateStatusModel.UpdatedByUserID = this.usermodel.ID;
    this.IsSpinner = true;
    this.apiService.UpdateLevelStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        //this.GetAllLevelList();
        this.GetAllLevelDataWithLazyLoadinFunction(this.filterModel);
      }
      else {
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
    },
    );
  }

  BindZones(event: any)// Bind zone by warehouseid
  {
    this.GetZoneList(event.value,0,0);
  }

  BindSection(event: any)// Bind Section by zoneid
  {
    this.GetSecionsList(event.value,0);
  }
  ResetFields() // Reset Object
  {
    this.level = new Level();
  }

  PrintQRCode() {
     setTimeout(() => {
      
       let printContents;
       let popupWin;
 
       printContents = document.getElementById('printA4-qr-print')?.innerHTML ?? "";
       popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
       if(popupWin){
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>Report</title>
              <style>
              //........Customized style.......
              .sty{
                'width: 67%;color: #000; float: left;text-align: left; margin: 0;font-size: 12px; font-weight: 600;padding-right: 10px;
              }
              </style>
            </head>
            <body onload='window.print();self.close();'>${printContents}</body>
          </html>`);
        // popupWin.document.close();
      }
    }, 500);
 
  }
}