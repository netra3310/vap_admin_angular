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
import { ToastService } from '../../shell/services/toast.service';
import { ConfirmationService } from 'src/app/Service/confirmation.service';
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
import { CustomerPermissionEnum } from 'src/app/shared/constant/customer-permission';


@Component({
  selector: 'app-customer-payment-details',
  templateUrl: './customer-payment-details.component.html',
  // styleUrls: ['./customer-payment-details.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class CustomerPaymentDetailComponent implements OnInit, OnDestroy {

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
  isLoadingData: boolean = true;

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Reverse Payment', icon: 'fas fa-donate', dependedProperty: 'ID' , permission: CustomerPermissionEnum.ReversePayment, permissionDisplayProperty: 'showReverse' },
  ];
  rowGroup: RowGroup = {
    property: 'Date',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };

  filterModel = {
    PageNo: 0,    
    PageSize: 25,
    Product: '',
  };
  columns: Columns[] = [
    { field: 'Date', header: 'Date', sorting: 'Date', placeholder: '', type: TableColumnEnum.DATE_FORMAT },  
    { field: 'dTotalAmount', header: 'Total Amount', sorting: 'dTotalAmount', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL }, 
    {
      field: 'IsReversed', header: 'Payment Status', sorting: '',  placeholder: '', type: TableColumnEnum.PAYMENT_STATUS,
      translateCol: 'SSGENERIC.PAYMENTSTATUS'
    },
  ];
  initialCoulumns = ['Date', 'dTotalAmount', 'IsReversed'];
  globalFilterFields = ['Date', 'dTotalAmount'];
  rowsPerPageOptions = [10, 20, 50, 100];
  
  AttachDocumentPopDisplay = false;
  AttachmentArr : IImageModel[]=[];
  SelectedId=0;
  base64textString: IImageModel = {
    Base64String: '',
    Extention: ''
  };
  uploadedFiles: any[] = [];
  selectedCustomerID=0;

  constructor(
    private apiService: vaplongapi, private datepipe: DatePipe,
    private route: ActivatedRoute, private router: Router,
    // private toastService: ToastService, 
    private toastService : ToastService,
    private cdr : ChangeDetectorRef,
    private confirmationService: ConfirmationService,private storageService: StorageService) {

    this.routeID = this.route.snapshot.params.id;
    this.routeName = this.route.snapshot.params.name;
    
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Customer Payment Details`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { }); 

  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.txtCustomer = this.routeName;
    this.selectedCustomerID = this.routeID;
    this.getAllCustomerPaymentList(this.filterModel) ;
  }

  ngOnDestroy(): void { }
  emitAction(event : any) {
    if (event.forLabel === 'Reverse Payment') {     
      this.SelectedId = event.selectedRowData.ID
      this.ReversePayment(this.SelectedId);
    }
  
  }

 AttachfileFunction() {
    this.AttachDocumentPopDisplay = true;
  }

  ReversePayment(ID : any) {
    // this.confirmationService.confirm({
    //   message: 'Are you sure, you want to reverse this payment?',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     this.ReverseCustomerPayment(ID);
    //   }

    // });
    this.confirmationService.confirm('Are you sure, you want to reverse this payment?').then(
      (confirmed) => {
        if(confirmed) {
          this.ReverseCustomerPayment(ID);
        }
      }
    )
  }

  ReverseCustomerPayment(id : any) {
    this.isLoadingData = true;
    if(id==0)
    {
      // this.notificationService.notify(NotificationEnum.ERROR, 'Error', "please select any payments");
      this.toastService.showErrorToast('Error', "please select any payments");
    }
    const param = {
      ID: id,
      UpdatedByUserID: this.usermodel.ID,
      Remarks:"",
    };
    this.apiService.ReverseCustomerPaymentExtras(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      
      this.isLoadingData = false;
      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.getAllCustomerPaymentList(this.filterModel);
      }
      else {
        this.toastService.showErrorToast('Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    });
  }


  onSelect(event : any) {
    //const file = event.files[0];
    for(let file of event.files) 
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
 
  onClear(form: any) {
    this.AttachmentArr = [];
    this.base64textString = { Extention: '', Base64String: '' };
    form.clear();
  }
  getAllCustomerPaymentList(filterRM : any) {
    this.filterRequestModel = new FilterRequestModel();
    this.filterRequestModel.CustomerID = Number(this.selectedCustomerID);
    this.filterRequestModel.PageNo = filterRM.PageNo;
    this.filterRequestModel.PageSize = filterRM.PageSize;
    this.filterRequestModel.IsGetAll = true;
    this.filterRequestModel.FromDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    this.filterRequestModel.ToDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    this.isLoadingData = true;
    this.apiService.GetCustomerReversablePayments(this.filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.isLoadingData = false;
        this.AllCustomerlist = response.Payments;
        this.AllCustomerlist.forEach(element => {
          element.showReverse = (element.IsReversed) ? false : true;
        });
        this.totalRecords = response.TotalCount;
        this.cdr.detectChanges();
      }
      else {
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

}

