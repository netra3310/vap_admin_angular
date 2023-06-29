import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
// import { Table } from 'primeng/table';
// import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { WishlistModel } from 'src/app/Helper/models/WishlistModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { isNullOrUndefined } from 'src/app/Helper/global-functions';
import { DatePipe } from '@angular/common';

type Tabs = 'purchases' | 'dirty' | 'logs';

@Component({
  selector: 'app-single-product-life-line',
  templateUrl: './single-product-life-line.component.html',
  styleUrls: ['./single-product-life-line.component.scss'],
  providers: [DatePipe]
})

export class SingleProductLifeLineComponent implements OnInit, OnDestroy {
  AllInternalOrderList: WishlistModel[] = [];
  selectedInternalOrder: WishlistModel;
  public internalOrder: WishlistModel;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedProductID = '';
  Products: any[];
  filteredProduct: any[];
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
  rows = 25;
  // last = 25;
  totalRecords = 0;
  saleTotalRecords = 0;
  purchaseTotalRecords = 0;
  filterModel = {
    PageNo: 0,
    PageSize: 25,
    Product: '',
  };
  usermodel: UserModel;
  displayDialog = false;
  DialogRemarks = '';

  productsColumn: Columns[] = [
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' , translateCol: 'SSGENERIC.PRODUCT'},
    { field: 'Color', header: 'Color', sorting: 'Color', placeholder: '', translateCol: 'SSGENERIC.COLOR' },
    { field: 'PurchasePrice', header: 'PurchasePrice', sorting: 'PurchasePrice', placeholder: '', translateCol: 'SSGENERIC.PURCHASEP' }
  ];
  rowGroup: RowGroup = {
    property: 'Date',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  purchaseColumns: Columns[] = [
    { field: 'ID', header: 'Order No', sorting: 'ID', placeholder: '', type: TableColumnEnum.REDIRECTION_COLUMN, translateCol: 'SSGENERIC.ORDERNO' },
    { field: 'Supplier', header: 'Supplier', sorting: 'Supplier', placeholder: '' , translateCol: 'SSGENERIC.SUPPLIER'},
    { field: 'Date', header: 'Date', sorting: 'Date', placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DATE'},
    { field: 'Quantity', header: 'Quantity', sorting: 'Quantity', placeholder: '', translateCol: 'SSGENERIC.QUANTITY'},

  ];
  initialCoulumsPurchases = ['ID', 'Supplier', 'Date', 'Quantity'];
  rowGroup1: RowGroup = {
    property: 'Date',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  saleColumn: Columns[] = [
    { field: 'ID', header: 'Order No', sorting: 'ID', placeholder: '', type: TableColumnEnum.REDIRECTION_COLUMN, translateCol: 'SSGENERIC.ORDERNO' },
    { field: 'Customer', header: 'Customer', sorting: 'Customer', placeholder: '', translateCol: 'SSGENERIC.CUSTOMER'},
    { field: 'Date', header: 'Date', sorting: 'Date', placeholder: '' ,type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DATE'},
    { field: 'Quantity', header: 'Quantity', sorting: 'Quantity', placeholder: '', translateCol: 'SSGENERIC.QUANTITY'},

  ];

  initialCoulumsSales = ['ID', 'Customer', 'Date', 'Quantity'];
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

  initialCoulumsAllActivity = ['Action', 'PerformedAt', 'User', 'Description'];
  activityGlobalFilterFields = ['Action', 'PerformedAt', 'User', 'Description'];

  purchaseGlobalFilterFields = "['ID','Supplier','Date']";
  saleGlobalFilterFields = "['ID','Customer','Date']";



  rowsPerPageOptions = [10, 20, 50, 100]
  genericMenuItems: GenericMenuItems[] = [];

  dataFunc: any = customSearchFn;
  ProductData: any = [];
  IsOpenProductDialog: boolean = false;
  productHistory: any = {};
  Purchases: any = [];
  Sales: any = [];
  allActivity: any=[];
  isFirstTime = true;

  activityTotalRecords: any = 0;
  fromDate: any = new Date();
  toDate: any = new Date();
  dateId: number;

  isLoadingProduct = false;
  isLoadingSales = false;
  isLoadingPurchases = false;
  isLoadingAllActivities = false;
  activeTab: Tabs = 'dirty';
  @ViewChild('btn_open_modal_products') btn_open_modal_products: ElementRef;
  constructor(
    private apiService: vaplongapi, 
    private activatedRoute: ActivatedRoute, 
    private datepipe: DatePipe, 
    public route: Router, 
    private storageService: StorageService,
    private cdr: ChangeDetectorRef) {
    
      this.storageService.setItem('PurchaseDetailRoute', this.route.url);
      this.storageService.setItem('SaleDetailRoute', this.route.url);
      this.usermodel = this.storageService.getItem('UserModel');
      const obj = {
        Action: 'View',
        Description: `View Product Lifeline Report`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {

    this.usermodel = this.storageService.getItem('UserModel');
    this.GetProductVariantDropDownList(); // Get All ProductVariant List On Page Load for Dropdown


  }
  GetProductDetailHistoryReport() {
    const obj = {
      ID: this.selectedProduct.value
    };
    this.apiService.GetProductDetailHistoryReportDetailsOnly(obj).pipe(untilDestroyed(this)).subscribe((response: any) => {
     this.productHistory = response;
     //this.Purchases = this.productHistory.Purchases;
     //this.Sales = this.productHistory.Sales;
    })
  }
  GetAllSaleDataWithLazyLoadinFunction(filterRM: any) {
    if (this.isFirstTime) { return; }
    const filterRequestModel = new FilterRequestModel();  
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.ID = this.selectedProduct.value;

    this.storageService.setItem('SingleProductLifeLineSaleValues', filterRequestModel);
    this.isLoadingSales = true;
    this.apiService.GetProductDetailHistoryReportSalesOnly(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
         this.Sales = response1.Sales;
        this.saleTotalRecords = response1.SaleQuantity;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
      this.isLoadingSales = false;
      this.cdr.detectChanges();
    });
  }

  Close() {
    this.storageService.setItem('LocationRedirectReturn', true);
    this.storageService.setItem('SingleProductLifeLifeSelectedProductID', { ID:this.selectedProduct.value });
    let callingRoute = this.storageService.getItem('SigleProductLifeLineRoute');
    if (isNullOrUndefined(callingRoute) || callingRoute == '') {
      this.route.navigate(['/dashboard']);
    }
    else {
      this.route.navigate([callingRoute]);
    }
  }
  
  GetAllPurchaseDataWithLazyLoadinFunction(filterRM: any) {

    if (this.isFirstTime) { return; }
    const filterRequestModel = new FilterRequestModel();  
    filterRequestModel.FromDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.ToDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = true;
    filterRequestModel.IsReceived = true;
    filterRequestModel.Type = 1;
    filterRequestModel.ID = this.selectedProduct.value
    filterRequestModel.Product = filterRM.Product;
    
    filterRequestModel.UserID = 0;

    // filterRequestModel.PageNo = filterRM.PageNo;
    // filterRequestModel.PageSize = filterRM.PageSize;
    // filterRequestModel.Product = filterRM.Product;
    // filterRequestModel.ID = this.selectedProduct.value;

    this.storageService.setItem('SingleProductLifeLinePurchaseValues', filterRequestModel);
    this.isLoadingPurchases = true;
    this.apiService.GetProductDetailHistoryReportPurchasesOnly(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
         this.Purchases = response1.Purchases;
        this.purchaseTotalRecords = response1.PurchaseQuantity;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
      this.isLoadingPurchases = false;
      this.cdr.detectChanges();
    });
  }

  getPurchasesByInvoiceNo(event: any) {
    this.storageService.setItem('SingleProductLifeLineRedirect', true);
    this.route.navigate([`/purchase/details/${event.ID}`]);
  }
  getSalesByInvoiceNo(event: any) {
    this.storageService.setItem('SingleProductLifeLineRedirect', true);
    this.route.navigate([`/sale/sale-detail/${event.ID}`])
  }
  ngOnDestroy(): void {

  }

  GetProductVariantDropDownList() {
    this.isLoadingProduct = true;
    this.Products = [];
    // this.apiService.GetProductDropDownDatawithVariantInfo().pipe(untilDestroyed(this)).subscribe((response: any) => {
    //   if (response.ResponseCode === 0) {
    //     this.selectedProductID = response.DropDownData[0].ProductVariantID;
    //     for (let i = 0; i < response.DropDownData.length; i++) {
    //       this.Products.push({
    //         value: response.DropDownData[i].ProductVariantID,
    //         label: response.DropDownData[i].ProducVariantName,
    //       });
    //     }
    this.apiService.GetPurchaseProduct().subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.ProductData = response.AllProductVariantList;
        for (let i = 0; i < response.AllProductVariantList.length; i++) {
          this.Products.push({
            value: response.AllProductVariantList[i].ID,
            label: response.AllProductVariantList[i].Product,
          });
        }
        this.filteredProduct = this.Products
        let Redirection = this.storageService.getItem('SingleProductLifeLineRedirect');
        if (Redirection) {         
          this.storageService.removeItem('SingleProductLifeLineRedirect');
          this.isFirstTime = false;

          let filtervalues = this.storageService.getItem('SingleProductLifeLineSaleValues');
          let productValues = this.filteredProduct.filter(x => x.value == filtervalues.ID)[0];
           this.selectedProduct =  {
            value: productValues.value,
            label: productValues.label
          }
          this.filterModel.PageNo = filtervalues.PageNo;
          this.filterModel.PageSize = filtervalues.PageSize;

          this.GetAllSaleDataWithLazyLoadinFunction(this.filterModel);
          let filtervalues1 = this.storageService.getItem('SingleProductLifeLinePurchaseValues');
          this.filterModel.PageNo = filtervalues1.PageNo;
          this.filterModel.PageSize = filtervalues1.PageSize;

          this.GetAllPurchaseDataWithLazyLoadinFunction(this.filterModel);
          this.GetProductDetailHistoryReport();
        }

        let LocationRedirection = this.storageService.getItem('SingleProductLifeLineLocationRedirect');
        if (LocationRedirection) {         
          this.storageService.removeItem('SingleProductLifeLineLocationRedirect');
          this.isFirstTime = false;
          let filtervalues = this.storageService.getItem('SingleProductLifeLifeSelectedProductID');
          let productValues = this.filteredProduct.filter(x => x.value == filtervalues.ID)[0];
           this.selectedProduct =  {
            value: productValues.value,
            label: productValues.label
          }
          this.GetAllSaleDataWithLazyLoadinFunction(this.filterModel);
          this.GetAllPurchaseDataWithLazyLoadinFunction(this.filterModel);
          this.GetAllActivityDataWithLazyLoadinFunction(this.filterModel);
          this.GetProductDetailHistoryReport();
        }

      }
      else {
        console.log('internal serve Error', response);
      }
      this.isLoadingProduct = false;
      this.cdr.detectChanges();

    }
    );
  }

  GetAllActivityDataWithLazyLoadinFunction(filterRM: any) {
    if (this.isFirstTime) { return; }

    const Type = 1;
    
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.ToDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = true;
    filterRequestModel.IsReceived = true;
    filterRequestModel.Type = 1;
    filterRequestModel.ID = this.selectedProduct.value
    filterRequestModel.Product = filterRM.Product;
    
    filterRequestModel.UserID = 0;
    
    this.isLoadingAllActivities = true;
    this.apiService.GetAllActivityByFilterForLifeLineReports(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        this.allActivity = response1.GetAllActivityLogs;
        this.activityTotalRecords = response1.TotalRecords;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
      this.isLoadingAllActivities = false;
      this.cdr.detectChanges();
    });
  }

  OpenProductDialog() {
    this.IsOpenProductDialog = true;
    this.btn_open_modal_products.nativeElement.click();
  }
  selectValue(newValue: any, isModal = false) {
    if(isModal) {
      this.btn_open_modal_products.nativeElement.click();
    }
    const obj = {
      value: newValue.ID ? newValue.ID : newValue.value,
      label: newValue.Product ?  newValue.Product :  newValue.label
    }
    this.selectedProduct = obj;
    this.GetProductDetailHistoryReport();

    this.isFirstTime = false;
    this.GetAllPurchaseDataWithLazyLoadinFunction(this.filterModel);
    this.GetAllSaleDataWithLazyLoadinFunction(this.filterModel);
    this.GetAllActivityDataWithLazyLoadinFunction(this.filterModel);
    this.IsOpenProductDialog = false;
  }

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
     
  }
}

