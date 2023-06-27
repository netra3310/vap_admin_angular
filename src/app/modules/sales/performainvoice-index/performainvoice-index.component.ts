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
import { SalesPermissionEnum } from 'src/app/shared/constant/sales-permission';
// import { ToastService } from '../../shell/services/toast.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ConfirmationService } from 'src/app/Service/confirmation.service';
import { ToastService } from '../../shell/services/toast.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: 'app-performainvoice-index',
  templateUrl: './performainvoice-index.component.html',
  styleUrls: ['./performainvoice-index.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class PerformainvoiceIndexComponent implements OnInit, OnDestroy {

  dateModalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };

  @ViewChild('datepicker') private datepickerModalComponent: ModalComponent;

  AllSalelist: any[] = [];
  SalesPermission = SalesPermissionEnum;
  selectedSale : any;
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
  displaySalePopup = false;

  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Open Sale', icon: 'fas fa-edit', dependedProperty: 'ID' },
    { label: 'Details', icon: 'fas fa-info', dependedProperty: 'ID' },

  ];
  rowGroup: RowGroup = {
    property: 'CreatedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };

  columns: Columns[] = [

    { field: 'CreatedAt', header: 'Date', sorting: 'CreatedAt', placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DATE' },
    {
      field: 'dTotalSaleValue', header: 'Sale Amount', sorting: 'dTotalSaleValue', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.SALEAMOUNT'
    },
    { field: 'Customer', header: 'Company', sorting: 'Customer', placeholder: '', translateCol: 'SSGENERIC.COMPANY' }

  ];

  initialColumns = ['Customer', 'CreatedAt', 'dTotalSaleValue'];
  isLoadingData : boolean = true;
  globalFilterFields = ['Customer', 'CreatedAt', 'dTotalSaleValue'];
  rowsPerPageOptions = [10, 20, 50, 100];
  usermodel: any;

  initPageNo = 0;
  constructor(
    private apiService: vaplongapi, 
    // private toastService: ToastService,
    private toastService : ToastService,
    private datepipe: DatePipe,private storageService: StorageService, 
    private confirmationService: ConfirmationService, 
    public router: Router,
    private cdr : ChangeDetectorRef) {
      this.usermodel = this.storageService.getItem('UserModel');

      const obj = {
        Action: 'View',
        Description: `View Proforma Invoices`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { }); 
  }

  ngOnInit(): void {
    // let initPageNo = this.storageService.getItem('performa_invoice_page_no');
    // if(initPageNo > 0) {
    //   this.initPageNo = initPageNo;
    //   this.storageService.removeItem('performa_invoice_page_no');
    // }
    
    const initPageNo = this.storageService.getItem('performa_invoice_page_no');
    if(initPageNo > 0) {
      this.initPageNo = initPageNo;
      this.storageService.removeItem('performa_invoice_page_no');
    }
    this.GetSearchByDateDropDownList();
    this.getAllPerfomaSaleList(6);

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
    if (event.forLabel === 'Open Sale') {
      this.openSale(event.selectedRowData);
    }
    else
      if (event.forLabel === 'Details') {
        this.storageService.setItem('performa_invoice_page_no', (event.curPageNo - 1));
        this.Details(event.selectedRowData);
      }

  }
  openSale(event : any) {
    this.router.navigate([`/sale/add-receipt-new/${event.ID}`]);
  }
  Details(event : any) {
    this.router.navigate(['/sale/performainvoice-detail/' + event.ID]);
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
      this.getAllPerfomaSaleList(this.selectedSearchByDateID);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.getAllPerfomaSaleList(7);
    this.datepickerModalComponent.close();
  }
  onChangeDate(event: any) {
    this.getAllPerfomaSaleList(event.value);
  }
  getAllPerfomaSaleList(dateId : any) {
    this.IsSpinner = true;
    const Type = 1;
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.ToDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = 0;
    filterRequestModel.PageSize = 10000;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.IsReceived = true;
    filterRequestModel.IsIncomingOrder = false;
   
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
    this.apiService.GetAllPerfomaSaleByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoadingData = false;
      if (response.ResponseCode === 0) {
        this.AllSalelist = response.AllPerfomaSaleList;

        this.totalRecords = response.AllPerfomaSaleList.length;
        this.IsSpinner = false;
        this.cdr.detectChanges();

      }
      else {
        this.IsSpinner = false;
        // this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error ! not getting api data');
        this.toastService.showErrorToast('error', 'internal server error ! not getting api data');

      }
    },
    );
  }

  DeleteLastDaysReports() {
    // this.confirmationService.confirm({
    //   message: 'Do you want to remove the Last 5 Days open sale?',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     this.DeleteAllByFilters();

    //   },
    //   reject: () => {
    //   }

    // });

    this.confirmationService.confirm('Do you want to remove the Last 5 Days open sale?').then(
      (confirmed) => {
        if(confirmed) {
          this.DeleteAllByFilters();
        }
      }
    )

  }
  DeleteAllByFilters() {

    const currentDate = new Date();
    const currentDate1 = new Date();

    this.IsSpinner = true;
    const param = {
      FromDate: new Date(currentDate.setDate(currentDate.getDate() - 6)),
      ToDate: new Date(currentDate1.setDate(currentDate1.getDate() - 1)),
    };
    this.apiService.UpdatePerformaSalesStatus(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.IsSpinner = false;
        // this.toastService.showSuccessToast('Success', response.ResponseText);
        this.toastService.showSuccessToast('success', response.ResponseText);
        this.getAllPerfomaSaleList(6);
      } else {
        this.IsSpinner = false;
        // this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error ! not getting api data');
        this.toastService.showErrorToast('error', 'internal server error ! not getting api data');
      }
    });
  }
  AddPerfomaInvoice() {
    this.router.navigate(['/sale/add-performa-invoice']);
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
