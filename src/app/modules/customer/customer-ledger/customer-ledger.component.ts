import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
// //import { Table } from 'primeng/table';
// import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { UpdateStatus } from 'src/app/Helper/models/UpdateStatus';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { ActivatedRoute, Router } from '@angular/router';


import { Columns } from 'src/app/shared/model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';

import { untilDestroyed } from 'src/app/shared/services/until-destroy';
// 
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { StorageService } from 'src/app/shared/services/storage.service';
import { environment } from 'src/environments/environment';
import { IImageModel } from 'src/app/Helper/models/ImageModel';
// import { ToastService } from '../../shell/services/toast.service';
import { ConfirmationService } from 'src/app/Service/confirmation.service';
import { ToastService } from '../../shell/services/toast.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';


@Component({
  selector: 'app-customer-ledger',
  templateUrl: './customer-ledger.component.html',
  // styleUrls: ['./customer-ledger.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class CustomerLedgerComponent implements OnInit, OnDestroy {

  modalFileUploaderConfig: ModalConfig = {
    modalTitle: 'Attachments',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideDismissButton: () => true,
    hideCloseButton: () => true,
    modalSize: "lg"
  };

  @ViewChild('modalFileUploader') private modalFileUploaderComponent: ModalComponent;

  AllCustomerlist: any[] = [];

  selectedCustomer : any;
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

  usermodel: UserModel;
  updateStatusModel: UpdateStatus;

  txtCustomer = '';
  txtPreviousBalance = '0.00';
  txtCurrentBalance = '0.00';
  filterRequestModel: FilterRequestModel;
  routeID: any;
  routeName: any;

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Attach Documents', icon: 'fas fa-donate', dependedProperty: 'CustomerID' },
  ];
  rowGroup: RowGroup = {
    property: 'CreatedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };


  columns: Columns[] = [
    { field: 'sNarration', header: 'Description', sorting: 'sNarration', placeholder: '' },
    { field: 'dCredit', header: 'Credit', sorting: 'dCredit', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL },
    { field: 'dDebit', header: 'Debit', sorting: 'dDebit', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL },
    {
      field: 'CurrentBalance', header: 'Current Balance', sorting: 'CurrentBalance', placeholder: '',
      type: TableColumnEnum.BALANCE_COLUMN
    },
    { field: 'CreatedAt', header: 'Date', sorting: 'CreatedAt', placeholder: '', type: TableColumnEnum.DATE_FORMAT },
    { field: 'Remarks', header: 'Remarks', sorting: 'Remarks', placeholder: '' },
    { field: 'Attachment', header: 'Attachment', sorting: 'Attachment', placeholder: '', type: TableColumnEnum.MULTIPLEATTACHMENT },

  ];

  globalFilterFields = ['sNarration', 'dCredit', 'dDebit', 'CurrentBalance', 'Remarks', 'CreatedAt'];
  rowsPerPageOptions = [10, 20, 50, 100];
  
  AttachDocumentPopDisplay = false;
  AttachmentArr : IImageModel[]=[];
  SelectedId=0;
  base64textString: IImageModel = {
    Base64String: '',
    Extention: ''
  };
  uploadedFiles: any[] = [];

  isLoadingData : boolean = true;

  constructor(
    private apiService: vaplongapi, private datepipe: DatePipe,
    private route: ActivatedRoute, private router: Router,
    // private toastService: ToastService, 
    private toastService : ToastService,
    private cdr : ChangeDetectorRef,
    private storageService: StorageService) {

    this.routeID = this.route.snapshot.params.id;
    this.routeName = this.route.snapshot.params.name;
    
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Customer Ledger`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { }); 

  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.getAllCustomerLedgerList(this.routeID, this.routeName);
  }

  ngOnDestroy(): void { }
  emitAction(event : any) {
    if (event.forLabel === 'Attach Documents') {
      this.SelectedId = event.selectedRowData.ID
      this.AttachfileFunction();
    }
  
  }

 AttachfileFunction() {
    this.AttachDocumentPopDisplay = true;
    this.openModalFileUploader();
  }

  onSelect(event : any) {
    //const file = event.files[0];
    for(let file of event) 
    {
      if (!file) {
        return;
      }
      const reader : any = new FileReader();

      reader.readAsDataURL(file);
      const self = this;
      // tslint:disable-next-line: only-arrow-functions
      reader.onload = function (e : any) {
        self.base64textString = {
          Base64String: reader.result.toString(),
          Extention: file.name.split('.')[file.name.split('.').length - 1]
        };
        self.AttachmentArr.push(self.base64textString);
      };
    }
  }
  onUpload(form : any)
  {
    this.modalFileUploaderComponent.close();
    if(this.AttachmentArr.length==0)
    {
      this.toastService.showErrorToast('Error', "no attachment is selected");
      this.AttachDocumentPopDisplay = false;
      return;
    }

    let IsAttachmentAttached = false;
    if(this.AttachmentArr.length==0)
    {
      IsAttachmentAttached = false;
      this.AttachmentArr.push(this.base64textString);
    }
    else
    {
      IsAttachmentAttached = true;
    }

    let Params = {
      CustomerID: this.SelectedId,
      PaymentModeID: 1,
      CashRegisterHistoryID: 1,
      CreatedByUserID: this.usermodel.ID,
      TotalAmount: 0,
      Remarks: "",
      IsAttachmentAttached:IsAttachmentAttached,
      //Documents: this.base64textString
      Documents : this.AttachmentArr,
      Attachment:"",
    }
    this.apiService.AddCustomerPaymentAttachmentOnly(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.modalFileUploaderComponent.close();
      if (response.ResponseCode == 0) {
        this.toastService.showSuccessToast('success', "Attachment uploaded successfully");
        this.AttachDocumentPopDisplay = false;
        // form.clear();
        this.AttachmentArr=[];
        this.uploadedFiles = [];    
        this.base64textString = { Extention: '', Base64String: '' };
        this.getAllCustomerLedgerList(this.routeID, this.routeName);

      }
      else {
        this.toastService.showErrorToast('Error', response.ResponseText);
        this.AttachDocumentPopDisplay = false;
      }
    },
    );
  }
  onClear(form: any) {
    this.AttachmentArr = [];
    this.base64textString = { Extention: '', Base64String: '' };
    // form.clear();
  }
  getAllCustomerLedgerList(ID : any, Name : any) {
    this.filterRequestModel = new FilterRequestModel();
    this.filterRequestModel.PageNo = 0;
    this.filterRequestModel.PageSize = 100000;
    this.filterRequestModel.ID = Number(ID);
    this.filterRequestModel.IsGetAll = true;
    this.filterRequestModel.FromDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    this.filterRequestModel.ToDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    this.isLoadingData = true;
    this.apiService.GetCustomerLeadgerByFilter(this.filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoadingData = false;
      if (response.ResponseCode === 0) {

        this.AllCustomerlist = response.AllTransactionList;
        this.totalRecords = this.AllCustomerlist.length;
        this.txtCustomer = Name;
        this.txtPreviousBalance = response.PreviousBalance;
        this.txtCurrentBalance = response.CurrentBalance;
        this.IsSpinner = false;
        this.cdr.detectChanges();
      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }

  CloseThis() {
    this.router.navigate(['/customer/customer-payments']);
  }
  DisplayAttachment(event : any)
  {
    window.open(`${environment.CUSTOMER_DOCUMENT_PATH}${event}`, 'blank');
  }

  exportPdf() {

    const doc = new jsPDF();
    autoTable(doc, {
      head: this.exportColumns,
      body: this.AllCustomerlist
    });
    doc.save('CustomerInvoice.pdf');
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
      const worksheet = xlsx.utils.json_to_sheet(this.AllCustomerlist);
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

  async openModalFileUploader() {
    return await this.modalFileUploaderComponent.open();
  }
}

