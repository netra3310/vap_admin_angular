import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
// //import { Table } from 'primeng/table';
// //import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';


import { Columns } from 'src/app/shared/model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { StorageService } from 'src/app/shared/services/storage.service';
import { DatePipe } from '@angular/common';
import { datefilter } from 'src/app/Helper/datefilter';
import { WishlistModel } from 'src/app/Helper/models/WishlistModel';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

type Tabs = 'all' | 'online' | 'software';

@Component({
  selector: 'app-sale-stats-detail',
  templateUrl: './sale-stats-detail.component.html',
  styleUrls: ['./sale-stats-detail.component.scss'],
  providers: [DatePipe],

})

export class SaleStatsDetailComponent implements OnInit, OnDestroy {
  dateModalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };

  @ViewChild('datepicker') private datepickerModalComponent: ModalComponent;
  // 
  AllSaleStatList: WishlistModel[]=[];
  selectedSaleStat: WishlistModel;
  public SaleStat: WishlistModel;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedProductID = '';
  Quantity : any;
  Remarks : any;
  selectedFilter = 1;
  items: any[];
  ProductDropdown: any[];
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 25;
  // last = 25;
  totalRecords = 0;
  Type = 1;
  usermodel: UserModel;
  displayDialog = false;
  DialogRemarks = '';
  dateId = 0;
  isCustomDate = false;

  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  SearchByDateDropdown: any[];
  selectedSearchByDateID : any = '';
  genericMenuItems: GenericMenuItems[] = [
   
  ];

  rowGroup: RowGroup = {
    property: 'SaleDate',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.STRING
  };
  columns: Columns[] = [
    { field: 'SaleDate', header: 'Date', sorting: 'SaleDate', placeholder: '', translateCol: 'SSGENERIC.DATE',type: TableColumnEnum.DATE_ONLY },
    { field: 'TotalSaleIncludedTax', header: 'Sales(Inc Tax)', sorting: 'TotalSaleIncludedTax', placeholder: '', translateCol: 'SALESTATS.SALES_INC_TAX' ,type: TableColumnEnum.CURRENCY_SYMBOL},
    { field: 'TotalSaleExcludedTax', header: 'Sales(Ex Tax)', sorting: 'TotalSaleExcludedTax', placeholder: '' , translateCol: 'SALESTATS.SALES_EX_TAX',type: TableColumnEnum.CURRENCY_SYMBOL},
    { field: 'TotalRefunds', header: 'Refunds', sorting: 'TotalRefunds', placeholder: '', translateCol: 'SALESTATS.REFUND',type: TableColumnEnum.CURRENCY_SYMBOL },
    { field: 'COGS_Refund', header: 'Refunds(COGS)', sorting: 'COGS_Refund', placeholder: '', translateCol: 'SALESTATS.REFUND_COGS',type: TableColumnEnum.CURRENCY_SYMBOL },
    { field: 'TotalTax_Sale', header: 'Sales(Tax)', sorting: 'TotalTax_Sale', placeholder: '' , translateCol: 'SALESTATS.SALES_TAX',type: TableColumnEnum.CURRENCY_SYMBOL},
    { field: 'TotalTax_Refund', header: 'Refund', sorting: 'TotalTax_Refund', placeholder: '',  translateCol: 'SALESTATS.REFUND_TAX',type: TableColumnEnum.CURRENCY_SYMBOL },
    { field: 'COGS', header: 'COGS', sorting: 'COGS', placeholder: '',  translateCol: 'SALESTATS.COGS',type: TableColumnEnum.CURRENCY_SYMBOL },
    { field: 'GrossProfit', header: 'GrossProfit', sorting: 'GrossProfit', placeholder: '',  translateCol: 'SALESTATS.GROSSPROFIT',type: TableColumnEnum.CURRENCY_SYMBOL },

  ];

  initialColumns : any = [
    'SaleDate', 'TotalSaleIncludedTax', 'TotalSaleExcludedTax', 
    'TotalRefunds', 'COGS_Refund', 'TotalTax_Sale', 'TotalTax_Refund',
    'COGS', 'GrossProfit'
  ]
  isLoadingData : boolean = true;
  globalFilterFields = ['SaleDate', 'TotalSaleIncludedTax','COGS', 'GrossProfit','TotalSaleExcludedTax', 'TotalRefunds', 'COGS_Refund', 'TotalTax_Sale', 'TotalTax_Refund'];
  rowsPerPageOptions = [10, 20, 50, 100];

  activeTab: Tabs = 'all';

  constructor(private apiService: vaplongapi, private storageService: StorageService,
      private datepipe: DatePipe, private cdr : ChangeDetectorRef) {
    this.usermodel = this.storageService.getItem('UserModel');

    const obj = {
      Action: 'View',
      Description: `View Sale Stats Report`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { });
    this.selectedSearchByDateID = 0;
  }

  ngOnInit(): void {
    this.GetSearchByDateDropDownList();
    this.GetAllSaleStatsReport(this.dateId,this.Type); // Get All Internal Order List On Page Load
  }
  ngOnDestroy(): void {

  }

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
    switch(tab) {
      case 'all' :
        this.selectedFilter = 1;
        break;
      case 'online' :
        this.selectedFilter = 2;
        break;
      case 'software' :
        this.selectedFilter = 3;
        break;
    }
    this.filterReport(); 
  }
  
  GetSearchByDateDropDownList() {

    this.SearchByDateDropdown = [];

    this.SearchByDateDropdown.push({ value: '0', label: 'Today' });
    this.SearchByDateDropdown.push({ value: '1', label: 'Yesterday' });
    this.SearchByDateDropdown.push({ value: '2', label: 'Last7Days' });
    this.SearchByDateDropdown.push({ value: '3', label: 'Last30Days' });
    this.SearchByDateDropdown.push({ value: '4', label: 'ThisMonth' });
    this.SearchByDateDropdown.push({ value: '5', label: 'LastMonth' });
    this.SearchByDateDropdown.push({ value: '7', label: 'Custom' });
    this.selectedSearchByDateID = '0';

  }
  SearchByDate(event: any) {
    if (event == '7') {
      this.isCustomDate = true;
      this.openDatePickerModal();
    }
    else {
      this.dateId = Number(this.selectedSearchByDateID);
      this.GetAllSaleStatsReport(this.selectedSearchByDateID,this.Type);
    }
  }
 
  onChangeDate(event: any) {
    if (event == '7') {
      this.isCustomDate = true;
      this.openDatePickerModal();
    }
    else {
      this.dateId = Number(event.value);
    this.GetAllSaleStatsReport(event.value,this.Type);
    }
  }
  
  async openDatePickerModal() {
    return await this.datepickerModalComponent.open();
  }

  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.dateId = 7;
    this.datepickerModalComponent.close();
    this.GetAllSaleStatsReport(7,this.Type);
  }
  GetAllSaleStatsReport(dateId : any, Type: any) // Get All Internal Method Get Data from Service
  {
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.ToDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.PageNo = 0;
    filterRequestModel.PageSize = 1000000;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.PermissionLevel = 1;
    filterRequestModel.Type = Type;
   
    dateId=Number(dateId);
    if (dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(dateId);
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date((this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
      filterRequestModel.FromDate = new Date((this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    }
    else {
      
      filterRequestModel.IsGetAll = false;
      filterRequestModel.ToDate = new Date((this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
      filterRequestModel.FromDate = new Date((this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    }
    this.isLoadingData = true;
    
    this.apiService.GetSaleDashboardReportNewByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      
      this.isLoadingData = false;
      if (response.ResponseCode === 0) {
        this.AllSaleStatList = response.SaleStats; 
        this.totalRecords = this.AllSaleStatList.length;
        console.log("all sale stats data is ", this.AllSaleStatList);
        this.cdr.detectChanges();
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    });
  }
  

  filterReport() {
    if (Number(this.selectedFilter) === 1) {
      this.Type = 1;
      this.GetAllSaleStatsReport(this.dateId,this.Type);
    }
    else if (Number(this.selectedFilter) === 2) {
      this.Type = 2;
      this.GetAllSaleStatsReport(this.dateId,this.Type);
    }
    else {
      this.Type = 3;
      this.GetAllSaleStatsReport(this.dateId,this.Type);
    }
  }

  
}


