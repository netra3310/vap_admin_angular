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
// import { ToastService } from '../../shell/services/toast.service';
import { ToastService } from '../../shell/services/toast.service';

import { PurchasePermissionEnum } from 'src/app/shared/constant/purchase-permission';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ConfirmationService } from 'src/app/Service/confirmation.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';


@Component({
  selector: 'app-holdpurchasereport-index',
  templateUrl: './holdpurchasereport-index.component.html',
  styleUrls: ['./holdpurchasereport-index.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class HoldpurchasereportIndexComponent implements OnInit, OnDestroy {

  modalConfig: ModalConfig = {
    modalTitle: 'Remarks',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };
  @ViewChild('modal') private modalComponent: ModalComponent;

  
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
  rows = 25;
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

  displayDialog = false;
  DialogRemarks = '';

  rowGroup: RowGroup = {
    property: 'CreatedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };


  genericMenuItems: GenericMenuItems[] = [
    { label: 'Open Purchase', icon: 'fas fa-edit', dependedProperty: 'ID' ,permissionDisplayProperty: 'showOpenBtn'},
    { label: 'Details', icon: 'fas fa-info', dependedProperty: 'ID' },
    { label: 'Remove', icon: 'fas fa-trash', dependedProperty: 'ID',permissionDisplayProperty: 'showRemoveBtn' }

  ];
  columns: Columns[] = [

    { field: 'SuppierInvoiceNo', header: 'SuppierInvoiceNo', sorting: 'SuppierInvoiceNo', placeholder: '', translateCol: 'SupplierInvoiceNo' },
    { field: 'Supplier', header: 'Company', sorting: 'Supplier', placeholder: '', translateCol: 'SSGENERIC.COMPANY' },

    {
      field: 'dTotalPurchaseValue', header: 'Purchase Amount', sorting: 'dTotalPurchaseValue', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.INVOICEAMOUNT'
    },
    { field: 'CreatedAt', header: 'Date', sorting: 'CreatedAt', placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DATE' },
    { field: 'sRemarks', header: 'Remarks', sorting: 'sRemarks', placeholder: '', type: TableColumnEnum.REMARKS, translateCol: 'SSGENERIC.REMARKS' },

  ];
  initialColumns : any = ['SuppierInvoiceNo', 'Supplier', 'dTotalPurchaseValue', 'sRemarks', 'CreatedAt'];  

  globalFilterFields = ['SuppierInvoiceNo', 'dTotalPurchaseValue', 'sRemarks', 'CreatedAt'];
  rowsPerPageOptions = [10, 20, 50, 100];
  usermodel: any;
  isLoadingData : boolean = true;
  initPageNo = 0;
  constructor(
    private apiService: vaplongapi, public router: Router, private datepipe: DatePipe, 
    private toastService: ToastService,
    private confirmationService: ConfirmationService,private storageService: StorageService,
    private cdr : ChangeDetectorRef) {
      this.usermodel = this.storageService.getItem('UserModel');
      this.storageService.setItem('UpdatePurchaseRoute', this.router.url);
      const obj = {
        Action: 'View',
        Description: `View Hold Purchases`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { });
  }

  ngOnInit(): void {
    this.initPageNo = this.storageService.getItem('hold_purchase_report_page_no');
    this.storageService.removeItem('hold_purchase_report_page_no');
    this.GetSearchByDateDropDownList();
    this.getAllPurchaseList(6);
    this.cols = [
      { field: 'SuppierInvoiceNo', header: 'SuppierInvoiceNo' },
      { field: 'dTotalPurchaseValue', header: 'Purchase Amount' },
      { field: 'CreatedAt', header: 'Date' },
      { field: 'sRemarks', header: 'Remarks' },

    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  ngOnDestroy(): void {
  }
  emitAction(event : any) {
    
    if (event.forLabel === 'Open Purchase') {
      this.openPurchase(event.selectedRowData);
    }
    else if (event.forLabel === 'Details') {
      this.storageService.setItem('hold_purchase_report_page_no', (event.curPageNo - 1));
      this.Details(event.selectedRowData.ID);
    }
    
    else if (event.forLabel === 'Remove') {
      this.Remove(event.selectedRowData.ID);
    }
  }

  openPurchase(event : any) {
    this.router.navigate([`/purchase/add-hold/${event.ID}`]);
   }
   Details(id : any) {
     this.router.navigate([`/purchase/hold-details/${id}`]);
   }
  
  Remove(id : any) {
    // this.confirmationService.confirm({
    //   message: 'Do you want to remove the selected open purchase?',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     this.deleteOpenPurchaseByID(id);
    //   }

    // });
    this.confirmationService.confirm('Do you want to remove the selected open purchase?')
      .then((confirmed) => {
        if(confirmed) {
          this.deleteOpenPurchaseByID(id);
        }
      });
  }
  deleteOpenPurchaseByID(id : any) {
    const param = { ID: id , RequestedUserID:this.usermodel.ID };
    this.isLoadingData = true;
    this.apiService.DeleteOpenPurchase(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoadingData = false;
      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.getAllPurchaseList(6);
      }
      else {
        this.toastService.showErrorToast('Error', response.ResponseText);
        this.toastService.showErrorToast('error', response.ResponseText);
        // 
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
      this.getAllPurchaseList(this.selectedSearchByDateID);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.getAllPurchaseList(7);
    this.datepickerModalComponent.close();
    // console.log(this.fromDate);
  }
  
  async openDatePickerModal() {
    return await this.datepickerModalComponent.open();
  }

  onChangeDate(event: any) {
    this.getAllPurchaseList(event.value);
  }
  getAllPurchaseList(dateId : any) {
    const Type = 1;
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.ToDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = 0;
    filterRequestModel.PageSize = 10000;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.IsPurchased = true;
    //filterRequestModel.IsReceived = false;

    if (+Type === 0) {
      filterRequestModel.PermissionLevel = 3;
    } else {
      filterRequestModel.PermissionLevel = Type;
    }
    
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
    this.apiService.GetAllOpenPurchasesByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoadingData = false;
      if (response.ResponseCode === 0) {
        // response.AllOpenSaleList.OrderBy((x: any) => x.CreatedAt.Value);
        response.AllOpenPurchaseList.forEach((element : any) => {
          element.showOpenBtn = element.IsReceived === true ? false : true; 
          element.showRemoveBtn = (element.OpenPurchasesDetails.reduce((sum : any, current : any) => sum + current.ReceivedQuantity, 0) > 0) ? false:true ;       
        });
        this.AllPurchaselist = response.AllOpenPurchaseList;

        this.totalRecords = response.AllOpenPurchaseList.length;
        this.cdr.detectChanges();
      }
      else {
        console.log('internal server error ! not getting api data');
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
    //   }

    // });
    this.confirmationService.confirm('Do you want to remove the Last 5 Days open sale?')
      .then((confirmed) => {
        if(confirmed) {
          this.DeleteAllByFilters();
        }
      })
  }
  AddOpenPurchaseOrder() {
    this.router.navigate(['/purchase/addPreOrder']);
  }
  showDialog(event : any) {

    this.displayDialog = true;
    this.DialogRemarks = event.sRemarks;
  }

  DeleteAllByFilters() {
    let today = new Date();
    const param = {
      FromDate: new Date(this.datepipe.transform(new Date().setDate(today.getDate()-5), 'yyyy-MM-ddTHH:mm:ss') ?? ""),
      ToDate: new Date(this.datepipe.transform(new Date().setDate(today.getDate()-1), 'yyyy-MM-ddTHH:mm:ss') ?? ""),
      RequestedUserID:this.usermodel.ID,
    };
    this.isLoadingData = true;
    this.apiService.DeleteAllOpenPurchaseByFilter(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoadingData = false;
      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.toastService.showSuccessToast('Success', response.ResponseText);
        
        this.getAllPurchaseList(6);
      }
      else {
        this.toastService.showErrorToast('error', response.ResponseText);
        this.toastService.showErrorToast('Error', response.ResponseText);
        // 
      }
    },
    );
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
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

}


