import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { datefilter } from 'src/app/Helper/datefilter';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';


import { ConfirmationService } from 'src/app/Service/confirmation.service';
import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: 'app-salereport-byuser',
  templateUrl: './salereport-byuser.component.html',
  styleUrls: ['./salereport-byuser.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class SalereportByuserComponent implements OnInit, OnDestroy {
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
  selectedSale: any;
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
  displaySalePopup = false;

  valCheck = '';
  ProductSearch = '';
  selectedUserID: any;

  Quantity: any;
  Remarks: any;
  UserDropdown: any[];

  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'dd/MM/YYYY   HH:MM ') ?? "" + "Z";
  toDate = this.datepipe.transform(new Date(), 'dd/MM/YYYY   HH:MM ') ?? "" + "Z";


  genericMenuItems: GenericMenuItems[] = [];
  columns: Columns[] = [

    { field: 'User', header: 'User', sorting: 'User', placeholder: '', translateCol: 'SSGENERIC.USER' },
    {
      field: 'TotalSaleExcludedTax', header: 'Total Sale', sorting: 'TotalSaleExcludedTax', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.TOTALSALE'
    },
    {
      field: 'TotalRefunds', header: 'Refund Quantity', sorting: 'TotalRefunds', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.REFUNDQUANTITY'
    },
    { field: 'COGS', header: 'COGS', sorting: 'COGS', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.COGS' },
    {
      field: 'COGS_Refund', header: 'COGS Refund', sorting: 'COGS_Refund', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.COGSREFUND'
    },
    {
      field: 'GrossProfit', header: 'Gross Profit', sorting: 'GrossProfit', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.GROSSPROFIT'
    },

  ];

  globalFilterFields = ['User', 'TotalSaleExcludedTax', 'TotalRefunds', 'COGS', 'COGS_Refund', 'GrossProfit'];
  rowsPerPageOptions = [10, 20, 50, 100];
  usermodel: any;

  isLoadingData = false;

  constructor(
    private apiService: vaplongapi,  
    private storageService: StorageService,
    private datepipe: DatePipe,
    private cdr: ChangeDetectorRef) {
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Sale Report User Wise`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {
    this.GetSearchByDateDropDownList();
    this.GetUserDropDownList(); // Get All User List On Page Load for Dropdown


    this.cols = [
      { field: 'Customer', header: 'Customer' },
      { field: 'dTotalSaleValue', header: 'Sale Amount' },
      { field: 'CreatedAt', header: 'Date' },
      { field: 'sRemarks', header: 'Remarks' },

    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  ngOnDestroy(): void {
  }
  emitAction(event: any) {

  }

  GetUserDropDownList() {
    this.IsSpinner = true;
    this.UserDropdown = [];
    this.apiService.GetUsersForDropdown().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        
        // this.UserDropdown.push({
        //   value: 0,
        //   label: 'All',
        // });
        for (const item of response.DropDownData) {
          this.UserDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        this.selectedUserID = response.DropDownData[0].ID;

        this.getAllSaleList(this.selectedUserID, 0);
      }
      else {
        console.log('internal serve Error', response);
      }
      this.IsSpinner = false;
      this.cdr.detectChanges();
    }
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
    // this.SearchByDateDropdown.push({value:'6',label: 'All'});
    this.SearchByDateDropdown.push({ value: '7', label: 'Custom' });
    this.selectedSearchByDateID = '0';

  }
  SearchByDate(event: any) {
    if (event === '7') {
      this.isCustomDate = true;
      this.datepickerModalComponent.open();
    }
    else {
      this.getAllSaleList(this.selectedUserID, this.selectedSearchByDateID);
    }
  }
  RefreshReport() {
    this.getAllSaleList(this.selectedUserID, this.selectedSearchByDateID);
  }
  onChangeUser(event: any) {
    this.getAllSaleList(event.value, this.selectedSearchByDateID);
  }
  onChangeDate(event: any) {
    this.getAllSaleList(this.selectedUserID, event);
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.datepickerModalComponent.close();
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.getAllSaleList(this.selectedUserID, 7);
    // console.log(this.fromDate);
  }
  getAllSaleList(userid: any, dateId: any) {
    this.isLoadingData = true;
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss')?? + + "Z");
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = 0;
    filterRequestModel.PageSize = 10000;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.UserID = Number(userid);
    dateId = Number(dateId);

    if (dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(dateId);
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
      filterRequestModel.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    }
    else {
      filterRequestModel.IsGetAll = false;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
      filterRequestModel.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    }
    this.apiService.GetSaleReportOfUsersByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.AllSalelist = response.SaleReportByUsersItemModelList;
        this.totalRecords = response.SaleReportByUsersItemModelList.length;
        this.IsSpinner = false;

      }
      else {
        console.log('internal server error ! not getting api data');
      }
      this.isLoadingData = false;
      this.cdr.detectChanges();
    },
    );
  }




  exportPdf() {

    const doc = new jsPDF();
    autoTable(doc, {
      head: this.exportColumns,
      body: this.AllSalelist
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
      const worksheet = xlsx.utils.json_to_sheet(this.AllSalelist);
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


