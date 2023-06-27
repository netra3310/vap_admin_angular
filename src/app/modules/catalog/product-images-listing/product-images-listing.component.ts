import { SystemConfigModel } from "../../../Helper/models/SystemConfigModel";
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
// import {
//   LazyLoadEvent,
//   MenuItem,
//   ConfirmationService,
// } from "primeng/api";
import { ActivatedRoute } from "@angular/router";

import { DatePipe } from "@angular/common";
import {
  AllProductList,
} from "../../../Helper/models/Product";
import { FilterRequestModel } from "../../../Helper/models/FilterRequestModel";
import { UserModel } from "../../../Helper/models/UserModel";
import { vaplongapi } from "../../../Service/vaplongapi.service";

import { TableColumnEnum } from "src/app/shared/Enum/table-column.enum";
import { GenericMenuItems } from "src/app/shared/model/genric-menu-items.model";
import { Columns } from "src/app/shared/model/columns.model";
import { StorageService } from "src/app/shared/services/storage.service";
import { ToastService } from "../../shell/services/toast.service";
import { untilDestroyed } from "src/app/shared/services/until-destroy";
import { ConfirmationService } from "src/app/Service/confirmation.service";

type activeTabs = 'ACTIVE' | 'INACTIVE';
type searchTabs =  'WITHIMAGES' | 'WITHOUTIMAGES';

@Component({
  selector: "app-product-images-listing",
  templateUrl: "./product-images-listing.component.html",
  styles: [],
  providers: [DatePipe, ConfirmationService],
})

export class ProductImageListingComponent implements OnInit, OnDestroy {
  imageBasePath;
  selectedProduct: AllProductList;
  AllProductList: Array<AllProductList> = [];
  PaginationData: any = [];
  filterRequestModel: FilterRequestModel;
  usermodel: UserModel;
  SystemConfigModel: SystemConfigModel;
  selectedFilter = 1;
  selectedFilterImage = 1;

  imgSrc = "";
  valCheck = "";
  ProductSearch = "";
  ProductID: any;
  bChangeBarcode = false;
  barcodechange = true;

  items: any[];
  
  IsSpinner = false;
  displayImage = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  totalRecords = 0;
  filterGlobal = true;
 
  Products: any[] = [];
  ShopProducts: any[] = [];

  genericMenuItems: GenericMenuItems[] = [
  ];
 
  columns: Columns[] = [
    // {
    //   field: "IsActive",
    //   header: "Status",
    //   sorting: "IsActive",
    //   placeholder: "",
    //   type: TableColumnEnum.TOGGLE_BUTTON,
    //   translateCol: "SSGENERIC.STATUS",
    // },
     {
      field: "ArticalNo",
      header: "SKU",
      sorting: "ArticalNo",
      placeholder: "",
      translateCol: "SSGENERIC.SKU",
    },
    {
      field: "BLabel",
      header: "Model",
      sorting: "BLabel",
      placeholder: "",
      translateCol: "SSGENERIC.MODEL",
    },
    {
      field: "Name",
      header: "Product",
      sorting: "Name",
      placeholder: "",
      translateCol: "SSGENERIC.PRODUCT",
    },
    
    {
      field: "DisplayImage",
      header: "Image",
      sorting: "",
      placeholder: "",
      isImage: true,
      type: TableColumnEnum.MULTIPLEIMAGES,
      translateCol: "SSGENERIC.IMAGE",
    },
  ];
  initialCoulumns = ['ArticalNo', 'BLabel', 'Name', 'DisplayImage'];
  isLoadingData = false;

  rowsPerPageOptions = [10, 20, 50, 100];

