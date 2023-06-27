import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WishlistModel } from 'src/app/Helper/models/WishlistModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';

import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { isNullOrUndefined } from 'src/app/Helper/global-functions';
import { DatePipe } from '@angular/common';
import { datefilter } from 'src/app/Helper/datefilter';


@Component({
  selector: 'app-supplier-life-line-report',
  templateUrl: './supplier-life-line-report.component.html',
  styleUrls: ['./supplier-life-line-report.component.scss'],
  providers: [DatePipe]
})

export class SupplierLifeLineReportComponent implements OnInit, OnDestroy {
  @ViewChild('btn_open_modal_suppliers') btn_open_modal_suppliers: ElementRef;
  AllInternalOrderList: WishlistModel[] = [];
  selectedInternalOrder: WishlistModel;
  public internalOrder: WishlistModel;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedProductID = '';
  Products: any[];
  filteredSupplier: any[] = [];
  selectedProduct: any;
  Quantity: any;
  Remarks: any;
  items: any[];
  ProductDropdown: any[];
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 10;
  
  totalRecords = 0;

  usermodel: UserModel;
  displayDialog = false;
  DialogRemarks = '';

  openInvoicesTotalRecords = 0;
  purchaseTotalRecords = 0;

  filterModel = {
    PageNo: 0,
    PageSize: 10,
    Product: '',
  };
  isFirstTime = true;
  genericMenuItems: GenericMenuItems[] = [];

  supplierColumns: Columns[] = [
    // { field: 'IsActiveForSupplier', header: 'Status', sorting: '', placeholder: '',type: TableColumnEnum.TOGGLE_BUTTON },
    { field: 'SupplierID', header: 'ID', sorting: 'SupplierID', placeholder: '', translateCol: 'SSGENERIC.ID' },
    { field: 'sCompanyName', header: 'Company', sorting: 'sCompanyName', placeholder: '', translateCol: 'SSGENERIC.COMPANY' },
    {
      field: 'FirstName', secondfield: 'LastName', header: 'Supplier', sorting: 'FirstName', placeholder: '',
      type: TableColumnEnum.COMBINED_COLUMN, translateCol: 'SSGENERIC.SUPPLIER'
    },
    {
      field: 'Address', secondfield: 'City', header: 'Address', sorting: 'FirstName', placeholder: '',
      type: TableColumnEnum.COMBINED_COLUMN, translateCol: 'SSGENERIC.ADDRESS'
    },
    { field: 'EmailAddress', header: 'Email', sorting: 'EmailAddress', placeholder: '', translateCol: 'SSGENERIC.EMAIL' },
    {
      field: 'CurrentBalance', header: 'Current Balance', sorting: 'CurrentBalance', placeholder: '',
      type: TableColumnEnum.BALANCE_COLUMN, translateCol: 'SSGENERIC.CURRENTB'
    },
  ];

  globalFilterFields = ['sCompanyName', 'FirstName', 'LastName', 'Address', 'City', 'CurrentBalance'];
  
