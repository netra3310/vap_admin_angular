import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
// //import { Table } from 'primeng/table';
// //import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { WishlistModel } from 'src/app/Helper/models/WishlistModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
// import { ToastService } from 'src/app/modules/shell/services/toast.service';
// 
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
// 
import { GetProductStockHistoryRequest } from 'src/app/Helper/models/GetProductStockHistoryRequest';


@Component({
  selector: 'app-inventory-worth-report',
  templateUrl: './inventory-worth-report.component.html',
  styleUrls: ['./inventory-worth-report.component.scss']
})

export class InventoryWorthReportComponent implements OnInit, OnDestroy {
  // 
  AllInventoryList = [];

  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 10;
  // last = 25;
  totalRecords = 0;

  usermodel: UserModel;


  filterModel = {
    PageNo: 0,
    PageSize: 10,
    Product: '',
  };
  stockRequestModel: GetProductStockHistoryRequest;

  isFirstTime = true;
  genericMenuItems: GenericMenuItems[] = [];

  isLoadingData : boolean = false;

  columns: Columns[] = [
    // {
    //   field: 'ProductVariantID', header: 'SKU', sorting: 'ProductVariantID', placeholder: '', searching: true,
    //   translateCol: 'SSGENERIC.SKU'
    // },
    { field: 'ProductImage', header: 'Product', sorting: '', placeholder: '', type: TableColumnEnum.MULTIPLEIMAGES,translateCol: 'SSGENERIC.PRODUCT' },
    { field: 'Product', header: 'Name', sorting: 'Product', placeholder: '', searching: true, translateCol: 'SSGENERIC.NAME' },
    { field: 'ProductModel', header: 'Model', sorting: 'ProductModel', placeholder: '', searching: true, translateCol: 'SSGENERIC.MODEL' },
    {
      field: 'TotalPurchasePrice', header: 'Purchase Price', sorting: 'TotalPurchasePrice', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.TotalPURCHASEP'
    },
    {
      field: 'AveragePurchasePrice', header: 'Avg. Purchase Price', sorting: 'AveragePurchasePrice', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, 
      translateCol: 'SSGENERIC.AVGPURCHASE'
    },
    { field: 'TotalStock', header: 'TotalStock', sorting: 'TotalStock', placeholder: '',  translateCol: 'SSGENERIC.TOTALSTOCK' },
    { field: 'ReturnedStock', header: 'Returned Stock', sorting: 'ReturnedStock', placeholder: '',  translateCol: 'SSGENERIC.RETURNEDSTOCK' },
    { field: 'RemainingStock', header: 'RemainingStock', sorting: 'RemainingStock', placeholder: '',  translateCol: 'SSGENERIC.REMAININGSTOCK' },
    { field: 'HoldStock', header: 'HoldStock', sorting: 'HoldStock', placeholder: '',  translateCol: 'SSGENERIC.HOLDSTOCK' },
    { field: 'NetWorth', header: 'NetWorth', sorting: 'NetWorth', placeholder: '', translateCol: 'SSGENERIC.NETWORTH' },


  ];
  InventoryGlobalFilterFields = ['ProductVariantID', 'Product', 'ProductModel'];
  initialCoulumns = ['ProductImage', 'Product', 'ProductModel', 'TotalPurchasePrice', 
              'AveragePurchasePrice', 'TotalStock', 'NetWorth'];
  rowsPerPageOptions = [10, 20, 50, 100];
  InventoryTotalRecords =0;
  InventoryNetWorth=0;
  constructor(
    private apiService: vaplongapi, 
    public router: Router, 
    private storageService: StorageService,
    private cdr : ChangeDetectorRef) {
      this.usermodel = this.storageService.getItem('UserModel');
          const obj = {
            Action: 'View',
            Description: `View Inventory Worth Report`,
            PerformedAt: new Date().toISOString(),
            UserID: this.usermodel.ID
        }
        this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { });
  }

  ngOnInit(): void {
    this.GetInventoryWithLazyLoadinFunction(this.filterModel);
    this.usermodel = this.storageService.getItem('UserModel');;
  }
  ngOnDestroy(): void {
  }

  GetInventoryWithLazyLoadinFunction(filterRM : any) {
    
    //if (this.isFirstTime) { return; }
    this.stockRequestModel = new GetProductStockHistoryRequest();
    this.stockRequestModel.PageNo = filterRM.PageNo;
    this.stockRequestModel.PageSize = filterRM.PageSize;
    this.stockRequestModel.Search = filterRM.Product;
    this.stockRequestModel.IsGetAll = false;
    this.isLoadingData = true;
    this.apiService.GetInventoryWorthReport(this.stockRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      
      this.isLoadingData = false;
      if (response1.ResponseCode === 0) {
         this.InventoryTotalRecords = response1.InventoryTotalCount;
        this.InventoryNetWorth = response1.TotalInventoryWorth;
        this.AllInventoryList = response1.InventoryDetails;
        this.AllInventoryList.forEach((element1 : any) => {
          element1.AveragePurchasePrice =  element1.AveragePurchasePrice.toFixed(2);
        });
      }
      else {
        console.log('internal server error ! not getting api data');
      }

      this.cdr.detectChanges();
    });
  }

  
}