  // tslint:disable-next-line: max-line-length
  constructor(
    private vapLongApiService: vaplongapi,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {
    // this.breadcrumbService.setItems([
    //   { label: 'Managed Products' }
    // ]);
    this.imageBasePath = this.vapLongApiService.imageBasePath;
    this.AllProductList = new Array<AllProductList>();
    this.usermodel = this.storageService.getItem("UserModel");
    const obj = {
      Action: "View",
      Description: `View Product Image Listing`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID,
    };
    this.vapLongApiService
      .SaveActivityLog(obj)
      .toPromise()
      .then((x) => {});
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem("UserModel");
    if(localStorage.getItem('SystemConfig')) {
      this.SystemConfigModel = JSON.parse(localStorage.getItem("SystemConfig") ?? "");
    }
    this.totalRecords = this.route.snapshot.data.val;
    this.FilterRequestModelInilizationFunction();
    this.GetAllProductTotalCountProductFunction();
  }
 
  ngOnDestroy(): void {}
 
  emitAction(event: any) {
    
  }
 
  FilterRequestModelInilizationFunction(): void {
    this.filterRequestModel = new FilterRequestModel(
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      new Date(),
      new Date(),
      150000,
      0,
      true,
      false,
      -1,
      -1,
      -1,
      false,
      false,
      false,
      "",
      "",
      false,
      false,
      -1,
      -1,
      false,
      false,
      "",
      "",
      "",
      0,
      true
    );
  }

  GetAllProductTotalCountProductFunction() {
    this.vapLongApiService
      .GetAllProductImagesListingTotalCount(this.filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.totalRecords = response.TotalRowCount;
        } else {
          console.log(
            "internal server error ! GetAllProductPagination not getting api data"
          );
        }
      });
  }

  ViewProductFunction(product: any) {
    this.toastService.showInfoToast("Product Selected", product.name);
  }

  ProductSearchFunction(value: any) {
    this.filterRequestModel.Product = value;
  }

  filterReport() {

    this.AllProductList = [];
    this.totalRecords = 0;
    if (Number(this.selectedFilter) === 1) {
      this.filterRequestModel.IsGetAll = true;
    } else {
      this.filterRequestModel.IsGetAll = false;
    }

    if (Number(this.selectedFilterImage) === 1) {
      this.filterRequestModel.IsImageAttached = true;
    } else {
      this.filterRequestModel.IsImageAttached = false;
    }
    this.GetAllProductWithLazyLoadinFunction(this.filterRequestModel);
  }
  LazyLoadProductFunction(event: any): void {
    this.loading = true;
    const start = event.first / event.rows;
    const product = "";
    if (event.globalFilter) {
      this.filterRequestModel.Product = event.globalFilter;
      // this.filterRequestModel.PageNo = 1;
    } else {
      this.filterRequestModel.Product = product;
    }
    this.filterRequestModel.PageNo = start;
    this.filterRequestModel.PageSize = event.rows;
    this.GetAllProductWithLazyLoadinFunction(this.filterRequestModel);
  }

  GetAllProductWithLazyLoadinFunction(fiterRM: FilterRequestModel) {
    this.filterRequestModel.PageNo = fiterRM.PageNo;
    this.filterRequestModel.PageSize = fiterRM.PageSize;
    this.filterRequestModel.Product = fiterRM.Product;
    this.GetAllProductTotalCountProductFunction();
    this.isLoadingData = true;
    this.vapLongApiService
      .GetAllProductPaginationForImageListing(this.filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.isLoadingData = false;
        if (response.ResponseText === "success") {
          this.AllProductList = response.AllProductList;
          for (const item of this.AllProductList) {
            if (item.Image != null && item.Image != "") {
              //item.DisplayImage = item.Image.split('|')[0];
              item.DisplayImage = item.Image;
            } else {
              item.DisplayImage = null;
            }
          }
          this.cdr.detectChanges();
        } else {
          this.IsSpinner = false;
          console.log("internal server error ! not getting api data");
        }
      });
  }
  popUpImageFuction(imgSrc: any) {
    this.imgSrc = imgSrc;
    this.displayImage = true;
  }

  activeTab: activeTabs = 'ACTIVE';
  searchTab: searchTabs = 'WITHIMAGES';

  setActiveTab(tab: activeTabs) {
    this.activeTab = tab;
    switch(tab) {
      case 'ACTIVE' :
        this.selectedFilter = 1;
        break;
      case 'INACTIVE' :
        this.selectedFilter = 0;
        break;
    }
    this.filterReport(); 
  }

  setSearchTab(tab: searchTabs) {
    this.searchTab = tab;
    switch(tab) {
      case 'WITHIMAGES' :
        this.selectedFilterImage = 1;
        break;
      case 'WITHOUTIMAGES' :
        this.selectedFilterImage = 0;
        break;
    }
    this.filterReport(); 
  }
}
