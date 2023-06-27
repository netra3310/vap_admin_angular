import { vaplongapi } from '../../../Service/vaplongapi.service';
import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { datefilter } from '../../../Helper/datefilter';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { FilterRequestModel } from '../../../Helper/models/FilterRequestModel';

import { Columns } from 'src/app/shared/model/columns.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PurchasePermissionEnum } from 'src/app/shared/constant/purchase-permission';
import { TranslateService } from '@ngx-translate/core';
import { PermissionService } from 'src/app/shared/services/permission.service';

import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ConfirmationService } from 'src/app/Service/confirmation.service';
import { ToastService } from '../../shell/services/toast.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: 'app-purchase-customized-order-report',
  templateUrl: './purchase-order-customized-report.component.html',
  styleUrls: ['./purchase-order-customized-report.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class PurchaseOrderCustomizedReportComponent implements OnInit, OnDestroy {

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
  selectedPurchase: any;
  SearchByDateDropdown: any[];
  selectedSearchByDateID = '';
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 10;
  // last = 10;
  totalRecords = 0;
  items: any[];
  cols: any[];
  exportColumns: any[];
  displayPurchasePopup = false;
  printData = false;
  dateForDD: any;
  isCustomDate = false;
  dateId = 6;
  filterModel = {
    PageNo: 0,
    PageSize: 10,
    Product: '',
  };

  rowGroup: RowGroup = {
    property: 'CreatedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };

  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z";
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z";


  genericMenuItems: GenericMenuItems[] = [
    { label: 'View Detail', icon: 'fas fa-info', dependedProperty: 'ID' },
    // {
    //   label: 'Refund', icon: 'fas fa-undo', dependedProperty: 'ID',
    //   permission: PurchasePermissionEnum.PurchaseRefund, permissionDisplayProperty: 'showRefund'
    // }

  ];
  columns: Columns[] = [

    {
      field: 'ID', header: 'Order No', sorting: 'ID', searching: true, placeholder: '',
      type: TableColumnEnum.REDIRECTION_COLUMN, translateCol: 'SSGENERIC.ORDERNO'
    },
    {
      field: 'SuppierInvoiceNo', header: 'Supplier Invoice No', sorting: 'SuppierInvoiceNo',
      searching: true, placeholder: '', translateCol: 'SSGENERIC.SUPPLIERINVOICE'
    },
    // { field: 'Supplier', header: 'Supplier', sorting: 'Supplier', searching: true, placeholder: '', translateCol: 'SSGENERIC.SUPPLIER' },
    // {
    //   field: 'dTotalPurchaseValue', header: 'Purchase Price', sorting: 'dTotalPurchaseValue',
    //   searching: true, placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.PURCHASEPRICE',permission: PurchasePermissionEnum.PurchasePriceColumn
    // },
    // {
    //   field: 'dTotalPaidValue', header: 'Paid Amount', sorting: 'dTotalPaidValue', searching: true,
    //   placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.PAIDAMOUNT',permission: PurchasePermissionEnum.PaidAmountColumn
    // },
    {
      field: 'PurchaseDate', header: 'Date', sorting: 'PurchaseDate',
      searching: true, placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DATE'
    },
    {
      field: 'CreatedAt', header: 'Created Date', sorting: 'CreatedAt',
      searching: true, placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.CREATEDDATE'
    },
    {
      field: 'Outlet', header: 'Outlet', sorting: 'Outlet',
      searching: true, placeholder: '', translateCol: 'SSGENERIC.OUTLET'
    }, 

  ];

  initialColumns = ['ID', 'SuppierInvoiceNo', 'PurchaseDate', 'CreatedAt', 'Outlet'];
  globalFilterFields = ['ID', 'SuppierInvoiceNo', 'PurchaseDate'];
  rowsPerPageOptions = [10, 20, 50, 100];
  environmentData: any;
  usermodel: any;
  isLoadingData = false;
  initialPageNo = 0;
  constructor(
    private apiService: vaplongapi, 
    private datepipe: DatePipe, 
    private toastService: ToastService,
    public router: Router, 
    private permission: PermissionService, 
    private storageService: StorageService,
    private cdr: ChangeDetectorRef) {
    // this.storageService.setItem('PurchaseDetailRoute', this.router.url);
    // this.storageService.setItem('UpdatePurchaseRoute', this.router.url);

    this.usermodel = this.storageService.getItem('UserModel');

    const obj = {
      Action: 'View',
      Description: `View Purchases Customized`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  
    this.environmentData = environment;
    // this.translateService.setDefaultLang('en'); this.translate.instant('hello.world')
  }

  ngOnInit(): void {

    let curPageNo = this.storageService.getItem('purchase_order_report_customized_page_no');
    if(curPageNo > 0) {
      this.filterModel.PageNo = curPageNo;
      this.initialPageNo = curPageNo;
      this.storageService.removeItem('purchase_order_report_customized_page_no');
    }

    this.GetSearchByDateDropDownList();
    //this.GetProductDetailHistoryReport();
    // this.getAllPurchaseList(6);
    // this.dateId= 6;
    // this.GetAllPurchaseDataWithLazyLoadinFunction(this.filterModel);

    this.cols = [
      { field: 'ID', header: 'ID' },
      { field: 'SuppierInvoiceNo', header: 'Supplier Invoice No' },     
      { field: 'PurchaseDate', header: 'Purchase Date' },

    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    // this.GetAllPurchaseDataWithLazyLoadinFunction(this.filterModel);
  }
  GetProductDetailHistoryReport() {
    const obj = {
      // ID: 11986
      // ID: 11979
      ID: 1234
      // ID: 4920
    };
    this.apiService.GetProductDetailHistoryReport(obj).pipe(untilDestroyed(this)).subscribe((response: any) => {
    });
  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    this.storageService.setItem('purchase_order_report_customized_page_no', (event.curPageNo - 1));
    if (event.forLabel === 'View Detail') {
      this.Details(event.selectedRowData);
    }
    else if (event.forLabel === 'Refund') {
      this.Refund(event.selectedRowData.ID);
    }
  }
  Details(event: any) {
    this.router.navigate([`/purchase/customized-details/${event.ID}`]);
  }
  Refund(id: any) {
    this.router.navigate([`/purchase/refund/${id}`]);
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
    if (event === '7') {
      this.isCustomDate = true;
      this.datepickerModalComponent.open();
    }
    else {
      // this.getAllPurchaseList(this.selectedSearchByDateID);
      this.dateId = Number(this.selectedSearchByDateID);
      this.GetAllPurchaseDataWithLazyLoadinFunction(this.filterModel);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.datepickerModalComponent.close();
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    // this.getAllPurchaseList(7);
    this.dateId = 7;
    this.GetAllPurchaseDataWithLazyLoadinFunction(this.filterModel);
  }

  GetAllPurchaseDataWithLazyLoadinFunction(filterRM: any) {

    // this.stockRequestModel.Search = filterRM.Product;
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.IsReceived = true;

    if (this.dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(this.dateId);
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
      filterRequestModel.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    }
    else {
      filterRequestModel.IsGetAll = false;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
      filterRequestModel.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    }
    this.apiService.GetAllByFiltersTotalCount(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.totalRecords = response.TotalRowCount;
      }
      else {
        this.toastService.showErrorToast('Error', response.responseText);
      }
      this.cdr.detectChanges();
    },
    );
    this.isLoadingData = true;
    this.apiService.GetAllPurchaseByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        
        response1.AllPurchaseList.forEach((element: any) => {
          element.showRefund = element.ReturnedTyped === 1 ? false : true;
        });
        this.AllPurchaselist = response1.AllPurchaseList;
      }
      else {
        this.toastService.showErrorToast('Error', response1.responseText);
      }
      this.isLoadingData = false;
      this.cdr.detectChanges();
    },
    );
  }

  // getAllPurchaseList(dateId) {
  //   this.IsSpinner = true;
  //   let filterRequestModel = new FilterRequestModel();

  //   filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
  //   filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
  //   filterRequestModel.SubCategoryID = 0;
  //   filterRequestModel.PageNo = 0;
  //   filterRequestModel.PageSize = 10000;
  //   filterRequestModel.IsGetAll = false;
  //   filterRequestModel.IsReceived = true;

  //   if (dateId !== 7) {
  //     let daterequest = datefilter.GetDateRangeByDropdown(dateId);
  //     filterRequestModel.IsGetAll = daterequest.IsGetAll;
  //     filterRequestModel.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
  //     filterRequestModel.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
  //   }
  //   else {
  //     filterRequestModel.IsGetAll = false;
  //     filterRequestModel.ToDate = new Date(this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
  //     filterRequestModel.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
  //   }
  //   this.apiService.GetAllPurchaseByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
  //     if (response.ResponseCode === 0) {

  //       this.AllPurchaselist = response.AllPurchaseList;
  //       this.totalRecords = response.AllPurchaseList.length;
  //       this.IsSpinner = false;

  //     }
  //     else {
  //       this.IsSpinner = false;
  //     }
  //   },
  //   );
  // }
  onChangeDate(event: any) {
    // this.getAllPurchaseList(event.value);
    this.dateId = Number(event.value);
    this.GetAllPurchaseDataWithLazyLoadinFunction(this.filterModel);
  }
  AddPurchaseOrder() {
    this.router.navigate(['/purchase/add']);
  }

  exportPdf() {

    const doc = new jsPDF();
    autoTable(doc, {
      head: this.exportColumns,
      body: this.AllPurchaselist
    });
    doc.save('SupplierInvoice.pdf');
    // import('jspdf').then(jsPDF => {
    //     import('jspdf-autotable').then(x => {
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