  rowGroup: RowGroup = {
    property: 'PurchaseDate',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  
  purchaseColumn: Columns[] = [
    { field: 'ID', header: 'Invoice No', sorting: 'ID', placeholder: '', type: TableColumnEnum.REDIRECTION_COLUMN, translateCol: 'SSGENERIC.INVOICENO' },
    { field: 'PurchaseDate', header: 'Date', sorting: 'PurchaseDate', placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DATE' },
    {
      field: 'dTotalPurchaseValue', header: 'Invoice Amount', sorting: 'dTotalPurchaseValue', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.INVOICEAMOUNT'
    },
    {
      field: 'dTotalPaidValue', header: 'Paid Amount', sorting: 'dTotalPaidValue', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.PAIDAMOUNT'
    },
  ];
  purchaseInitialColumn = ['ID', 'PurchaseDate', 'dTotalPurchaseValue', 'dTotalPaidValue'];
  PurchaseGlobalFilterFields = ['ID', 'PurchaseDate', 'dTotalPurchaseValue', 'dTotalPaidValue'];
  
  loadingPurchase = false;

  topProductColumn: Columns[] = [
    { field: 'SKU', header: 'SKU', sorting: 'SKU', placeholder: '', translateCol: 'SSGENERIC.SKU' },
    { field: 'Product', header: 'Name', sorting: 'Product', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Quantity', header: 'Quantity', sorting: 'Quantity', placeholder: '', translateCol: 'SSGENERIC.QUANTITY' },
  ];
  topProductGlobalFilterFields = ['SKU', 'Product', 'Quantity'];
  
  rowGroup1: RowGroup = {
    property: 'DueDate',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  openPaymentColumn: Columns[] = [
    // type: TableColumnEnum.REDIRECTION_COLUMN,
    {
      field: 'PurchaseID', header: 'Invoice No', sorting: 'PurchaseID', placeholder: '',
       translateCol: 'SSGENERIC.INVOICENO'
    },
    { field: 'DueDate', header: 'Due Date', sorting: 'DueDate', placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DUEDATE' },
    { field: 'dTotalAmount', header: 'Total', sorting: 'dTotalAmount', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.TOTAL' },
    { field: 'dPaidAmount', header: 'Paid', sorting: 'dPaidAmount', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.PAID' },
    {
      field: 'dRemainingAmount', header: 'Remaining', sorting: 'dRemainingAmount', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.REMAINING'
    },
  ];
  loadingOpenPayments = false;
  openPaymnetInitialColumn = ['PurchaseID', 'DueDate', 'dTotalAmount', 'dPaidAmount', 'dRemainingAmount'];
  openPaymentGlobalFilterFields = ['PurchaseID', 'DueDate', 'dTotalAmount', 'dPaidAmount', 'dRemainingAmount'];

  rowsPerPageOptions = [10, 20, 50, 100];
  
  rowGroup2: RowGroup = {
    property: 'PerformedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  activityColumns: Columns[] = [
    { field: 'Action', header: 'Action', sorting: 'Action', placeholder: '' , translateCol: 'SSGENERIC.ACTION'},
    { field: 'PerformedAt', header: 'Activity Date', sorting: 'PerformedAt', placeholder: '', type: TableColumnEnum.DATE_FORMAT , translateCol: 'SSGENERIC.ACTIVITYDATE'},
    { field: 'User', header: 'User', sorting: 'User', placeholder: '', translateCol: 'SSGENERIC.USER' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' }
  ];
  activityInitialColumn = ['Action', 'PerformedAt', 'User', 'Description'];
  activityGlobalFilterFields = ['Action', 'PerformedAt', 'User', 'Description'];
  loadingActivity = false;

  allActivity: any=[];
  activityTotalRecords: any = 0;
  
  dataFunc: any = customSearchFn;
  ProductData: any = [];
  displaySupplierDialog = false;
  productHistory: any = {};
  Purchases: any = [];
  supplierDropdown: any[];
  AllSuppliersList: any[] = [];
  selectedSupplier: { value: any; label: any; };
  lifeLineSupplier: any = {};
  orderCount: any;
  bestOrder: any;
  openPayments: any[] = [];
  TopProducts: any[] = [];
  loadingTopProducts = false;
  lastOrderOn: any;
  selectedShippingMethod: any = {};
  constructor(
    private apiService: vaplongapi, 
    public router: Router,
    private datepipe: DatePipe, 
    private storageService: StorageService,
    private cdr: ChangeDetectorRef) {
      this.storageService.setItem('PurchaseDetailRoute', this.router.url);
      this.usermodel = this.storageService.getItem('UserModel');
          const obj = {
            Action: 'View',
            Description: `View Supplier Lifeline Report`,
            PerformedAt: new Date().toISOString(),
            UserID: this.usermodel.ID
        }
        this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {

    this.usermodel = this.storageService.getItem('UserModel');;
    this.GetSuppliersDropDownLists(); // Get All ProductVariant List On Page Load for Dropdown
  }

  GetSupplierDetailHistoryReport() {
    const obj = {
      ID: this.selectedSupplier.value
    };
    this.loadingTopProducts = true;
    this.apiService.GetSupplierDetailHistoryReportDetailsOnly(obj).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.loadingTopProducts = false;
      if (response.ResponseCode === 0) {
        this.lifeLineSupplier = response.Supplier;
        this.orderCount = response.OrderCount;
        this.bestOrder = response.BestOrder;
        this.lastOrderOn = response.LastOrderOn;
        //this.openPayments = response.AllSupplierOpenInvoices;
        //this.Purchases = response.Purchases;
        this.TopProducts = response.TopProducts;
        this.GetshippingMethodByID(this.lifeLineSupplier.ShippingMethodID);

      }
      this.cdr.detectChanges();

    });
  }
  GetAllOpenInvoicesDataWithLazyLoadinFunction(filterRM: any) {
    if (this.isFirstTime) { return; }
    const filterRequestModel = new FilterRequestModel();  
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.ID = this.selectedSupplier.value;
    this.storageService.setItem('SingleSupplierLifeLineOpenInvoicesValues', filterRequestModel);
    this.loadingOpenPayments = true;
    this.apiService.GetSupplierDetailHistoryReportOpenInvoicesOnly(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      this.loadingOpenPayments = false;
      if (response1.ResponseCode === 0) {
         this.openPayments = response1.AllSupplierOpenInvoices;
        this.openInvoicesTotalRecords = response1.OrderCount;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
      this.cdr.detectChanges();
    });
  }

  GetAllPurchaseDataWithLazyLoadinFunction(filterRM: any) {

    if (this.isFirstTime) { return; }
    const filterRequestModel = new FilterRequestModel();  
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.ID = this.selectedSupplier.value;
    this.storageService.setItem('SingleSupplierLifeLinePurchasesValues', filterRequestModel);
    this.loadingPurchase = true;
    this.apiService.GetSupplierDetailHistoryReportPurchasesOnly(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      
      this.loadingPurchase = false;
      if (response1.ResponseCode === 0) {
         this.Purchases = response1.Purchases;
        this.purchaseTotalRecords = response1.OrderCount;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
      this.cdr.detectChanges();
    });
  }
  GetshippingMethodByID(id: any) {
    if (isNullOrUndefined(id)) { return;}
    const obj = {
      ID: id
    };
    this.IsSpinner = true;
    this.apiService.GetshippingMethodByID(obj).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseCode === 0) {
        this.selectedShippingMethod = response.ShippingMethodModel;
      }
      this.cdr.detectChanges();
    });
  }
  getPurchasesByInvoiceNo(event: any) {
    this.storageService.setItem('SingleSupplierLifeLineRedirect', true);
    this.router.navigate([`/purchase/details/${event.ID}`]);
  }

  getSalesByInvoiceNo(event: any) {
    this.storageService.setItem('SingleSupplierLifeLineRedirect', true);
    this.router.navigate([`/sale/sale-detail/${event.ID}`]);
  }
  ngOnDestroy(): void {

  }

  GetSuppliersDropDownLists() {
    this.supplierDropdown = [];
    this.IsSpinner = true;
    this.apiService.GetAllSupplier().pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseText === 'success') {
        for (const item of response.AllSupplierList) {
          this.supplierDropdown.push({
            value: item.SupplierID,
            label: item.sCompanyName,
          });
        }
        if (this.supplierDropdown.length > 0) {
        }
        this.filteredSupplier = this.supplierDropdown;
        this.AllSuppliersList = response.AllSupplierList;
        this.totalRecords = response.AllSupplierList.length;

        let Redirection = this.storageService.getItem('SingleSupplierLifeLineRedirect') ;
        if (Redirection) {
          this.storageService.removeItem('SingleSupplierLifeLineRedirect');
          this.isFirstTime = false;
          let filtervalues = this.storageService.getItem('SingleSupplierLifeLineOpenInvoicesValues');
          let supplierValues = this.filteredSupplier.filter(x => x.value == filtervalues.ID)[0];
          this.selectedSupplier =  {
           value: supplierValues.value,
           label: supplierValues.label          
         }

          this.GetSupplierDetailHistoryReport();
          this.filterModel.PageNo = filtervalues.PageNo;
          this.filterModel.PageSize = filtervalues.PageSize;
          this.GetAllOpenInvoicesDataWithLazyLoadinFunction(this.filterModel);

          
          let filtervalues1 = this.storageService.getItem('SingleSupplierLifeLinePurchasesValues');
          this.filterModel.PageNo = filtervalues1.PageNo;
          this.filterModel.PageSize = filtervalues1.PageSize;
          this.GetAllPurchaseDataWithLazyLoadinFunction(this.filterModel);
          
        }
      } else {
        console.log('internal serve Error', response);
      }
      this.cdr.detectChanges();
    });
  }
  GetAllActivityDataWithLazyLoadinFunction(filterRM: any) {
    if (this.isFirstTime) { return; }
    const filterRequestModel = new FilterRequestModel();
    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = true;
    filterRequestModel.IsReceived = true;
    filterRequestModel.Type = 3;
    filterRequestModel.ID = this.selectedSupplier.value
    filterRequestModel.Product = filterRM.Product;
    filterRequestModel.UserID = 0;
    this.loadingActivity = true;
    this.apiService.GetAllActivityByFilterForLifeLineReports(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      this.loadingActivity = false;
      if (response1.ResponseCode === 0) {
        this.allActivity = response1.GetAllActivityLogs;
        this.activityTotalRecords = response1.TotalRecords;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
      this.cdr.detectChanges();
    });
  }

  OpenOrderByDialog() {
    this.displaySupplierDialog = true;
    this.btn_open_modal_suppliers.nativeElement.click();
  }
  selectValue(newValue: any) {
    if (newValue != null) {
      this.selectedSupplier = {
        value: newValue.value ? newValue.value : newValue.SupplierID,
        label: newValue.label ? newValue.label : newValue.sCompanyName,
      };
      this.GetSupplierDetailHistoryReport();
      this.isFirstTime = false;
      this.GetAllOpenInvoicesDataWithLazyLoadinFunction(this.filterModel);
      this.GetAllPurchaseDataWithLazyLoadinFunction(this.filterModel);
      this.GetAllActivityDataWithLazyLoadinFunction(this.filterModel);
     
      if(this.displaySupplierDialog)
        this.btn_open_modal_suppliers.nativeElement.click();
        
      this.displaySupplierDialog = false;

    }
  }
}

