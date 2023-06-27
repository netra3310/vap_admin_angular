import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { datefilter } from 'src/app/Helper/datefilter';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';

import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';


@Component({
  selector: 'app-salereport-bysubcategory',
  templateUrl: './salereport-bysubcategory.component.html',
  styleUrls: ['./salereport-bysubcategory.component.scss'],
  providers: [DatePipe]

})
export class SalereportBysubcategoryComponent implements OnInit, OnDestroy {
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
  ProductDropDownInfoList: any[];
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
  subCategorySearch = '';
  selectedSubCategoryID = '';
  SubCategorys: any[];
  filteredSubCategory: any[];
  selectedSubCategory: any;
  Quantity: any;
  Remarks: any;
  SubCategoryDropdown: any[];

  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z";
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z";


  genericMenuItems: GenericMenuItems[] = [];
  columns: Columns[] = [
    { field: 'SubCategoryName', header: 'SubCategory', sorting: 'SubCategoryName', placeholder: '', translateCol: 'SSGENERIC.SUBCATEGORY' },
    { field: 'SaleQuantity', header: 'Sale Quantity', sorting: 'SaleQuantity', placeholder: '', translateCol: 'SSGENERIC.SALEQUANTITY' },
    { field: 'RefundQuantity', header: 'Refund Quantity', sorting: 'RefundQuantity', placeholder: '', translateCol: 'SSGENERIC.REFUNDQUANTITY' },
    { field: 'TotalSale', header: 'Total Sale', sorting: 'TotalSale', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.TOTALSALE' },
    {
      field: 'TotalRefund', header: 'Total Refund', sorting: 'TotalRefund', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.TOTALREFUND'
    },

  ];

  globalFilterFields = ['SubCategoryName', 'SaleQuantity', 'TotalSale', 'RefundQuantity', 'TotalRefund'];
  rowsPerPageOptions = [10, 20, 50, 100];
  dataFunc: any = customSearchFn;
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
      Description: `View Sale Report Sub-Category Wise`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {
    this.GetSearchByDateDropDownList();
    this.GetSubCategoryDropDownList(); // Get All GetSubCategoryList List On Page Load for Dropdown


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


  GetSubCategoryDropDownList() {

    this.SubCategorys = [];
    this.IsSpinner = true;
    this.apiService.GetSubCategoriesForDropDown().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.SubCategorys.push({
          value: 0,
          label: 'All',
        });
        this.selectedSubCategory = this.SubCategorys[0];
        for (const item of response.DropDownData) {
          this.SubCategorys.push({
            value: item.ID,
            label: item.Name,
          });
        }
        this.filteredSubCategory = this.SubCategorys;
        this.getAllSaleList(this.selectedSubCategory.value, 6);
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
      
      this.getAllSaleList(this.selectedSubCategory.value, Number(this.selectedSearchByDateID));
    }
  }
  RefreshReport(event: any, iscategory: any) {
    if (event) {
      if (iscategory) {
        this.selectedSubCategory = event;
      } else {
        this.selectedSearchByDateID = event;
      }
     
        this.getAllSaleList(this.selectedSubCategory.value, Number(this.selectedSearchByDateID));
      
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.datepickerModalComponent.close();
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.getAllSaleList(this.selectedSubCategory, 7);
    // console.log(this.fromDate);
  }
  getAllSaleList(subCategoryID: any, dateId: any) {
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    filterRequestModel.PageNo = 0;
    filterRequestModel.PageSize = 10000;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.SubCategoryID = Number(subCategoryID);
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
    this.isLoadingData = true;
    this.apiService.GetSaleReportOfSubCategoryByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        const newlist = response.SaleReportOfSubCategoryItemModelList.filter((x: any) => x.SaleQuantity > 0);
        this.AllSalelist = newlist;
        this.totalRecords = newlist.length;

      }
      else {
        console.log('internal server error ! not getting api data');
      }
      this.isLoadingData = false;
      this.cdr.detectChanges();
    },
    );
  }

  search(event: any) {
    const filtered: any[] = [];
    const query = event.query;
    for (const item of this.SubCategorys) {
      const subCategory = item;

      if (subCategory.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(subCategory);
      }
    }
    this.filteredSubCategory = filtered;
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

