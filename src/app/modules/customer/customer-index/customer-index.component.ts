import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
// //import { Table } from 'primeng/table';
// import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { UserModel } from '../../../Helper/models/UserModel';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';

import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
// import { ToastService } from '../../shell/services/toast.service';
import { ToastService } from '../../shell/services/toast.service';
import { Router } from '@angular/router';
import { CustomerPermissionEnum } from 'src/app/shared/constant/customer-permission';
import * as XLSX from 'xlsx';
import { StorageService } from 'src/app/shared/services/storage.service';
import { IImageModel } from 'src/app/Helper/models/ImageModel';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { ConfirmationService } from 'src/app/Service/confirmation.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';


@Component({
  selector: 'app-customer-index',
  templateUrl: './customer-index.component.html',
  // styleUrls: ['./customer-index.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class CustomerIndexComponent implements OnInit, OnDestroy {

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
  uploadedFiles: any[] = [];
  Customers: any[] = [];
  arrayBuffer: any;
  file: File;

  AllCustomerlist: any[] = [];
  CustomerPermission = CustomerPermissionEnum;
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
  AttachDocumentPopDisplay = false;

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-edit', dependedProperty: 'CustomerID', permission: CustomerPermissionEnum.UpdateClient },
    { label: 'Discounts', icon: 'fas fa-donate', dependedProperty: 'CustomerID' },
    { label: 'Delete', icon: 'fas fa-close', dependedProperty: 'CustomerID' },
  ];
  columns: Columns[] = [
    { field: 'IsActiveForCustomer', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'CustomerID', header: 'ID', sorting: 'CustomerID', placeholder: '', translateCol: 'SSGENERIC.ID' },
    { field: 'sCompanyName', header: 'Company', sorting: 'sCompanyName', placeholder: '' , translateCol: 'SSGENERIC.COMPANY'},
    // tslint:disable-next-line: max-line-length
    { field: 'FirstName', secondfield: 'LastName', header: 'Customer', sorting: 'FirstName', placeholder: '', type: TableColumnEnum.COMBINED_COLUMN , translateCol: 'SSGENERIC.CUSTOMER'},
    // tslint:disable-next-line: max-line-length
    { field: 'Address', secondfield: 'City', header: 'Address', sorting: 'FirstName', placeholder: '', type: TableColumnEnum.COMBINED_COLUMN , translateCol: 'SSGENERIC.ADDRESS'},
    { field: 'EmailAddress', header: 'Email', sorting: 'EmailAddress', placeholder: '', translateCol: 'SSGENERIC.EMAIL' },
    // tslint:disable-next-line: max-line-length
    // { field: 'CurrentBalance', header: 'Current Balance', sorting: 'CurrentBalance', placeholder: '', type: TableColumnEnum.BALANCE_COLUMN, translateCol: 'SSGENERIC.CURRENTB' },
  ];


  globalFilterFields = ['sCompanyName', 'FirstName', 'LastName', 'Address', 'City', 'CurrentBalance'];
  rowsPerPageOptions = [10, 20, 50, 100];
  isLoadingData : boolean = true;
  initPageNo = 0;
  constructor(
    private apiService: vaplongapi,
    // private toastService: ToastService,
    private toastService : ToastService,
    private datepipe: DatePipe,
    private router: Router, private storageService: StorageService,
    private cdr : ChangeDetectorRef,
    private confirmationService: ConfirmationService
    ) {

      this.usermodel = this.storageService.getItem('UserModel');
      const obj = {
        Action: 'View',
        Description: `View Customers`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { });
  }

  ngOnInit(): void {
    let initPageNo = this.storageService.getItem('sale_index_page_no');
    if(initPageNo > 0) {
      this.initPageNo = initPageNo;
      this.storageService.removeItem('sale_index_page_no');
    }
    this.getAllCustomerList();

    this.cols = [
      { field: 'CustomerID', header: 'ID' },
      { field: 'sCompanyName', header: 'Company' },
      { field: 'FirstName', header: 'Customer' },
      { field: 'Address', header: 'Address' },
      { field: 'EmailAddress', header: 'Email' },
      { field: 'CurrentBalance', header: 'Current Balance' },
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }
  ngOnDestroy() : void { }
  emitAction(event : any) {
    this.storageService.setItem('sale_index_page_no', (event.curPageNo - 1));
    if (event.forLabel === 'Update') {
      this.Update(event.selectedRowData.CustomerID);
    }
    else if (event.forLabel === 'Discounts') {
      this.viewDiscounts(event.selectedRowData.CustomerID);
    }
    else if (event.forLabel === 'Delete') {
      this.Delete(event.selectedRowData);
    }
  }

  Update(id : any) {
    this.router.navigate(['/customer/addcustomer', id]);
  }
  viewDiscounts(id : any) {
    this.router.navigate(['/customer/customer-productdiscount', id]);

  }
  Delete(customer : any) {
    // this.confirmationService.confirm({
    //   message: 'Are you sure, you want to delete customer: ' + customer.FirstName + ' ' + customer.LastName + ' from system?',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     this.DeleteCustomer(customer.CustomerID);
    //   }

    // });
    this.confirmationService.confirm('Are you sure, you want to delete customer: ' + customer.FirstName + ' ' + customer.LastName + ' from system?').then(
      (confirmed) => {
        if(confirmed) {
          this.DeleteCustomer(customer.CustomerID);
        }
      }
    )
  }

  DeleteCustomer(id : any) {
    const param = {
      ID: id,
      RequestedUserID: this.usermodel.ID,
    };
    this.isLoadingData = true;
    this.apiService.DeleteCustomer(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoadingData = false;
      if (response.ResponseCode === 0) {
        // this.toastService.showSuccessToast('Success', response.ResponseText);
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.getAllCustomerList();
        this.cdr.detectChanges();
      }
      else {
        // this.toastService.showErrorToast('Error', response.ResponseText);
        this.toastService.showErrorToast('Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    });
  }

  getAllCustomerList() {

    const filterRequestModel = new FilterRequestModel();
    if(this.usermodel.IsReseller){
      filterRequestModel.IsReseller = true;
      filterRequestModel.ResellerID = this.usermodel.ID;
    }
    else
    {
      filterRequestModel.IsReseller = false;
      filterRequestModel.ResellerID = 0;
    }
    this.isLoadingData = true;
    this.apiService.GetAllbyFilter(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoadingData = false;
      if (response.ResponseCode === 0) {
        this.AllCustomerlist = response.AllCustomerList;
        this.totalRecords = response.AllCustomerList.length;
        this.cdr.detectChanges()
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    });
  }

  AddCustomer() {
    this.router.navigate(['/customer/addcustomer', 0]);
  }
  AddMultipleCustomer() {
    this.AttachDocumentPopDisplay = true;
    this.openModalFileUploader();
  }
  myUploader(event : any) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
    let base64textString : IImageModel = {
      Base64String: '',
      Extention: ''
    };
    this.Customers = [];
    // event.files == files to upload
    this.file = event.files[0];
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const arraylist: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      for (const item of arraylist) {
        const model: any = {
          ID: 0,
          ClientID:0,
          CustomerID:0,
          FirstName: item['First Name'],
          LastName: item['Last Name'],
          EmailAddress: item['Email'],
          PhoneNo: item['PhoneNo'],
          Mobile: item['Mobile'],
          sFax: item['Fax'],
          sCompanyName: item['sCompanyName'],
          Website: item['Website'],
          dCreditLimit: Number(item['Credit Limit']),
          dOpeningBalance: Number(item['Opening Balance']),
          ShippingMethodID: Number(item['Shipping MethodID']),
          ClientSourceID: Number(item['Client SourceID']),
          DiscountGroupID: Number(item['Discount GroupID']),
          sRemarks: item['Remarks'] ? undefined : '',
          PostalCode: item['Postal Code'] ? undefined : '',
          Address: item['Street Address'],
          VATNumber: item['VATNumber'],
          sTaxNo: item['Tax Number'],
          sSalesTax: item['SalesTax'],
          BankAccountNo: item['Bank Account Number'],
          BICCode: item['BIC Code'],
          BankAccountDescription: item['BankAccount Description'],
          CityID: Number(item['CityID']),
          DeliveryPersonID: Number(item['DeliveryPersonID'] ? undefined : 0),
          Attachments : base64textString,
          CreatedByUserIDForCustomer:this.usermodel.ID,
        };
        if (model.ShippingMethodID === 0) {
          model.ShippingMethodID = null;
        }
        if (model.ClientSourceID === 0) {
          model.ClientSourceID = null;
        }
        if (model.DiscountGroupID === 0) {
          model.DiscountGroupID = null;
        }
        if (model.CityID === 0) {
          model.CityID = null;
        }
        if (model.DeliveryPersonID === 0) {
          model.DeliveryPersonID = null;
        }
        this.Customers.push(model);

      }
      ;
      const param = { Customers: this.Customers };
      this.isLoadingData = true;
      this.apiService.AddMultipleCustomer(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
        this.isLoadingData = false;
        if (response.ResponseCode === 0) {
          this.AttachDocumentPopDisplay = false;
          
          this.modalFileUploaderComponent.close();
          // this.toastService.showSuccessToast('Success', response.ResponseText);
          this.toastService.showSuccessToast('Success',  response.ResponseText);
          this.getAllCustomerList();

        }
        else {
          // this.toastService.showErrorToast('Error', response.ResponseText);
          this.toastService.showErrorToast('Error',  response.ResponseText);
        }
      });
    };
  }
  UpdateCustomerStatus(customer: any) // Update Cash Register Status Method To Communicate API
  {
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = customer.CustomerID;
    this.updateStatusModel.Status = !customer.IsActiveForCustomer;
    this.updateStatusModel.UpdatedByUserID = this.usermodel.ID;
    this.isLoadingData = true;
    this.apiService.UpdateCustomerStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoadingData = false;
      if (response.ResponseCode === 0) {
        // this.toastService.showSuccessToast('Success', response.ResponseText);
        this.toastService.showSuccessToast('Success',  response.ResponseText);
        this.getAllCustomerList();
      }
      else {
        // this.toastService.showErrorToast('Error', response.ResponseText);
        this.toastService.showErrorToast('Error',  response.ResponseText);
      }
    });
  }
  // exportPdf() {

  //   const doc = new jsPDF();
  //   autoTable(doc, {
  //     head: this.exportColumns,
  //     body: this.AllCustomerlist
  //   });
  //   doc.save('SupplierInvoice.pdf');
  //   // import('jspdf').then(jsPDF => {
  //   //     import('jspdf-autotable').then((x: any) => {
  //   //         const doc = new jsPDF.default('p', 'pt');
  //   //         doc.autoTable(this.exportColumns, this.AllInvoicelist);
  //   //         doc.save('products.pdf');
  //   //     })
  //   // })
  // }

  // exportExcel() {
  //   import('xlsx').then(xlsx => {
  //     const worksheet = xlsx.utils.json_to_sheet(this.AllCustomerlist);
  //     const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
  //     this.saveAsExcelFile(excelBuffer, 'SupplierInvoice');
  //   });
  // }

  // saveAsExcelFile(buffer: any, fileName: string): void {
  //   import('file-saver').then(FileSaver => {
  //     const EXCELTYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //     const EXCELEXTENSION = '.xlsx';
  //     const data: Blob = new Blob([buffer], {
  //       type: EXCELTYPE
  //     });
  //     FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCELEXTENSION);
  //   });
  // }
  
  async openModalFileUploader() {
    return await this.modalFileUploaderComponent.open();
  }
}

