import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
// //import { Table } from 'primeng/table';
// import { LazyLoadEvent, MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { datefilter } from 'src/app/Helper/datefilter';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';


import { Columns } from 'src/app/shared/model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';

import { untilDestroyed } from 'src/app/shared/services/until-destroy';
// 
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
// import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { SalesPermissionEnum } from 'src/app/shared/constant/sales-permission';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ConfirmationService } from 'src/app/Service/confirmation.service';
import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

declare let require: any;
const FileSaver = require('file-saver');

@Component({
  selector: 'app-online-orders',
  templateUrl: './online-orders.component.html',
  styleUrls: ['./online-orders.component.scss'],
  providers: [DatePipe, ConfirmationService]



})
export class OnlineOrdersComponent implements OnInit, OnDestroy {

  dateModalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };

  @ViewChild('datepicker') private datepickerModalComponent: ModalComponent;

  AllOrderList: any[] = [];
  selectedOrder : any;
  SalesPermissionEnum: SalesPermissionEnum;
  SearchByDateDropdown: any[];
  selectedSearchByDateID = '';
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 10;
  // last = 25;
  totalRecords = 0;
  isCustomDate = false;
  fromDate : any = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate : any = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  items: any[];

  dateId = 6;
  filterModel = {
    PageNo: 0,
    PageSize: 10,
    Product: '',
  };

  rowGroup: RowGroup = {
    property: 'SaleDate',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  genericMenuItems: GenericMenuItems[] = [
    { label: 'View Order', icon: 'fas fa-info', dependedProperty: 'SaleID' },
    { label: 'PDF invoice', icon: 'fas fa-print', dependedProperty: 'InvoiceUrl' },
    { label: 'Packing Slip', icon: 'fas fa-download', dependedProperty: 'SlipUrl' },
  ];
  columns: Columns[] = [
    { field: 'SaleID', header: 'Invoice Nr. ', sorting: 'SaleID', placeholder: '', translateCol: 'SSGENERIC.INVOICENR' , type: TableColumnEnum.REDIRECTION_COLUMN},
    { field: 'ShopOrderID', header: 'Order ID.', sorting: 'ShopOrderID', placeholder: '', translateCol: 'SSGENERIC.ORDERID' },
    { field: 'CustomerName', header: 'Customer', sorting: 'CustomerName', placeholder: '', translateCol: 'SSGENERIC.CUSTOMER' },
    { field: 'DeliveryStatus', header: 'Status', sorting: 'DeliveryStatus', placeholder: '', translateCol: 'SSGENERIC.STATUS' },
    {
      field: 'TotalOrderAmount', header: 'Total', sorting: 'TotalOrderAmount', placeholder: '', permission:SalesPermissionEnum.TotalAmountColumn,
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.TOTAL'
    },
    { field: 'SaleDate', header: 'Date Added', sorting: 'SaleDate', placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DATEADD' },
    //  {
    //    field: 'DeliveryDate', header: 'Date Modified', sorting: 'DeliveryDate', placeholder: '',
    //    type: TableColumnEnum.DATE_FORMAT,  translateCol: 'SSGENERIC.DATEMOD'
    //  },

  ];

  globalFilterFields = ['SaleID', 'ShopOrderID', 'CustomerName', 'DeliveryStatus', 'TotalOrderAmount', 'SaleDate', 'DeliveryDate'];
  rowsPerPageOptions = [10, 20, 50, 100];
  usermodel: any;

  isLoading : boolean = true;
  initPageNo = 0;

  constructor(
    private apiService: vaplongapi, private datepipe: DatePipe, public router: Router,
    // private toastService: ToastService,
    private toastService: ToastService,
    private cdr : ChangeDetectorRef,
    private storageService: StorageService) {
      this.usermodel = this.storageService.getItem('UserModel');
      this.storageService.setItem('OnlineSaleDetailRoute', this.router.url);

      const obj = {
        Action: 'View',
        Description: `View Online Orders`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { }); 
  }

  ngOnInit(): void {
    let initPageNo = this.storageService.getItem('online_orders_page_no');
    if(initPageNo > 0) {
      this.initPageNo = initPageNo;
      this.filterModel.PageNo = this.initPageNo;
      this.storageService.removeItem('online_orders_page_no');
    }

    this.GetSearchByDateDropDownList();
    
    this.GetAllOrderDataWithLazyLoadinFunction(this.filterModel);

  }
  ngOnDestroy(): void {
  }
  emitAction(event : any) {
    if (event.forLabel === 'View Order') {
      this.storageService.setItem('online_orders_page_no', (event.curPageNo - 1));
      this.Details(event.selectedRowData);
    }
    else if (event.forLabel === 'PDF invoice') {
      this.PrintPDF(event.selectedRowData.InvoiceUrl);
    }
    else if (event.forLabel === 'Packing Slip') {
      this.PrintPackingSlip(event.selectedRowData.SlipUrl);
    }
  }
  Details(event : any) {
    this.router.navigate(['/sale/online-order-detail/' + event.SaleID]);
  }
  PrintPDF(fileURL : any) {
    const fileName = 'invoiceslip.pdf';
    FileSaver.saveAs(fileURL, fileName);

  }
  PrintPackingSlip(fileURL : any) {
    const fileName = 'pakingslip.pdf';
    FileSaver.saveAs(fileURL, fileName);

  }
  GetSearchByDateDropDownList() {

    this.SearchByDateDropdown = [];

    this.SearchByDateDropdown.push({ value: '0', label: 'Today' });
    this.SearchByDateDropdown.push({ value: '1', label: 'Yesterday' });
    this.SearchByDateDropdown.push({ value: '2', label: 'Last7Days' });
    this.SearchByDateDropdown.push({ value: '3', label: 'Last30Days' });
    this.SearchByDateDropdown.push({ value: '4', label: 'ThisMonth' });
    this.SearchByDateDropdown.push({ value: '5', label: 'LastMonth' });
    this.SearchByDateDropdown.push({ value: '6', label: 'All' });
    this.SearchByDateDropdown.push({ value: '7', label: 'Custom' });

    this.selectedSearchByDateID = '6';

  }
  SearchByDate(event: any) {

    if (event == '7') {
      this.isCustomDate = true;
      this.openDatePickerModal();
    }
    else {
      this.dateId = Number(this.selectedSearchByDateID);
      this.GetAllOrderDataWithLazyLoadinFunction(this.filterModel);
      //this.GetAllOnlineOrderByFilter(this.selectedSearchByDateID);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    //this.GetAllOnlineOrderByFilter(7);
    this.dateId = 7;
    this.datepickerModalComponent.close();
    this.GetAllOrderDataWithLazyLoadinFunction(this.filterModel);

  }
  
  GetAllOrderDataWithLazyLoadinFunction(filterRM : any) {

    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? '');
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? '');
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.IsReceived = true;
    filterRequestModel.Product = filterRM.Product;

    if (this.dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(this.dateId);
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date((this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
      filterRequestModel.FromDate = new Date((this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    }
    else {
      filterRequestModel.IsGetAll = false;
      filterRequestModel.ToDate = new Date((this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
      filterRequestModel.FromDate = new Date((this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    }
    this.apiService.GetOnlineCustomerDetailTotalCount(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.totalRecords = response.TotalRowCount;
        this.cdr.detectChanges();
      }
      else {
        // this.toastService.showErrorToast('Error', response.ResponseText);
        this.toastService.showErrorToast('Error', response.responseText);
      }
    },
    );
    this.isLoading = true;
    this.apiService.GetOnlineCustomerDetail(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      this.isLoading = false;
      if (response1.ResponseCode === 0) {
        this.AllOrderList = response1.OnlineCustomerDetails;
        this.cdr.detectChanges();
      }
      else {
        // this.notificationService.notify(NotificationEnum.ERROR, 'Error', response1.responseText);
        this.toastService.showErrorToast('Error', response1.responseText);
      }
    },
    );
  }
  GetAllOnlineOrderByFilter(dateId : any) {

    const request = new FilterRequestModel();
    request.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? '');
    request.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? '');
    request.PageNo = 0,
    request.PageSize = 10000;
    
    dateId=Number(dateId);
    if (dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(dateId);
      request.IsGetAll = daterequest.IsGetAll;
      request.ToDate = new Date((this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
      request.FromDate = new Date((this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    }
    else {
      request.IsGetAll = false;
      request.ToDate = new Date(this.toDate);
      request.FromDate = new Date(this.fromDate);
    }


    this.apiService.GetOnlineCustomerDetail(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.AllOrderList = response.OnlineCustomerDetails;
        this.totalRecords = response.OnlineCustomerDetails.length;
      } else {
        // this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
        this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
      }
    });

  }
  
  async openDatePickerModal() {
    return await this.datepickerModalComponent.open();
  }
}
