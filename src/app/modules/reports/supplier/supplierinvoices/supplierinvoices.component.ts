import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// //import { Table } from 'primeng/table';
// import { LazyLoadEvent, MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


import { Columns } from 'src/app/shared/model/columns.model';

import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';

import { untilDestroyed } from 'src/app/shared/services/until-destroy';
// 
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { Router } from '@angular/router';
// import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ConfirmationService } from 'src/app/Service/confirmation.service';
import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: 'app-supplierinvoices',
  templateUrl: './supplierinvoices.component.html',
  styleUrls: ['./supplierinvoices.component.scss'],
  providers: [ConfirmationService]

})
export class SupplierinvoicesComponent implements OnInit, OnDestroy {
  // 
  modalConfig: ModalConfig = {
    modalTitle: 'Invoice',
    modalContent: "Modal Content",
    closeButtonLabel: "Close",
    dismissButtonLabel: "Detail",
    modalSize : "md",
    shouldDismiss: () => {
      this.showDetailInvoice();
      return true;}
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  AllInvoicelist: any[] = [];
  PurchaseTableModel: any[] = [];
  selectedInvoice : any;
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
  displayPurchasePopup = false;

  rowGroup: RowGroup = {
    property: 'InvoiceDateNew',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  genericMenuItems: GenericMenuItems[] = [];
  columns: Columns[] = [
    {
      field: 'SupplierInvoice', header: 'Supplier Invoice No', sorting: 'SupplierInvoice', placeholder: '',
      type: TableColumnEnum.REDIRECTION_COLUMN, translateCol: 'SSGENERIC.SUPPLIERINVOICE'
    },
    {
      field: 'Supplier', header: 'Supplier', sorting: 'Supplier', placeholder: '',
      translateCol: 'SSGENERIC.SUPPLIER'
    },
    {
      field: 'InvoiceDateNew', header: 'Invoice Date', sorting: 'InvoiceDateNew', placeholder: '',
      type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.INVOICEDATE'
    },
    {
      field: 'dTotalOriginalAmount', header: 'Invoice Amount(Purchase Price)', sorting: 'dTotalOriginalAmount',
      placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.IA'
    },
    {
      field: 'dPaidAmount', header: 'Paid Amount', sorting: 'dPaidAmount', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.PAIDAMOUNT'
    },
    {
      field: 'dRemainingAmount', header: 'Rest Amount(Remaining)', sorting: 'dRemainingAmount',
      placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.RM'
    },
    {
      field: 'dTotalReturnedAmount', header: 'Returned Amount', sorting: 'dTotalReturnedAmount',
      placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.RETURNAMOUNT'
    },
  ];
  initialColumns =  ['SupplierInvoice', 'Supplier', 'InvoiceDateNew', 'dTotalOriginalAmount', 'dPaidAmount', 'dRemainingAmount', 'dTotalReturnedAmount'];
  globalFilterFields = ['SupplierInvoice', 'Supplier', 'InvoiceDateNew', 'dTotalOriginalAmount', 'dPaidAmount', 'dRemainingAmount', 'dTotalReturnedAmount'];
  rowsPerPageOptions = [10, 20, 50, 100];

  columns1: Columns[] = [
    { field: 'ID', header: 'Supplier Invoice No', sorting: 'ID', placeholder: '', type: TableColumnEnum.REDIRECTION_COLUMN },
    { field: 'Supplier', header: 'Supplier', sorting: 'Supplier', placeholder: '' },
    {
      field: 'dTotalPurchaseValue', header: 'Purchase Price', sorting: 'dTotalPurchaseValue', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL
    },
    {
      field: 'dTotalPaidValue', header: 'Paid Amount ', sorting: 'dTotalPaidValue', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL
    },
    { field: 'PurchaseDate', header: 'Date', sorting: 'PurchaseDate', placeholder: '' },

  ];
  globalFilterFields1 = ['ID', 'Supplier', 'dTotalPaidValue', 'dTotalPurchaseValue', 'PurchaseDate'];
  usermodel: any;

  isLoadingData: boolean = true;
  isDetailLoading : boolean = true;
  detailInvoiceId : any;
  constructor(private apiService: vaplongapi, public router: Router, 
    // private toastService: ToastService,
    private toastService : ToastService,
    private cdr: ChangeDetectorRef,
    private storageService: StorageService) {
    this.usermodel = this.storageService.getItem('UserModel');
    this.storageService.setItem('PurchaseDetailRoute', this.router.url);
    const obj = {
      Action: 'View',
      Description: `View Supplier Invoices Payment Report`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { });
  }

  ngOnInit(): void {
    this.getSupplierInvoicePaymentHistory();    
  }
  ngOnDestroy(): void { }
  emitAction(event: any) {
  }
  emitAction1(event: any) {
  }
  getPurchasesBySupplierInvoiceNo(event: any) {    
    this.displayPurchasePopup = true;
    this.GetAllPurchasesBySupplierInvoiceNO(event.SupplierInvoice);
    this.openModal();
  }
  PurchaseDetails(event: any) {
    this.storageService.setItem('SupplierPaymentRedirect', true);
    this.router.navigate([`/purchase/details/${event.ID}`]);
  }
  refreshReport() {
    this.getSupplierInvoicePaymentHistory();
  }

  getSupplierInvoicePaymentHistory() {
    this.isLoadingData = true;
    this.apiService.GetSupplierInvoicePaymentHistory().pipe(untilDestroyed(this)).subscribe((response: any) => {
      
      if (response.ResponseCode === 0) {
        this.AllInvoicelist = response.AllSupplierInvoicePayments.sort((a : any, b : any) => a.InvoiceDateNew > b.InvoiceDateNew ? -1 : 1);
        this.totalRecords = response.AllSupplierInvoicePayments.length;

        let Redirection = this.storageService.getItem('SupplierPaymentRedirect');        
        if(Redirection)
        {
          this.storageService.removeItem('SupplierPaymentRedirect');
          let filtervalues = this.storageService.getItem('SupplierPaymentRedirectValues');
          this.displayPurchasePopup = true;
          this.GetAllPurchasesBySupplierInvoiceNO(filtervalues.SupplierInvoiceNo);    
        }
      }
      else {
        this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
        // console.log('internal server error ! not getting api data');
      }
      this.isLoadingData = false;
      this.cdr.detectChanges();
    },
    );
  }

  GetAllPurchasesBySupplierInvoiceNO(invoiceNo : any) {
    this.isDetailLoading = true;
    const singleproductprice = 0;

    const params = {
      SupplierInvoiceNo: invoiceNo,
    };
    this.storageService.setItem('SupplierPaymentRedirectValues', params);

    this.apiService.GetAllBySupplierInvoiceNO(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isDetailLoading = false;
      if (response.ResponseCode === 0) {
        this.PurchaseTableModel = response.AllPurchaseList;

        this.totalRecords = response.AllPurchaseList.length;
        this.detailInvoiceId = this.PurchaseTableModel[0].ID;
        this.cdr.detectChanges();
      }
      else {
        this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
        // console.log('internal server error ! not getting api data');
      }
    });
  }

  exportPdf() {

    const doc = new jsPDF();
    autoTable(doc, {
      head: this.exportColumns,
      body: this.AllInvoicelist
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
      const worksheet = xlsx.utils.json_to_sheet(this.AllInvoicelist);
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

  async showDetailInvoice() {
    // this.router.navigate([`/purchase/details/${this.detailInvoiceId}`]);
    this.storageService.setItem('SupplierPaymentRedirect', true);
    window.open(`/purchase/details/${this.detailInvoiceId}`, '_blank');
  }
  
  async openModal() {
    return await this.modalComponent.open();
  }
}
