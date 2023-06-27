import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// //import { Table } from 'primeng/table';
// import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { datefilter } from 'src/app/Helper/datefilter';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { Columns } from 'src/app/shared/model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
// import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { ToastService } from '../../shell/services/toast.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ConfirmationService } from 'src/app/Service/confirmation.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';


type Tabs = 'all' | 'online' | 'software';

@Component({
  selector: 'app-salerefundreport-index',
  templateUrl: './salerefundreport-index.component.html',
  styleUrls: ['./salerefundreport-index.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class SalerefundreportIndexComponent implements OnInit, OnDestroy {
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
  AllSalelist: any[] = [];
  AllSalelistOriginal: any[] = [];

  printingData: any;
  printingData1: any;

  selectedSale : any;
  SearchByDateDropdown: any[];
  selectedSearchByDateID = '';
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 25;
  // last = 25;
  totalRecords = 0;
  items: any[];
  cols: any[];
  exportColumns: any[];
  displaySalePopup = false;
  Type = 1;

  selectedFilter = 1;

  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');

  rowGroup: RowGroup = {
    property: 'CreatedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Details', icon: 'fas fa-info', dependedProperty: 'ID' }
  ];
  columns: Columns[] = [
    { field: 'ID', header: 'Return Invoice No', sorting: 'ID', placeholder: '', type: TableColumnEnum.REDIRECTION_COLUMN, translateCol: 'SSGENERIC.RETURN' },
    {
      field: 'OriginalSaleID', header: 'Original Invoice No', sorting: 'OriginalSaleID', placeholder: '',
      type: TableColumnEnum.REDIRECTION_COLUMN_2, translateCol: 'SSGENERIC.ORIGINAL'
    },
    { field: 'Customer', header: 'Company', sorting: 'Customer', placeholder: '', translateCol: 'SSGENERIC.COMPANY' },
    {
      field: 'dTotalSaleValue', header: 'Sale Price', sorting: 'dTotalSaleValue', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.SALEPRICE'
    },
    {
      field: 'SaleDate', header: 'Sale Date', sorting: 'SaleDate', placeholder: '',
      type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.SALEDATE'
    },
    {
      field: 'CreatedAt', header: 'Refund Date', sorting: 'CreatedAt', placeholder: '',
      type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.REFUNDDATE'
    },
    {
      field: 'OrderType', header: 'Order From', sorting: 'CreatedAt', placeholder: ''
      , translateCol: 'SSGENERIC.ORDERFROM'
    },

  ];
  initialColumns : any = ['ID', 'Customer', 'OriginalSaleID', 'SaleDate', 'CreatedAt', 'dTotalSaleValue'];
  globalFilterFields = ['ID', 'Customer', 'OriginalSaleID', 'SaleDate', 'CreatedAt', 'dTotalSaleValue'];
  rowsPerPageOptions = [10, 20, 50, 100];
  usermodel: any;

  activeTab: Tabs = 'all';

  isLoadingData : boolean = true;
  initPageNo = 0;
  constructor(
    private apiService: vaplongapi,private storageService: StorageService, 
    public router: Router, private datepipe: DatePipe, 
    // private toastService: ToastService
    private toastService : ToastService,
    private cdr : ChangeDetectorRef
    ) {
      this.usermodel = this.storageService.getItem('UserModel');
      this.storageService.setItem('ReturnSaleDetailRoute', this.router.url);
      const obj = {
        Action: 'View',
        Description: `View Refunded Orders`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { });
  }

  ngOnInit(): void {
    this.initPageNo = this.storageService.getItem('sale_refund_report_page_no');

    
    let tmpActiveTab = this.storageService.getItem('sale_refund_report_active_tab');
    if(tmpActiveTab) {
      this.activeTab = tmpActiveTab;
    }

    switch(this.activeTab) {
      case 'all':
        this.selectedFilter = 1;
        break;
      case 'online':
        this.selectedFilter = 2;
        break;
      case 'software':
        this.selectedFilter = 3;
        break;
    }

    this.storageService.removeItem('sale_refund_report_page_no');
    this.storageService.removeItem('sale_refund_report_active_tab');
    this.GetSearchByDateDropDownList();
    this.getAllReturnSaleList(6);

    this.cols = [
      { field: 'CreatedAt', header: 'Date' },
      { field: 'dTotalSaleValue', header: 'Sale Amount' },
      { field: 'Customer', header: 'Company' },

    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }
  ngOnDestroy(): void {
  }
  emitAction(event : any) {
    this.storageService.setItem('sale_refund_report_page_no', (event.curPageNo - 1));
    this.storageService.setItem('sale_refund_report_active_tab', (this.activeTab));
    if (event.forLabel === 'Details') {
      this.Details(event.selectedRowData);
    }

  }

  Details(event : any) {
    // this.PrintingReturnSaleFuntion(event.ID);
    this.router.navigate(['/sale/refundsale-detail/' + event.ID]);

  }
  OriginalInvoiceID(event : any) {
    // this.PrintingInvoiceFuntion(event.OriginalSaleID);
    this.router.navigate(['/sale/sale-detail/' + event.OriginalSaleID]);
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
  onChangeDate(event: any) {
    if (event == '7') {
      this.isCustomDate = true;
      this.openDatePickerModal();
    }
    else {
      this.getAllReturnSaleList(this.selectedSearchByDateID);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.getAllReturnSaleList(7);
    this.datepickerModalComponent.close();
    // console.log(this.fromDate);
  }


  getAllReturnSaleList(dateId : any) {
    this.IsSpinner = true;
    const Type = 1;
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.ToDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = 0;
    filterRequestModel.PageSize = 10000;
    filterRequestModel.IsGetAll = false;

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
    const singleproductprice = 0;
    this.isLoadingData = true;
    this.apiService.GetAllReturnSaleByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoadingData = false;
      if (response.ResponseCode === 0) {
        this.AllSalelist = response.AllReturnSaleList;
        this.AllSalelistOriginal = response.AllReturnSaleList;

        this.totalRecords = response.AllReturnSaleList.length;
        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
      
      this.filterReport();
      this.cdr.detectChanges();
    },
    );
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

  filterReport() {
   
    if (Number(this.selectedFilter) === 1) {
      this.Type = 1;
      this.AllSalelist = this.AllSalelistOriginal;
    }
    else if (Number(this.selectedFilter) === 2) {
      this.Type = 2;
      this.AllSalelist = this.AllSalelistOriginal.filter((x: any) => x.IsOnlineOrder === true);
    }
    else {
      this.Type = 3;
      this.AllSalelist = this.AllSalelistOriginal.filter((x: any) => x.IsOnlineOrder === false);
    }
  }


  exportPdf() {

    const doc = new jsPDF();
    autoTable(doc, {
      head: this.exportColumns,
      body: this.AllSalelist
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
      const worksheet = xlsx.utils.json_to_sheet(this.AllSalelist);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'SupplierInvoice');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

  async openDatePickerModal() {
    return await this.datepickerModalComponent.open();
  }

}
