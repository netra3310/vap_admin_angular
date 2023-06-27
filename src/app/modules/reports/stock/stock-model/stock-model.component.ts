import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';

import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { AddwishlistDialogComponent } from 'src/app/EntryComponents/addwishlist-dialog/addwishlist-dialog.component';
import { StorageService } from 'src/app/shared/services/storage.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { datefilter } from 'src/app/Helper/datefilter';
import { DatePipe } from '@angular/common';
import { isNullOrUndefined } from 'src/app/Helper/global-functions';
import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: 'app-stock-model',
  templateUrl: './stock-model.component.html',
  styleUrls: ['./stock-model.component.scss'],
  providers: [DatePipe]

})
export class StockModelComponent implements OnInit, OnDestroy {  
  modalWishlistConfig: ModalConfig = {
    modalTitle: 'Add to Wishlist',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    modalSize: 'md',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };
  @ViewChild('modalWishlist') private modalWishlistComponent: ModalComponent;
  @ViewChild('wishList') wishList: AddwishlistDialogComponent;
  dateForDD: any;
  selectedDated: 7;
  totalRecords = 0;
  rows = 25;
  first = 0;
  loading = false;
  items: any[];
  ProudctModelApiList: any[]=[];
  productModelItems: any[];
  modelProduct: any[] = [];
  AllStockList: any[] = [];
  selectedStock: any;
 
  selectedShop: any;
  IsSpinner = false;
  imageBasePath;
  imgSrc = '';
  displayImage = false;
  selectedVariantIDforWishlist: number;
  selectedProductNameforWishlist: string;
  isAddToWishlist = false;
  selectedProductModelID:any;
  filterModel = {
    PageNo: 0,
    PageSize: 25,
    Product: '',
  };


  genericMenuItems: GenericMenuItems[] = [
     { label: 'Wishlist', icon: 'fas fa-shopping-cart', dependedProperty: 'ID' }
  ];
  columns: Columns[] = [
    { field: 'ID', header: 'SKU', sorting: 'ID', placeholder: '' },
    { field: 'ProductImage', header: 'Product', sorting: '', placeholder: '', type: TableColumnEnum.IMAGE },
    { field: 'Product', header: 'Name', sorting: 'Product', placeholder: '' },
    { field: 'BLabel', header: 'Model', sorting: 'BLabel', placeholder: '' },
    { field: 'RemainingStock', header: 'Availible Stock', sorting: 'RemainingStock', placeholder: '' }
  ];
  initialCoulumns = ['ID', 'ProductImage', 'Product', 'BLabel', 'RemainingStock'];
  globalFilterFields = ['Product', 'BLabel', 'ID', 'Barcode', 'RemainingStock'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  dataFunc: any = customSearchFn;
  usermodel: any;

  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  isLoadingData = false;
  constructor(
    private apiService: vaplongapi, 
    private datepipe: DatePipe,
    private storageService: StorageService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
    ) {
    this.imageBasePath = this.apiService.imageBasePath;
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Stock Report By Models Wise`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {
    this.GetProductModelDropDownList();
  }

  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    this.AddToWishlist(event.selectedRowData.ID, event.selectedRowData.Product);
  }
  GetProductModelDropDownList() {
    this.IsSpinner = true;
    this.ProudctModelApiList = [];
    this.modelProduct = [];

    this.apiService.GetProductModelListData().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.modelProduct = response.ProductModels.filter((x: any) => x.IsActive !== false);
        //this.selectedProductModelID = this.modelProduct[0].Description;

        for (const item of this.modelProduct) {
          this.ProudctModelApiList.push({
            value: item.Description,
            label: item.Description,
          });
        }
      }
      this.IsSpinner = false;
      this.cdr.detectChanges();
    },
      error => {
        this.toastService.showErrorToast('error', 'internal server error ! GetProductModelDropDownData function not getting data');
        // console.log('internal server error ! GetProductModelDropDownData function not getting data');
      });

  }
  SearchByModel(event: any) {
    if (event) {
      this.GetAllStockDataWithLazyLoadinFunction(this.filterModel);
    }
  }
  GetAllStockDataWithLazyLoadinFunction(filterRM: any) {
    this.isLoadingData = true;
    const filterRequestModel = new FilterRequestModel();
    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.Product = filterRM.Product;
    if (isNullOrUndefined(this.selectedProductModelID)) { return;}
    filterRequestModel.ColumnName = this.selectedProductModelID;
    ;
    this.apiService.GetAllByModelsTotalCount(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        ;
        this.totalRecords = response.TotalRowCount;
      }
      else {
        this.toastService.showErrorToast('Error', response.responseText);
      }
      this.cdr.detectChanges();
    },
    );
    this.apiService.GetAllByModelsPagination(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        ;
        this.AllStockList = response1.AllProductVariantList;
      }
      else {
        this.toastService.showErrorToast('Error', response1.responseText);
      }
      this.isLoadingData = false;
      this.cdr.detectChanges();
    },
    );
  }

  AddToWishlist(ProductVariantID: number, Product: string) {
    this.selectedVariantIDforWishlist = ProductVariantID;
    this.selectedProductNameforWishlist = Product;
    this.isAddToWishlist = true;
    this.modalWishlistComponent.open();
  }
  CloseDialog(newValue: any) {
    this.isAddToWishlist = false;
    this.modalWishlistComponent.close();
    this.selectedVariantIDforWishlist = 0;
    this.selectedProductNameforWishlist = '';
    // console.log(newValue.IsDone);
    this.wishList.clearData();
  }
  close() {
    this.selectedVariantIDforWishlist = -1;
    this.selectedProductNameforWishlist = '';
    this.wishList.clearData();
  }

  popUpImageFuction(imgSrc: any) {
    this.imgSrc = imgSrc;
    this.displayImage = true;
  }

  

}

