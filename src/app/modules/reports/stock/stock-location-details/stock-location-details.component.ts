import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { ProductDropDownData } from 'src/app/Helper/models/ProductDropDownData';
import { ProductLocationReportModel } from 'src/app/Helper/models/ProductLocationReportModel';

import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from 'src/app/modules/shell/services/toast.service';

@Component({
  selector: 'app-stock-location-details',
  templateUrl: './stock-location-details.component.html',
  styleUrls: ['./stock-location-details.component.scss']

})
export class StockLocationDetailsComponent implements OnInit, OnDestroy {
  
  @ViewChild('btn_open_modal_products') btn_open_modal_products: ElementRef;

  dateForDD: any;
  productDetail: ProductDropDownData;
  selectedDated: 7;
  totalRecords = 0;
  rows = 10;
  first = 0;
  IsSpinner = false;
  loading = false;
  items: any[];
  ProductDropDownInfoList: any[] = [];
  AllStockList: any[] = [];
  selectedStock: any;
  ProductDropdown: any[];
  filteredProduct: any[];
  selectedProduct: any;
  selectedProductID = '';

  usermodel: UserModel;
  imageBasePath;
  imgSrc = '';
  displayImage = false;
  productLocationReportModel: ProductLocationReportModel;
  
  genericMenuItems: GenericMenuItems[] = [];
  columns: Columns[] = [
    {
      field: 'ProductImage', header: 'Product', sorting: '', placeholder: '', type: TableColumnEnum.IMAGE,
      translateCol: 'SSGENERIC.PRODUCT'
    },
    { field: 'Product', header: 'Name', sorting: 'Product', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Barcode', header: 'EAN', sorting: 'Barcode', placeholder: '', translateCol: 'SSGENERIC.EAN' },
    { field: 'Quantity', header: 'Quantity', sorting: 'Quantity', placeholder: '', translateCol: 'SSGENERIC.QUANTITY' },
    { field: 'Location', header: 'Location', sorting: 'Location', placeholder: '', translateCol: 'SSGENERIC.LOCATION' }
  ];
  productsColumn: Columns[] = [
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' },
    { field: 'Color', header: 'Color', sorting: 'Color', placeholder: '' },
    { field: 'PurchasePrice', header: 'PurchasePrice', sorting: 'PurchasePrice', placeholder: '', type:TableColumnEnum.CURRENCY_SYMBOL,  }
  ];
  initialCoulumns = ['ProductImage', 'Product', 'Barcode', 'Quantity', 'Location'];
  
  globalFilterFields = ['Product', 'Quantity', 'Location', 'Barcode'];
  rowsPerPageOptions = [10, 20, 50, 100];
  ProductData: any[] = [];
  IsOpenProductDialog = false;
  dataFunc: any = customSearchFn;

  isLoadingProducts = false;
  isLoadingData = false;
  constructor(
    private apiService: vaplongapi, 
    private storageService: StorageService, 
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
    ) {
    this.imageBasePath = this.apiService.imageBasePath;
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Stock Report with Location Details`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {
    this.productLocationReportModel = new ProductLocationReportModel();
    this.productLocationReportModel.PageNo = 0;
    this.productLocationReportModel.PageSize = 10;
    this.productLocationReportModel.ProductID = -1;
    this.productLocationReportModel.ProductVariantID = -1;
    this.productLocationReportModel.Search = '';
    this.usermodel = this.storageService.getItem('UserModel');
    this.GetProductDropDownList();
  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
  }
  GetProductDropDownList() {

    this.ProductDropdown = [];
    // this.apiService.GetProductDropDownDatawithVariantInfo().pipe(untilDestroyed(this)).subscribe((response: any) => {
    //   if (response.ResponseText === 'success'){
    //     this.ProductDropDownInfoList = response.DropDownData;
    //     for (let i = 0; i < response.DropDownData.length ; i++){
    //       this.ProductDropdown.push({
    //         value: response.DropDownData[i].ProductVariantID ,
    //         label: response.DropDownData[i].ProducVariantName,
    //       });
    //     }
    this.isLoadingProducts = true;
    this.apiService.GetPurchaseProduct().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.ProductData = response.AllProductVariantList;
        for (const item of response.AllProductVariantList) {
          this.ProductDropDownInfoList.push({
            value: item.ID,
            label: item.Product,
          });
        }
        this.filteredProduct = this.ProductDropDownInfoList;
        if (this.ProductDropDownInfoList.length > 0) {
          this.selectedProductID = response.AllProductVariantList[0].ID;
          this.selectedProduct = {
            value: response.AllProductVariantList[0].ID,
            label: response.AllProductVariantList[0].Product,
          };
          this.getAllStockByLocation(Number(this.selectedProductID), false);
        }
      } else {
        this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }
      this.isLoadingProducts = false;
      this.cdr.detectChanges();
    });
  }

  SearchByProduct(event: any) {
    this.selectedProductID = event.value;
    this.getAllStockByLocation(Number(event.value), false);
  }
  getAllStockByLocation(productVariantID: number, isTrackable: boolean) {
    this.productDetail = this.ProductData.filter(y => y.ID === productVariantID)[0];
    this.productLocationReportModel.PageNo = 0;
    this.productLocationReportModel.PageSize = 10;
    this.productLocationReportModel.ProductID = this.productDetail.ProductID;
    this.productLocationReportModel.ProductVariantID = productVariantID;
    this.productLocationReportModel.Search = '';

    const filterRM = {
      PageNo: 0,
      PageSize: 10,
      Product: '',
      IsTrackable: isTrackable,
    };
    this.GetAllStockDataWithLazyLoadinFunction(filterRM);
  }

  GetAllStockDataWithLazyLoadinFunction(filterRM: any ) {
    let IsTrackable = false;
    this.productLocationReportModel.LocationStatus = 3;
    this.productLocationReportModel.OutletID = this.usermodel.OutletID;
    this.productLocationReportModel.PageNo = filterRM.PageNo;
    this.productLocationReportModel.PageSize = filterRM.PageSize;
    this.productLocationReportModel.Search = filterRM.Product;
    IsTrackable = filterRM.IsTrackable;
    if(this.productLocationReportModel.ProductID==-1 &&this.productLocationReportModel.ProductVariantID==-1 )
    {
      return 0;
    }
    this.isLoadingData = true;
    if (IsTrackable) {
      this.apiService.GetTrackableProductLocationDetailTotalCountReport(this.productLocationReportModel)
        .pipe(untilDestroyed(this)).subscribe((response: any) => {
          if (response.ResponseCode === 0) {
            this.totalRecords = response.TotalRowCount;
          } else {
            this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
            // console.log('internal server error ! not getting api data');
          }
          this.isLoadingData = false;
          this.cdr.detectChanges();
        });
      this.apiService.GetTrackableProductLocationDetailReport(this.productLocationReportModel)
        .pipe(untilDestroyed(this)).subscribe((response: any) => {
          if (response.ResponseCode === 0) {
            this.AllStockList = response.TrackableProductLocationModelList;
          } else {
            this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
            // console.log('internal server error ! not getting api data');
          }
          this.isLoadingData = false;
          this.cdr.detectChanges();
        });
    } else {
      this.apiService.GetNonTrackableProductLocationTotalCountReport(this.productLocationReportModel)
        .pipe(untilDestroyed(this)).subscribe((response: any) => {
          if (response.ResponseCode === 0) {
            this.totalRecords = response.TotalRowCount;
          } else {
            this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
            // console.log('internal server error ! not getting api data');
          }
          this.isLoadingData = false;
          this.cdr.detectChanges();
        },
        );
      this.apiService.GetNonTrackableProductLocationReport(this.productLocationReportModel)
        .pipe(untilDestroyed(this)).subscribe((response: any) => {
          if (response.ResponseCode === 0) {
            this.AllStockList = response.AllNonTrackableProductsLocationModelList;
          } else {
            this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
            // console.log('internal server error ! not getting api data');
          }
          this.isLoadingData = false;
          this.cdr.detectChanges();
        });
    }
  }

  OpenProductDialog() {
    this.IsOpenProductDialog = true;
    this.btn_open_modal_products.nativeElement.click();
  }
  selectValue(newValue: any) {
    const obj = {
      value: newValue.ID,
      label: newValue.Product
    };
    this.selectedProduct = obj;
    this.selectedProductID = newValue.ID;
    this.IsOpenProductDialog = false;
    this.btn_open_modal_products.nativeElement.click();
    this.getAllStockByLocation(Number(this.selectedProductID), false);
  }
}
