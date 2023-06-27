import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
// //import { Table } from 'primeng/table';
// import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { UpdateStatus } from 'src/app/Helper/models/UpdateStatus';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { ActivatedRoute, Router } from '@angular/router';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { StorageService } from 'src/app/shared/services/storage.service';
import { SupplierPermissionEnum } from 'src/app/shared/constant/supplier-permission';
import { ConfirmationService } from 'src/app/Service/confirmation.service';

@Component({
  selector: 'app-supplier-payments',
  templateUrl: './supplier-payments.component.html',
  styleUrls: ['./supplier-payments.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class SupplierPaymentsComponent implements OnInit, OnDestroy {

  // 
  AllSupplierlist: any[] = [];
  supplierPermission = SupplierPermissionEnum ;
  selectedSupplier : any;
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
  isLoadingData: boolean = true;

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Payments', icon: 'fas fa-money-bill', dependedProperty: 'SupplierID' },
    { label: 'Leadger', icon: 'fas fa-money-bill', dependedProperty: 'SupplierID' },
  ];
  columns: Columns[] = [
    // tslint:disable-next-line: max-line-length
    { field: 'FirstName', secondfield: 'LastName', header: 'Customer', sorting: 'FirstName', placeholder: '', type: TableColumnEnum.COMBINED_COLUMN, translateCol: 'SSGENERIC.CUSTOMER' },
    { field: 'sCompanyName', header: 'Company', sorting: 'sCompanyName', placeholder: '', translateCol: 'SSGENERIC.COMPANY' },
    // tslint:disable-next-line: max-line-length
    { field: 'Address', secondfield: 'City', header: 'Address', sorting: 'FirstName', placeholder: '', type: TableColumnEnum.COMBINED_COLUMN, translateCol: 'SSGENERIC.ADDRESS' },
    { field: 'PhoneNo', header: 'PhoneNo', sorting: 'PhoneNo', placeholder: '' , translateCol: 'SSGENERIC.PHONENO'},
    // tslint:disable-next-line: max-line-length
    { field: 'CurrentBalance', header: 'Current Balance', sorting: 'CurrentBalance', placeholder: '', type: TableColumnEnum.BALANCE_COLUMN, translateCol: 'SSGENERIC.CURRENTB' },
  ];

  globalFilterFields = ['sCompanyName', 'FirstName', 'LastName', 'Address', 'City', 'CurrentBalance'];
  rowsPerPageOptions = [10, 20, 50, 100];
  initPageNo = 0;

  constructor(
    private apiService: vaplongapi, 
    private datepipe: DatePipe, 
    private router: Router, 
    private storageService: StorageService,
    private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    const initPageNo = this.storageService.getItem('supplier_payments_page_no');
    if(initPageNo > 0) {
      this.initPageNo = initPageNo;
      this.storageService.removeItem('supplier_payments_page_no');
    }
    this.usermodel = this.storageService.getItem('UserModel');
    this.getAllSupplierList();

    this.cols = [
      { field: 'SupplierID', header: 'ID' },
      { field: 'sCompanyName', header: 'Company' },
      { field: 'FirstName', header: 'Supplier' },
      { field: 'EmailAddress', header: 'Email' },
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  ngOnDestroy(): void { }
  emitAction(event : any) {
    this.storageService.setItem('supplier_payments_page_no', (event.curPageNo - 1));
    if (event.forLabel === 'Payments') {
      this.OpenSupplierPayments(event.selectedRowData.SupplierID);
    }
    else if (event.forLabel === 'Leadger') {
      this.ViewLedger(event.selectedRowData);
    }

  }
  OpenSupplierPayments(id : any) {
    this.router.navigate(['/supplier/supplier-openinvoices', id]);
  }

  ViewLedger(supplier : any) {
    this.router.navigate(['/supplier/supplier-ledger', supplier.SupplierID, supplier.sCompanyName]);

  }
  AddPaymentNew() {
    this.router.navigate(['/supplier/payments-new']);
  }
  getAllSupplierList() {

    this.isLoadingData = true;
    this.apiService.GetAllSupplier().pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoadingData = false;
      if (response.ResponseCode === 0) {

        if (this.usermodel.OutletID === 11) {
          const list = response.AllSupplierList.filter((x : any) => x.CityID === 13);
          this.AllSupplierlist = list;
          this.totalRecords = list.length;
        }
        else {
          this.AllSupplierlist = response.AllSupplierList;
          this.totalRecords = response.AllSupplierList.length;
        }

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



  exportPdf() {

    const doc = new jsPDF();
    autoTable(doc, {
      head: this.exportColumns,
      body: this.AllSupplierlist
    });
    doc.save('SupplierInvoice.pdf');
    // import("jspdf").then(jsPDF => {
    //     import("jspdf-autotable").then((x : any) => {
    //         const doc = new jsPDF.default('p', 'pt');
    //         doc.autoTable(this.exportColumns, this.AllInvoicelist);
    //         doc.save('products.pdf');
    //     })
    // })
  }

  exportExcel() {
    // import('xlsx').then(xls(x : any) => {
    //   const worksheet = xlsx.utils.json_to_sheet(this.AllSupplierlist);
    //   const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //   const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //   this.saveAsExcelFile(excelBuffer, 'SupplierInvoice');
    // });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    // import('file-saver').then(FileSaver => {
    //   const EXCELTYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    //   const EXCELEXTENSION = '.xlsx';
    //   const data: Blob = new Blob([buffer], {
    //     type: EXCELTYPE
    //   });
    //   FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCELEXTENSION);
    // });
  }

}

