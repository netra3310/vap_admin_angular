import { vaplongapi } from './../../../Service/vaplongapi.service';
import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
// //import { Table } from 'primeng/table';
// import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { datefilter } from '../../../Helper/datefilter';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { FilterRequestModel } from '../../../Helper/models/FilterRequestModel';
import { ToastService } from 'src/app/modules/shell/services/toast.service';

import { Columns } from 'src/app/shared/model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { Router } from '@angular/router';
import { PurchasePermissionEnum } from 'src/app/shared/constant/purchase-permission';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: 'app-back-order-report',
  templateUrl: './back-order-report.component.html',
  styleUrls: ['./back-order-report.component.scss'],
  providers: [DatePipe]
})
export class BackOrderReportComponent implements OnInit, OnDestroy {
  dateModalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };

  @ViewChild('datepicker') private datepickerModalComponent: ModalComponent;

  AllPurchaselist: any[] = [];
  PurchasePermission = PurchasePermissionEnum;
  selectedPurchase : any;
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
  items: any[];
  cols: any[];
  exportColumns: any[];
  displayPurchasePopup = false;

  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  dateId = 6;
  filterModel = {
    PageNo: 0,
    PageSize: 10,
    Product: '',
  };

  genericMenuItems: GenericMenuItems[] = [
    { label: 'View Detail', icon: 'fas fa-info', dependedProperty: 'ID' },
    { label: 'Order Receiving', icon: 'fas fa-undo', dependedProperty: 'ID' }

  ];

  rowGroup: RowGroup = {
    property: 'PurchaseDate',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };

  columns: Columns[] = [

    { field: 'ID', header: 'Order No', sorting: 'ID', placeholder: '', type: TableColumnEnum.REDIRECTION_COLUMN, translateCol: 'SSGENERIC.ORDERNO' },
    { field: 'SuppierInvoiceNo', header: 'Supplier Invoice No', sorting: 'SuppierInvoiceNo', placeholder: '', translateCol: 'SSGENERIC.SUPPLIERINVOICE' },
    { field: 'Supplier', header: 'Supplier', sorting: 'Supplier', placeholder: '', translateCol: 'SSGENERIC.SUPPLIER' },
    {
      field: 'dTotalPurchaseValue', header: 'Purchase Price', sorting: 'dTotalPurchaseValue', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.PURCHASEPRICE'
    },
    {
      field: 'dTotalPaidValue', header: 'Paid Amount', sorting: 'dTotalPaidValue', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.PAIDAMOUNT'
    },
    { field: 'PurchaseDate', header: 'Date', sorting: 'PurchaseDate', placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DATE' },

  ];

  initialColumns : any = ['ID', 'SuppierInvoiceNo', 'Supplier', 'dTotalPurchaseValue', 'dTotalPaidValue']
  isLoading : boolean = true;

  globalFilterFields = ['ID', 'SuppierInvoiceNo', 'Suppier', 'dTotalPurchaseValue', 'dTotalPaidValue', 'PurchaseDate'];
  rowsPerPageOptions = [10, 20, 50, 100];
  usermodel: any;

  initPageNo = 0;

  constructor(
    private apiService: vaplongapi, private datepipe: DatePipe, public router: Router,
    private toastService : ToastService, 
    private storageService: StorageService, private cdr : ChangeDetectorRef) {
      this.usermodel = this.storageService.getItem('UserModel');

      const obj = {
        Action: 'View',
        Description: `View Back Orders`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { this.isLoading = false });
  }

  ngOnInit(): void {
    let initPageNo = this.storageService.getItem('back_order_report_page_no');
    if(initPageNo > 0) {
      this.initPageNo = initPageNo
      this.filterModel.PageNo = this.initPageNo;
    }
    this.storageService.removeItem('back_order_report_page_no');
    this.GetSearchByDateDropDownList();
    // this.getAllPurchaseList(6);

    this.cols = [
      { field: 'ID', header: 'ID' },
      { field: 'SuppierInvoiceNo', header: 'Supplier Invoice No' },
      { field: 'Supplier', header: 'Supplier' },
      { field: 'dTotalPurchaseValue', header: 'Purchase Price' },
      { field: 'dTotalPaidValue', header: 'Paid Amount' },
      { field: 'PurchaseDate', header: 'Purchase Date' },

    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    this.GetAllPurchaseDataWithLazyLoadinFunction(this.filterModel);
  }
  ngOnDestroy(): void {
  }
  emitAction(event : any) {
    this.storageService.setItem('back_order_report_page_no', (event.curPageNo - 1));
    if (event.forLabel === 'View Detail') {
      this.Details(event.selectedRowData);
    }
    else if (event.forLabel === 'Order Receiving') {
      this.OrderReceiving(event.selectedRowData.ID);
    }
  }
  Details(event : any) {
    this.router.navigate([`/purchase/backorder-details/${event.ID}`]);
  }
  OrderReceiving(id : any) {
    const param = {
      ID: id,
      RequestedUserID: this.usermodel.ID,
    };
    this.apiService.UpdatePurchaseOrderStatusToPurchase(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.dateId = 6;
        this.GetAllPurchaseDataWithLazyLoadinFunction(this.filterModel);
      }
      else {
        this.toastService.showErrorToast('error', response.ResponseText);
        
      }
    },
    );
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
      // this.getAllPurchaseList(this.selectedSearchByDateID);
      this.dateId = Number(this.selectedSearchByDateID);
      this.GetAllPurchaseDataWithLazyLoadinFunction(this.filterModel);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.dateId = 7;
    this.datepickerModalComponent.close();
    this.GetAllPurchaseDataWithLazyLoadinFunction(this.filterModel);
  }

  
  async openDatePickerModal() {
    return await this.datepickerModalComponent.open();
  }

  GetAllPurchaseDataWithLazyLoadinFunction(filterRM : any) {

    const filterRequestModel = new FilterRequestModel();
    const tmpInitPageNo = this.storageService.getItem('back_order_report_page_no');

    filterRequestModel.FromDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.ToDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.SubCategoryID = 0;
    if(tmpInitPageNo > 0) {
      filterRequestModel.PageNo = tmpInitPageNo;
      this.storageService.removeItem('back_order_report_page_no');
    } else {
      filterRequestModel.PageNo = filterRM.PageNo;
    }
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.IsReceived = false;

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
    this.IsSpinner = true;

    this.isLoading = true;

    this.apiService.GetAllByFiltersTotalCount(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoading = false;
      if (response.ResponseCode === 0) {
        this.totalRecords = response.TotalRowCount;
      }
      else {
        this.toastService.showErrorToast('error', response.ResponseText);
        
        // console.log('internal server error ! not getting api data');
      }
      this.cdr.detectChanges();
    },
    );
    this.isLoading = true;
    this.apiService.GetAllPurchaseByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      this.isLoading = false;
      if (response1.ResponseCode === 0) {
        
        this.AllPurchaselist = response1.AllPurchaseList;
        console.log("this.AllPurchaselist is ", this.AllPurchaselist);
        this.cdr.detectChanges();
      }
      else {
        this.toastService.showErrorToast('Error', response1.responseText);
        // console.log('internal server error ! not getting api data');
      }
    },
    );
  }
  // getAllPurchaseList(dateId) {
  //   this.IsSpinner = true;

  //   let filterRequestModel = new FilterRequestModel();
  //   filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
  //   filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
  //   filterRequestModel.SubCategoryID=0;
  //   filterRequestModel.PageNo= 0;
  //   filterRequestModel.PageSize=10000;
  //   filterRequestModel.IsGetAll=false;
  //   filterRequestModel.IsReceived=false;

  //   if (dateId !== 7) {
  //     let daterequest = datefilter.GetDateRangeByDropdown(dateId);
  //     filterRequestModel.IsGetAll = daterequest.IsGetAll;
  //     filterRequestModel.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss'));
  //     filterRequestModel.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss'));
  //   }
  //   else {
  //     filterRequestModel.IsGetAll = false;
  //     filterRequestModel.ToDate = new Date(this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss'));
  //     filterRequestModel.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss'));
  //   }
  //   this.apiService.GetAllBackOrderByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
  //     if (response.ResponseCode === 0) {

  //       this.AllPurchaselist = response.AllPurchaseList;
  //       this.totalRecords = response.AllPurchaseList.length;

  //     }
  //     else {
  //       console.log('internal server error ! not getting api data');
  //     }
  //   },
  //   );
  // }
  onChangeDate(event: any) {
    // this.getAllPurchaseList(event.value);
    this.dateId = Number(event.value);
    this.GetAllPurchaseDataWithLazyLoadinFunction(this.filterModel);
  }
  AddBackOrder() {
    this.router.navigate(['/purchase/add-back-order']);
  }

  exportPdf() {

    const doc = new jsPDF();
    autoTable(doc, {
      head: this.exportColumns,
      body: this.AllPurchaselist
    });
    doc.save('SupplierInvoice.pdf');
    // import('jspdf').then(jsPDF => {
    //     import('jspdf-autotable').then((x: any) => {
    //         const doc = new jsPDF.default('p', 'pt');
    //         doc.autoTable(this.exportColumns, this.AllInvoicelist);
    //         doc.save('products.pdf');
    //     })
    // })
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.AllPurchaselist);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'SupplierInvoice');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      const EXCELTYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCELEXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCELTYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCELEXTENSION);
    });
  }

}
