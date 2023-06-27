import { ProdutPriceTable } from "../../../Helper/models/ProdutPriceTable";
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { SystemConfigModel } from "../../../Helper/models/SystemConfigModel";
import { GetProductStockHistoryRequest } from "../../../Helper/models/GetProductStockHistoryRequest";
import { AllNonTrackableProductsLocationModelList } from "../../../Helper/models/AllNonTrackableProductsLocation";
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, ElementRef } from "@angular/core";
//import { Table } from "primeng/table";
// import {
//   LazyLoadEvent,
//   MenuItem,
//   SelectItem,
//   ConfirmationService,
// } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";

import { DatePipe } from "@angular/common";
import {
  AllProductList,
  ProductVariant,
  ProductVariantModel,
} from "../../../Helper/models/Product";
import { FilterRequestModel } from "../../../Helper/models/FilterRequestModel";
import {
  UpdateProductQualityStatus,
  UpdateProductVariantStatus,
} from "../../../Helper/models/DropLists";
import { UserModel } from "../../../Helper/models/UserModel";
import { vaplongapi } from "../../../Service/vaplongapi.service";

import { TableColumnEnum } from "src/app/shared/Enum/table-column.enum";
import { GenericMenuItems } from "src/app/shared/model/genric-menu-items.model";
import { Columns } from "src/app/shared/model/columns.model";
import { CatalogPermissionEnum } from "src/app/shared/constant/catalog-permission";
import { StorageService } from "src/app/shared/services/storage.service";
import * as XLSX from "xlsx";
import { ToastService } from "../../shell/services/toast.service";

import { untilDestroyed } from "src/app/shared/services/until-destroy";
import { AddwishlistDialogComponent } from "src/app/EntryComponents/addwishlist-dialog/addwishlist-dialog.component";
import { AddIncomingQuantityDialogComponent } from "src/app/EntryComponents/addincomingquantity-dialog/addincomingquantity-dialog.component";
import { ConfirmationService } from "src/app/Service/confirmation.service";
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: "app-managed-products-filter",
  templateUrl: "./managed-products-filter.component.html",
  styles: [],
  providers: [DatePipe, ConfirmationService],
})
export class ManagedProductsFilterComponent implements OnInit, OnDestroy {
  CatalogPermission = CatalogPermissionEnum;
  // @ViewChild("dt") table: Table;
  @ViewChild("wishList") wishList: AddwishlistDialogComponent;
  @ViewChild("incomingList") incomingList: AddIncomingQuantityDialogComponent;
  imageBasePath;
  //selectedProduct: AllProductList;
  AllProductList: Array<AllProductList> = [];
  PaginationData: any = [];
  PorductVarientList: ProductVariantModel[] = [];
  AddPrductVarientList: ProductVariant;
  filterRequestModel: FilterRequestModel;
  updateProductQualityStatus: UpdateProductQualityStatus;
  updateProductVariantStatus: UpdateProductVariantStatus;
  allNonTrackableProductsLocationModelList: AllNonTrackableProductsLocationModelList[] =
    [];
  getProductStockHistory: GetProductStockHistoryRequest;
  usermodel: UserModel;
  SystemConfigModel: SystemConfigModel;
  productStockHistoryRequestModel: GetProductStockHistoryRequest;
  ProdutPriceTableModel: Array<ProdutPriceTable> = [];
  selectedFilter = 1;
  GlobalSearchFilter =1;
  imgSrc = "";
  valCheck = "";
  ProductSearch = "";
  selectedColorDropdownID = "";
  selectedCodeDropdownID = "";
  barcode: any;
  ProductID: any;
  bChangeBarcode = false;
  barcodechange = true;

  items: any[];
  ColorDropdown: any[];
  CodeDropdown: any[];

  IsSpinner = false;
  displayVariantPopup = false;
  displayLocationPopup = false;
  displayPricesPopup = false;
  displayImage = false;
  loading: boolean;
  first = 0;
  rows = 10;
  alwaysShowPaginator = true;
  totalRecords = 0;
  filterGlobal = true;
  multiSelect = true;
  selectedVariantIDforWishlist: number;
  selectedProductNameforWishlist: string;
  isAddToWishlist = false;

  
  selectedProductIDforincomingQuantitylist: number;
  selectedProductNameforincomingQuantitylist: string;
  isAddToIncomingOrder = false;

  AttachDocumentPopDisplayForShop = false;
  AttachDocumentPopDisplay = false;
  uploadedFiles: any[] = [];
  uploadedFilesShop: any[] = [];
  arrayBuffer: any;
  file: File;
  arrayBuffershop: any;
  fileshop: File;
  Products: any[] = [];
  ShopProducts: any[] = [];

  genericMenuItems: GenericMenuItems[] = [
    { label: "Update", icon: "fas fa-pencil-alt", dependedProperty: "ID" },
    // tslint:disable-next-line: max-line-length
    {
      label: "Variants",
      icon: "fas fa-shapes",
      dependedProperty: "ID",
      permission: CatalogPermissionEnum.AddVariants,
    },
    {
      label: "Locations",
      icon: "fas fa-map-marker-alt",
      dependedProperty: "ID",
    },
    // tslint:disable-next-line: max-line-length
    {
      label: "Prices",
      icon: "fas fa-euro-sign",
      dependedProperty: "ID",
      permission: CatalogPermissionEnum.ProductPricesShow,
    },
    { label: "Delete", icon: "fas fa-trash-alt", dependedProperty: "ID" },
    { label: "Wishlist", icon: "fas fa-shopping-cart", dependedProperty: "ID" },
    {
      label: "Sync Images",
      icon: "fas fa-image",
      dependedProperty: "ID",
      permissionDisplayProperty: "bShowInShop",
    },
    {
      label: "Disable On Shop",
      icon: "fas fa-image",
      dependedProperty: "ID",
      permissionDisplayProperty: "bShowInShop",
    },
    { label: "Incoming Quantity", icon: "fas fa-shopping-cart", dependedProperty: "ID" },
    { label: "Sync Stock", icon: "fas fa-shopping-cart", dependedProperty: "ID" },

  ];
  genericMenuVarientItems: GenericMenuItems[] = [
    {
      label: "Post To Shop",
      icon: "fas fa-paper-plane",
      dependedProperty: "ID",
    },
    // tslint:disable-next-line: max-line-length
  ];
  columns: Columns[] = [
    {
      field: "IsActive",
      header: "Status",
      sorting: "IsActive",
      placeholder: "",
      type: TableColumnEnum.TOGGLE_BUTTON,
      translateCol: "SSGENERIC.STATUS",
    },
    {
      field: "ArticalNo",
      header: "SKU",
      sorting: "ArticalNo",
      placeholder: "",
      translateCol: "SSGENERIC.SKU",
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
    {
      field: "Name",
      header: "Product",
      sorting: "Name",
      placeholder: "",
      translateCol: "SSGENERIC.PRODUCT",
    },
    {
      field: "BLabel",
      header: "Model",
      sorting: "BLabel",
      placeholder: "",
      translateCol: "SSGENERIC.MODEL",
    },
    {
      field: "Barcode",
      header: "EAN",
      sorting: "Barcode",
      placeholder: "",
      translateCol: "SSGENERIC.EAN",
    },
    {
      field: "RemainingStock",
      header: "Stock",
      sorting: "RemainingStock",
      placeholder: "",
      translateCol: "SSGENERIC.STOCK",
    },
    {
      field: "SalePrice",
      header: "Sale Price",
      sorting: "SalePrice",
      placeholder: "",
      permission: CatalogPermissionEnum.ProductPricesShow,
      type: TableColumnEnum.CURRENCY_SYMBOL,
      translateCol: "SSGENERIC.SALEPRICE",
    },
    {
      field: "PurchasePrice",
      header: "Buying Price",
      sorting: "PurchasePrice",
      placeholder: "",
      permission: CatalogPermissionEnum.ProductPricesShow,
      type: TableColumnEnum.CURRENCY_SYMBOL,
      translateCol: "SSGENERIC.PURCHASEPRICE",
    },
    // { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' }
    {
      field: "Quality",
      header: "Quality",
      sorting: "Quality",
      placeholder: "",
      translateCol: "SSGENERIC.QUALITY",
    },
  ];
  initialColumns = ['IsActive', 'ArticalNo', 'DisplayImage', 'Name', 'BLabel', 'Barcode', 'RemainingStock', 'SalePrice', 'PurchasePrice', 'Quality']
  isLoadingProducts = false;
  initialPriceColumns = ['ProductName', 'AvgPrice', 'LastPrice', 'SalePrice']
  isLoadingPrices = false;
  pricecolumns: Columns[] = [
    {
      field: "ProductName",
      header: "ProductName",
      sorting: "ProductName",
      placeholder: "",
      searching: false,
    },
    {
      field: "AvgPrice",
      header: "Average Purchase Price",
      sorting: "AvgPrice",
      placeholder: "",
    },
    {
      field: "LastPrice",
      header: "Last Purchase Price",
      sorting: "LastPrice",
      placeholder: "",
    },
    {
      field: "SalePrice",
      header: "Sale Price",
      sorting: "SalePrice",
      placeholder: "",
    },
  ];
  locationColumn: Columns[] = [
    {
      field: "Product",
      header: "Product",
      sorting: "Product",
      placeholder: "",
    },
    {
      field: "Quantity",
      header: "Quantity",
      sorting: "Quantity",
      placeholder: "",
    },
    {
      field: "Location",
      header: "Location",
      sorting: "Location",
      placeholder: "",
    },
  ];
  productvariantcolumns: Columns[] = [
    {
      field: "IsActive",
      header: "Status",
      sorting: "IsActive",
      placeholder: "",
      type: TableColumnEnum.TOGGLE_BUTTON,
      searching: false,
    },
    { field: "ID", header: "SKU", sorting: "SKU", placeholder: "" },
    {
      field: "Product",
      header: "Product",
      sorting: "Product",
      placeholder: "",
    },
    { field: "Color", header: "Color", sorting: "Color", placeholder: "" },
    {
      field: "Barcode",
      header: "Barcode",
      sorting: "Barcode",
      placeholder: "",
    },
    // { field: 'Action', header: 'Action', sorting: '', placeholder: '' },
  ];

  rowsPerPageOptions = [10, 20, 50, 100];

  selectedProductID: any;
  filteredProduct: any[];
  ProductDropdown: any[];
  selectedProduct: any;

  selectedProductModelID: any;
  filteredProductModel: any[];
  ProductModelDropdown: any[];
  selectedProductModel: any;
  dataFunc: any = customSearchFn;
  SearchByStatusDropdown: any[];
  SearchByImageDropdown: any[];
  selectedSearchByStatusID = '';
  selectedSearchByImageID = '';
  newFilterModel : any;
  MinPrice=0;
  MaxPrice=0;
  MinQuantity=0;
  MaxQuantity=0;

  // tslint:disable-next-line: max-line-length
  constructor(
    private vapLongApiService: vaplongapi,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private router: Router,
    private confirmationService: ConfirmationService,
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
      Description: `View Products`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID,
    };
    this.vapLongApiService
      .SaveActivityLog(obj)
      .toPromise()
      .then((x) => {});
    this.AddDatabaseBackup();
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem("UserModel");
    if(localStorage.getItem('SystemConfig')) {
      this.SystemConfigModel = JSON.parse(localStorage.getItem("SystemConfig") ?? "");
    }
    this.totalRecords = this.route.snapshot.data.val;
    this.FilterRequestModelInilizationFunction();
    this.GetSearchByDropDownList();
    this.GetProductDropDownList();
    // this.GetColorDDFuntion();
    // this.GetCodeDDFuntion();
  }

  GetSearchByDropDownList() {

    this.SearchByStatusDropdown = [];
    this.SearchByStatusDropdown.push({ value: '0', label: 'All' });
    this.SearchByStatusDropdown.push({ value: '1', label: 'Active' });
    this.SearchByStatusDropdown.push({ value: '2', label: 'InActive' });
    
    this.selectedSearchByStatusID = '0';

    this.SearchByImageDropdown = [];
    this.SearchByImageDropdown.push({ value: '0', label: 'All' });
    this.SearchByImageDropdown.push({ value: '1', label: 'With Images' });
    this.SearchByImageDropdown.push({ value: '2', label: 'Without Images' });
    
    this.selectedSearchByImageID = '0';
  }

  Reset() {
    this.selectedSearchByStatusID = '0';
    this.selectedSearchByImageID = '0';
    this.selectedProductModel = { value: '-1', label: 'All'};
    this.selectedProduct = { value: '0', label: 'All'};
    this.MinPrice=0;
    this.MaxPrice=0;
    this.MinQuantity=0;
    this.MaxQuantity=0;

    this.FilterRequestModelInilizationFunction();
    var filter = {
      PageNo:0,
      PageSize:10,
      Product:"",
     };
     this.GetAllProductWithLazyLoadinFunction(filter);
  }
  Filter() {    
      this.newFilterModel.ProductID = this.selectedProduct.value;
      this.newFilterModel.ProductName ="";
      if(this.selectedProductModel.label =="All")
      {
        this.newFilterModel.BLabel="-1"
      }
      else
      {
        this.newFilterModel.BLabel =this.selectedProductModel.label;
      }
      this.newFilterModel.MinPrice =this.MinPrice;
      this.newFilterModel.MaxPrice =this.MaxPrice;
      this.newFilterModel.MinQuantity =this.MinQuantity;
      this.newFilterModel.MaxQuantity =this.MaxQuantity;
      this.newFilterModel.ProductStatus =Number(this.selectedSearchByStatusID);
      this.newFilterModel.ImageStatus =Number(this.selectedSearchByImageID);
      this.newFilterModel.ShopCategory =0;
      this.newFilterModel.LocationStatus =0;
      this.newFilterModel.PageSize =10;
      this.newFilterModel.PageNo =0;
      this.newFilterModel.Product ="";

      var filter = {
       PageNo:0,
       PageSize:10,
       Product:"",
      };
      this.GetAllProductWithLazyLoadinFunction(filter);

  }

  AddDatabaseBackup() {
    var req = { ID: this.usermodel.ID };
    this.vapLongApiService
      .CreateBackup(req)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          // this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'backup created successfully.');
          // this.GetAllBackupHistoryList();
        } else {
          //this.toastService.showErrorToast('Error', response.ResponseText);
        }
      });
  }
  ngOnDestroy(): void {}
  emitVarientAction(event: any) {
    if (event.forLabel === "Post To Shop") {
      this.PostTOShopOrAddProductToOpenCartFunction(event.selectedRowData.ID);
    }
  }
  emitAction(event: any) {
    if (event.forLabel === "Update") {
      this.UpdateProductFunction(event.selectedRowData.ID);
    } else if (event.forLabel === "Variants") {
      this.ProductVariant(
        event.selectedRowData.ID,
        event.selectedRowData.Barcode
      );
    } else if (event.forLabel === "Locations") {
      this.LocationFunction(event.selectedRowData);
    } else if (event.forLabel === "Prices") {
      this.getAvgLastPrice(
        event.selectedRowData.ID,
        event.selectedRowData.Name,
        event.selectedRowData.SalePrice
      );
    } else if (event.forLabel === "Delete") {
      this.DeleteProduct(event.selectedRowData.ID);
    } else if (event.forLabel === "Sync Images") {
      this.SyncProductImages(event.selectedRowData.ID);
    } else if (event.forLabel === "Wishlist") {
      this.AddToWishlist(
        Number(event.selectedRowData.ArticalNo),
        event.selectedRowData.Name
      );
    } else if (event.forLabel === "Disable On Shop") {
      this.DisableOnShop(event.selectedRowData.ID);
    }
    else if (event.forLabel === "Incoming Quantity") {
      this.AddToIncomingQuantity(
        Number(event.selectedRowData.ID),
        event.selectedRowData.Name
      );     
    } 
    else if (event.forLabel === "Sync Stock") {
      this.SyncProductStocks(event.selectedRowData.ID);
    } 
    

  }
  UpdateProductFunction(ID: any) {
    this.router.navigate(["/catalog/add-product", ID]);
  }
  FilterRequestModelInilizationFunction(): void {
    this.newFilterModel = {
      ProductID : 0,
      ProductName :"",
      BLabel :"-1",
      MinPrice :0,
      MaxPrice :0,
      MinQuantity :0,
      MaxQuantity :0,
      ProductStatus :0,
      ImageStatus :0,
      ShopCategory :0,
      LocationStatus :0,
      PageSize :10,
      PageNo :0,
      Product:"",
    }
  }

  ViewProductFunction(product: any) {
    this.toastService.showInfoToast(
      "Product Selected",
      product.name);
  }

  ProductSearchFunction(value: any) {
    this.filterRequestModel.Product = value;
  }

  UpdateProductQualityStatusFunction(product: AllProductList) {
    this.IsSpinner = true;
    this.updateProductQualityStatus = new UpdateProductQualityStatus(
      product.ID,
      product.IsActive,
      product.CreatedByUserID
    );
    this.vapLongApiService
      .ProductQualityUpdateStatus(this.updateProductQualityStatus)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.IsSpinner = false;
          this.GetAllProductWithLazyLoadinFunction(this.newFilterModel);
          this.toastService.showSuccessToast("success", "Change Status Successfully");
        } else {
          this.IsSpinner = false;
          this.toastService.showErrorToast("error", "internal server Erro ! try again");
          
          console.log("internal server error !  not getting api data");
        }
      });
  }

  SyncProductImages(para: any) {
    // this.confirmationService.confirm({
    //   message: "Are you sure that you want to Sync Images with shop?",
    //   icon: "pi pi-exclamation-triangle",
    //   accept: () => {
    //     this.SyncImages(para);
    //   },
    // });
    this.confirmationService.confirm("Are you sure that you want to Sync Images with shop?").then(
      (confirmed) => {
        if(confirmed) {
          this.SyncImages(para);
        }
      }
    )
  }

  SyncProductStocks(para: any) {
    // this.confirmationService.confirm({
    //   message: "Are you sure that you want to Sync Stock?",
    //   icon: "pi pi-exclamation-triangle",
    //   accept: () => {
    //     this.SyncStocks(para);
    //   },
    // });
    this.confirmationService.confirm("Are you sure that you want to Sync Stock?").then(
      (confirmed) => {
        if(confirmed) {
          this.SyncStocks(para);
        }
      }
    )
  }

  SyncImages(para: any) {
    this.loading = true;
    const id = {
      ID: para,
      RequestedUserID: this.usermodel.ID,
    };
    this.vapLongApiService
      .SyncProductImages(id)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.toastService.showSuccessToast("success", "Product Images Sync Successfully");
          
          this.GetAllProductWithLazyLoadinFunction(this.newFilterModel);
        } else if (response.ResponseCode === -1) {
          this.loading = false;
          this.toastService.showErrorToast("error", response.ResponseText);
          
        } else {
          this.loading = false;
          console.log("internal server error !  not getting api data");
          this.toastService.showErrorToast("error", "internal server Error ! try again");
          
        }
      });
  }

  SyncStocks(para: any) {
    this.loading = true;
    const id = {
      ID: para,
      RequestedUserID: this.usermodel.ID,
    };
    this.vapLongApiService
      .SyncProductStock(id)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.toastService.showSuccessToast("success", "Product Stock Sync Successfully");
          this.GetAllProductWithLazyLoadinFunction(this.newFilterModel);
        } else if (response.ResponseCode === -1) {
          this.loading = false;
          this.toastService.showErrorToast("error", response.ResponseText);
        } else {
          this.loading = false;
          console.log("internal server error !  not getting api data");
          this.toastService.showErrorToast("error", "internal server Error ! try again");
        }
      });
  }

  DeleteProduct(para: any) {
    // this.confirmationService.confirm({
    //   message: "Are you sure that you want to Delete it?",
    //   icon: "pi pi-exclamation-triangle",
    //   accept: () => {
    //     this.DelteProductFunction(para);
    //   },
    // });

    this.confirmationService.confirm("Are you sure that you want to Delete it?").then(
      (confirmed) => {
        if(confirmed) {
          this.DelteProductFunction(para);
        }
      }
    )
  }

  DelteProductFunction(para: any) {
    this.loading = true;
    const id = {
      ID: para,
      RequestedUserID: this.usermodel.ID,
    };
    this.vapLongApiService
      .DeleteProduct(id)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.toastService.showSuccessToast("success", "Product Deleted Successfully");
          this.GetAllProductWithLazyLoadinFunction(this.newFilterModel);
        } else if (response.ResponseCode === -1) {
          this.loading = false;
          this.toastService.showErrorToast("error", "internal server Error");
          
        } else {
          this.loading = false;
          console.log("internal server error !  not getting api data");
          this.toastService.showErrorToast("error", "internal server Error ! try again");
        }
      });
  }

  DisableOnShop(para: any) {
    // this.confirmationService.confirm({
    //   message:
    //     "Are you sure that you want to Disable this product on shop and system?",
    //   icon: "pi pi-exclamation-triangle",
    //   accept: () => {
    //     this.DisableOnShopProductFunction(para);
    //   },
    // });

    this.confirmationService.confirm("Are you sure that you want to Disable this product on shop and system?").then(
      (confirmed) => {
        if(confirmed) {
          this.DisableOnShopProductFunction(para);
        }
      }
    )
  }
  DisableOnShopProductFunction(para: any) {
    this.loading = true;
    const id = {
      ID: para,
      RequestedUserID: this.usermodel.ID,
    };
    this.vapLongApiService
      .DisableProductOnShop(id)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          this.toastService.showSuccessToast("success", "Product Disabled on shop Successfully");
          this.GetAllProductWithLazyLoadinFunction(this.newFilterModel);
        } else if (response.ResponseCode === -1) {
          this.loading = false;
          this.toastService.showErrorToast("error", "internal server Error");
        } else {
          this.loading = false;
          console.log("internal server error !  not getting api data");
          this.toastService.showErrorToast("error", "internal server Error ! try again");
        }
      });
  }
  ProductVariant(para: number, barcode: any = '') {
    this.displayVariantPopup = true;
    this.open_product_variants_btn.nativeElement.click();
    const id = {
      ID: para,
    };
    this.barcode = barcode;
    this.ProductID = para;
    this.IsSpinner = true;
    this.vapLongApiService
      .GetAllProductVariantByProductID(id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          if (response.ResponseText === "success") {
            this.PorductVarientList = response.AllProductVariantList;
            console.log(this.PorductVarientList);
          } else {
            this.IsSpinner = false;
            console.log(
              "internal server error ! DeleteProduct not getting api data"
            );
          }
          this.cdr.detectChanges();
        },
        (error) => {
          console.log(
            "internal server error ! DeleteProduct not getting api data"
          );
        }
      );
  }

  GetColorDDFuntion() {
    this.ColorDropdown = [];
    this.vapLongApiService
      .GetDropDownDataColor()
      .pipe(untilDestroyed(this))
      .subscribe((responseColor: any) => {
        if (responseColor.ResponseText === "success") {
          this.selectedColorDropdownID = responseColor.DropDownData[0].ID;
          for (let i = 0; i <= responseColor.DropDownData.length - 1; i++) {
            this.ColorDropdown.push({
              value: responseColor.DropDownData[i].ID,
              label: responseColor.DropDownData[i].Name,
            });
          }
        } else {
          console.log("internal serve Error ! GetColorDDFuntion");
        }
      });
  }

  GetCodeDDFuntion() {
    this.CodeDropdown = [];
    this.vapLongApiService
      .GetDropDownDataSize()
      .pipe(untilDestroyed(this))
      .subscribe((responseCode: any) => {
        if (responseCode.ResponseText === "success") {
          this.selectedCodeDropdownID = responseCode.DropDownData[0].ID;
          for (let i = 0; i <= responseCode.DropDownData.length - 1; i++) {
            this.CodeDropdown.push({
              value: responseCode.DropDownData[i].ID,
              label: responseCode.DropDownData[i].Name,
            });
          }
        } else {
          console.log("internal serve Error ! GetCodeDDFuntion");
        }
      });
  }

  ProductVariantClosedPopUp() {
    this.displayVariantPopup = false;
    
    this.close_product_variants_btn.nativeElement.click();
  }

  UpdateProductVariantStatusFunction(para: any) {
    this.updateProductVariantStatus = new UpdateProductVariantStatus(
      para.ID,
      para.IsActive,
      para.CreatedByUserID
    );
    this.vapLongApiService
      .UpdateProductVariantStatus(this.updateProductVariantStatus)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          if (
            response.ResponseText === "success" ||
            response.ResponseCode >= 0
          ) {
            this.ProductVariant(this.ProductID);
            this.toastService.showSuccessToast("Success", "Change Status Successfully");
            
          } else {
            this.toastService.showErrorToast("error", "internal server Error ! try again");
            console.log("internal server error !");
          }
        },
        (error) => {
          console.log("internal server error !  not getting api data");
        }
      );
  }

  PostTOShopOrAddProductToOpenCartFunction(para: any) {
    const ID = {
      ID: para,
    };
    this.vapLongApiService
      .PostTOShopOrAddProductToOpenCart(ID)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          if (
            response.ResponseText === "success" ||
            response.ResponseCode === 0
          ) {
            this.ProductVariant(para.ID, this.barcode);
            this.toastService.showSuccessToast("Success", "Post To Shop Successfully");
          } else if (response.ResponseCode === -1) {
            this.toastService.showErrorToast("error",  "Error !" + response.ResponseText);
          } else {
            this.toastService.showErrorToast("error", "internal server Error ! try again");
            console.log("internal server error !");
          }
        },
        (error) => {
          console.log("internal server error !  not getting api data");
        }
      );
  }

  AddProductVarient() {
    // tslint:disable-next-line: radix
    // const sizeID = parseInt(this.selectedCodeDropdownID);
    // tslint:disable-next-line: radix
    const colorID = parseInt(this.selectedColorDropdownID);
    const sizeID = 1;
    const data = {
      ProductID: this.ProductID,
      SizeID: sizeID,
      ColorID: colorID,
      Barcode: this.barcode,
      BLabel: "",
    };
    this.vapLongApiService
      .AddProductVariant(data)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          if (
            response.ResponseText === "success" ||
            response.ResponseCode === 0
          ) {
            this.ProductVariant(this.ProductID, this.barcode);
            this.toastService.showSuccessToast("Success", "Add Product Variant Successfully");
          } else if (response.ResponseCode === 108) {
            this.toastService.showErrorToast("error",  "Already Exist");
          } else {
            this.toastService.showErrorToast("error", "internal server Error ! try again");
            console.log("internal server error !");
          }
        },
        (error) => {
          console.log("internal server error !  not getting api data");
        }
      );
  }

  LocationFunction(para: any) {
    const params = {
      ProductID: para.ID,
      ProductVariantID: 0,
      LocationStatus: 0,
      PageSize: 1000,
      PageNo: 0,
      OutletID: 6,
      Search: "",
    };
    this.displayLocationPopup = true;
    this.btn_open_modal_location.nativeElement.click();
    this.vapLongApiService
      .GetNonTrackableProductLocationDetailReport(params)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          if (response.ResponseCode === 0) {
            this.allNonTrackableProductsLocationModelList =
              response.AllNonTrackableProductsLocationModelList;
          } else if (response.ResponseCode === -1) {
            // console.log(response.ResponseText);
            this.toastService.showErrorToast("error", "internal server error");
          } else {
            this.toastService.showErrorToast("error", "No Stock Available");
          }
          this.cdr.detectChanges();
        },
        (error) => {
          console.log(
            "internal server error ! DeleteProduct not getting api data"
          );
        }
      );
  }

  // getAvgLastPrice(prodID, productName, salePrice) {
  //   this.displayPricesPopup = true;
  //   // this.productStockHistoryRequestModel =  new GetProductStockHistoryRequest(
  //   //   prodID, 0, this.usermodel.OutletID, new Date(), new Date(), 0, 100000,
  //   //   true, false, -1, -1, '', -1, 0,
  //   // );

  //   const params = {
  //     DepartmentID: -1,
  //     CategoryID: -1,
  //     SubCategoryID: 0,
  //     ClassificationID: -1,
  //     ProductID: prodID,
  //     ProductVariantID: 0,
  //     OutletID: this.usermodel.OutletID,
  //     IsGetAll: true,
  //     IsAllProduct: false,
  //     FromDate: new Date(),
  //     ToDate: new Date(),
  //     PageNo: 0,
  //     PageSize: 100000,
  //     Search: "",
  //   };
  //   this.ProdutPriceTableModel = [];
  //   this.vapLongApiService
  //     .GetAllProductStockOverall(params)
  //     .pipe(untilDestroyed(this))
  //     .subscribe((response: any) => {
  //       if (response.ResponseCode === 0) {
  //         const jsonobj = response.AllStockList;
  //         if (jsonobj.length > 0) {
  //           jsonobj.forEach((element1) => {
  //             const data = new ProdutPriceTable(
  //               productName,
  //               // this.SystemConfigModel.CurrencySign + ' ' + element1.AvgPurchasePrice,
  //               // this.SystemConfigModel.CurrencySign + ' ' + element1.PurchasePrice,
  //               // this.SystemConfigModel.CurrencySign + ' ' + element1.SalePrice,
  //               "€" + " " + element1.AvgPurchasePrice,
  //               "€" + " " + element1.PurchasePrice,
  //               "€" + " " + element1.SalePrice
  //             );
  //             this.ProdutPriceTableModel.push(data);
  //           });
  //         } else {
  //           const data = new ProdutPriceTable(
  //             productName,
  //             // this.SystemConfigModel.CurrencySign + ' ' + '0',
  //             // this.SystemConfigModel.CurrencySign + ' ' + '0',
  //             // this.SystemConfigModel.CurrencySign + ' ' + salePrice
  //             "€" + " " + "0",
  //             "€" + " " + "0",
  //             "€" + " " + salePrice
  //           );
  //           this.ProdutPriceTableModel.push(data);
  //         }
  //       } else {
  //         this.loading = false;
  //         console.log("internal server error ! not getting api data");
  //       }
  //     });
  // }

  getAvgLastPrice(prodID: any, productName: any, salePrice: any) {
    this.displayPricesPopup = true;
    this.btn_open_modal_prices.nativeElement.click();
    // this.productStockHistoryRequestModel =  new GetProductStockHistoryRequest(
    //   prodID, 0, this.usermodel.OutletID, new Date(), new Date(), 0, 100000,
    //   true, false, -1, -1, '', -1, 0,
    // );

    const params = {
      ID: prodID,
    };
    this.ProdutPriceTableModel = [];
    this.isLoadingPrices = true;
    this.vapLongApiService
      .GetProductByProductID(params)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          const jsonobj = response.ProductModel;
              const data = new ProdutPriceTable(
                productName,
                // this.SystemConfigModel.CurrencySign + ' ' + element1.AvgPurchasePrice,
                // this.SystemConfigModel.CurrencySign + ' ' + element1.PurchasePrice,
                // this.SystemConfigModel.CurrencySign + ' ' + element1.SalePrice,
                "€" + " " + jsonobj.LTAveragPurchasePrice,
                "€" + " " + jsonobj.PurchasePrice,
                "€" + " " + jsonobj.SalePrice
              );
              this.ProdutPriceTableModel.push(data);        
          }
          this.isLoadingPrices = false;
          this.cdr.detectChanges();
        });
  }

  ProductLocationClosedPopUp() {
    this.displayLocationPopup = false;
    this.btn_close_modal_location.nativeElement.click();
  }

  ProductPricesClosedPopUp() {
    this.displayPricesPopup = false;
    this.btn_close_modal_prices.nativeElement.click();
  }


 

  GetAllProductWithLazyLoadinFunction(fiterRM: any) {
    this.newFilterModel.PageNo = fiterRM.PageNo;
    this.newFilterModel.PageSize = fiterRM.PageSize;
    this.newFilterModel.ProductName = fiterRM.Product;
    this.isLoadingProducts = true;
    this.vapLongApiService
      .GetAllProductByNewSearchFilter(this.newFilterModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.totalRecords = response.TotalCount;
          this.AllProductList = response.AllProductList;
          for (const item of this.AllProductList) {
            if (item.Image != null && item.Image != "") {
              //item.DisplayImage = item.Image.split('|')[0];
              item.DisplayImage = item.Image;
            } else {
              item.DisplayImage = null;
            }
          }
        } else {
          this.IsSpinner = false;
          console.log("internal server error ! not getting api data");
        }
        this.isLoadingProducts = false;
        this.cdr.detectChanges();
      });
  }
  popUpImageFuction(imgSrc: any) {
    this.imgSrc = imgSrc;
    this.displayImage = true;
  }

  checkboxChange(event: any) {
    if (this.bChangeBarcode) {
      this.barcodechange = false;
    } else {
      this.barcodechange = true;
    }
  }
  AddToWishlist(ProductVariantID: number, Product: string) {
    this.selectedVariantIDforWishlist = ProductVariantID;
    this.selectedProductNameforWishlist = Product;
    this.isAddToWishlist = true;
    this.openWishlistModal();
  }
  CloseDialog(newValue: any) {
    this.isAddToWishlist = false;
    this.modalWishlistComponent.close();
    this.selectedVariantIDforWishlist = 0;
    this.selectedProductNameforWishlist = "";
    // console.log(newValue.IsDone);
    this.wishList.clearData();
  }
  close() {
    this.selectedVariantIDforWishlist = -1;
    this.selectedProductNameforWishlist = "";
    this.wishList.clearData();
  }
  AddMultipleProduct() {
    this.AttachDocumentPopDisplay = true;
  }
  AddMultipleShopProduct() {
    this.AttachDocumentPopDisplayForShop = true;
  }
  myUploader(event:any) {
    this.Products = [];
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
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
      const bstr = arr.join("");
      const workbook = XLSX.read(bstr, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const arraylist: any = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      for (const item of arraylist) {
        const model: any = {
          ID: 0,
          Name: item["Product Name"],
          Description: item["Description"],
          Barcode: item["Barcode"] == undefined ? "" : item["Barcode"],
          MeasuringUnitID: Number(item["MeasuringUnitID"]),
          SubCategoryID: Number(item["SubCategoryID"]),
          Tags: item["Tags"],
          IsTrackable: Boolean(item["IsTrackable"]),
          PurchasePrice: item["Buying Price"],
          SalePrice: Number(item["Sale Price"]),
          MinDiscPer: Number(item["Min Discount"]),
          MaxDiscPer: Number(item["Max Discount"]),
          ReorderPoint: Number(item["Reorder Point"]),
          MaximumStock: Number(item["Maximum Stock"]),
          BLabel: item["BLabel"],
          Image: item["image"],
          bShowInShop: Boolean(item["bShowInShop"]),
          IsLuxuryTax: Boolean(item["IsLuxuryTax"]),
          StandardTaxPercentage: item["StandardTaxPercentage"],
          TaxTypeID: item["TaxTypeID"],
          Quality: item["Quality"] == undefined ? "" : item["Quality"],
          ShopSalePrice: Number(item["ShopSalePrice"]),
          ShopAdvicePrice: Number(item["ShopAdvicePrice"]),
          bShopAllowDiscount: Boolean(item["bShopAllowDiscount"]),
          CreatedByUserID: this.usermodel.ID,

          ProductCategoryDetails: [],
        };
        // let categorys = item['Categories'] ;
        // if (categorys != '' || categorys != undefined) {
        //   let categoryArr = categorys.split(',');
        //   categoryArr.forEach(item=>{
        //     let pcdm = { ID :0,CategoryID : 0,ShopCategoryID :Number(item),Name : '',Type : 0 };
        //     model.ProductCategoryDetails.push(pcdm);
        //   });
        // }

        if (model.TaxTypeID === 0) {
          model.TaxTypeID = null;
        }
        if (model.SubCategoryID === 0) {
          model.SubCategoryID = null;
        }
        if (model.MeasuringUnitID === 0) {
          model.MeasuringUnitID = null;
        }

        this.Products.push(model);
      }
      const param = { Products: this.Products };
      this.vapLongApiService
        .AddMultipleProduct(param)
        .pipe(untilDestroyed(this))
        .subscribe((response: any) => {
          if (response.ResponseCode === 0) {
            this.AttachDocumentPopDisplay = false;
            this.toastService.showSuccessToast("Success", response.ResponseText);
            this.FilterRequestModelInilizationFunction();
          } else {
            this.toastService.showErrorToast("Error", response.ResponseText);
          }
        });
    };
  }
  myUploaderForShop(event: any) {
    this.ShopProducts = [];

    for (const file of event.files) {
      this.uploadedFilesShop.push(file);
    }
    // event.files == files to upload
    this.fileshop = event.files[0];
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.fileshop);
    fileReader.onload = (e) => {
      this.arrayBuffershop = fileReader.result;
      const data = new Uint8Array(this.arrayBuffershop);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join("");
      const workbook = XLSX.read(bstr, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const arraylist: any = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      for (const item of arraylist) {
        const model: any = {
          ID: Number(item["ProductID"]),
          Name: item["Product Name"],
          Description: item["Description"],
          Barcode: item["Barcode"] == undefined ? "" : item["Barcode"],
          MeasuringUnitID: Number(item["MeasuringUnitID"]),
          SubCategoryID: Number(item["SubCategoryID"]),
          Tags: item["Tags"],
          IsTrackable: Boolean(item["IsTrackable"]),
          PurchasePrice: item["Buying Price"],
          SalePrice: Number(item["Sale Price"]),
          MinDiscPer: Number(item["Min Discount"]),
          MaxDiscPer: Number(item["Max Discount"]),
          ReorderPoint: Number(item["Reorder Point"]),
          MaximumStock: Number(item["Maximum Stock"]),
          BLabel: item["BLabel"],
          Image: item["image"],
          bShowInShop: Boolean(item["bShowInShop"]),
          IsLuxuryTax: Boolean(item["IsLuxuryTax"]),
          StandardTaxPercentage: item["StandardTaxPercentage"],
          TaxTypeID: item["TaxTypeID"],
          Quality: item["Quality"] == undefined ? "" : item["Quality"],
          ShopSalePrice: Number(item["ShopSalePrice"]),
          ShopAdvicePrice: Number(item["ShopAdvicePrice"]),
          bShopAllowDiscount: Boolean(item["bShopAllowDiscount"]),
          CreatedByUserID: this.usermodel.ID,
          ProductCategoryDetails: [],
        };
        const categorys = item["Categories"];
        if (categorys !== "" || categorys !== undefined) {
          const categoryArr = categorys.split(",");
          categoryArr.forEach((item: any) => {
            const pcdm = {
              ID: 0,
              CategoryID: 0,
              ShopCategoryID: Number(item),
              Name: "",
              Type: 0,
            };
            model.ProductCategoryDetails.push(pcdm);
          });
        }

        if (model.TaxTypeID === 0) {
          model.TaxTypeID = null;
        }
        if (model.SubCategoryID === 0) {
          model.SubCategoryID = null;
        }
        if (model.MeasuringUnitID === 0) {
          model.MeasuringUnitID = null;
        }

        this.ShopProducts.push(model);
      }
      const param = { Products: this.ShopProducts };
      this.vapLongApiService
        .AddMultipleShopProduct(param)
        .pipe(untilDestroyed(this))
        .subscribe((response: any) => {
          if (response.ResponseCode === 0) {
            this.AttachDocumentPopDisplayForShop = false;
            this.toastService.showSuccessToast("Success", response.ResponseText);
            this.FilterRequestModelInilizationFunction();
          } else {
            this.toastService.showErrorToast("Error", response.ResponseText);
          }
        });
    };
  }
  myUploaderForImages(event: any) {
    this.ShopProducts = [];

    for (const file of event.files) {
      this.uploadedFilesShop.push(file);
    }
    // event.files == files to upload
    this.fileshop = event.files[0];
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.fileshop);
    fileReader.onload = (e) => {
      this.arrayBuffershop = fileReader.result;
      const data = new Uint8Array(this.arrayBuffershop);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join("");
      const workbook = XLSX.read(bstr, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const arraylist: any = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      for (const item of arraylist) {
        const model = {
          CreatedByUserID: 1,
          ID: Number(item["ProductID"]),
          SubCategoryID: 1,
          Image: item["Image"] == undefined ? "" : item["Image"],
        };

        this.ShopProducts.push(model);
      }
      const param = { Products: this.ShopProducts };

      this.vapLongApiService
        .CorrectImages(param)
        .pipe(untilDestroyed(this))
        .subscribe((response: any) => {
          if (response.ResponseCode === 0) {
            this.AttachDocumentPopDisplayForShop = false;
            this.toastService.showSuccessToast("Success", response.ResponseText);
            this.FilterRequestModelInilizationFunction();
          } else {
            this.toastService.showErrorToast("Error", response.ResponseText);
          }
        });
    };
  }
  AddToIncomingQuantity(ProductID: number, Product: string) {
    this.selectedProductIDforincomingQuantitylist = ProductID;
    this.selectedProductNameforincomingQuantitylist = Product;
    this.isAddToIncomingOrder = true;
    this.btn_open_modal_orders.nativeElement.click();
  }
  CloseDialog1(newValue: any) {
    this.isAddToIncomingOrder = false;
    this.btn_close_modal_orders.nativeElement.click();
    this.selectedProductIDforincomingQuantitylist = 0;
    this.selectedProductNameforincomingQuantitylist = "";
    // console.log(newValue.IsDone);
    this.incomingList.clearData();
  }
  close1() {
    this.selectedProductIDforincomingQuantitylist = -1;
    this.selectedProductNameforincomingQuantitylist = "";
    this.incomingList.clearData();
  }

  GetProductDropDownList() {
    this.ProductDropdown = [];
    this.ProductModelDropdown = [];
    this.isLoadingProducts = true;
    this.vapLongApiService.GetProductDropDownDatawithVariantInfo().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.ProductDropdown.push({ value: '0', label: 'All' });
        this.ProductModelDropdown.push({ value: '-1', label: 'All' });

        for (const item of response.DropDownData) {
          this.ProductDropdown.push({
            value: item.ProductID,
            label: item.ProductName,
          });
        }

        for (const item of response.DropDownData) {
          this.ProductModelDropdown.push({
            value: item.ProductID,
            label: item.Barcode,
          });
        }

        this.filteredProductModel = this.ProductModelDropdown;
        if (this.ProductModelDropdown.length > 0) {
          this.selectedProductModelID = -1;
        }
        this.selectedProductModel = { value: '-1', label: 'All'};

        this.filteredProduct = this.ProductDropdown;
        if (this.ProductDropdown.length > 0) {
          this.selectedProductID = 0;
        }
        this.selectedProduct = { value: '0', label: 'All'};
      } else {
        this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
      }
      this.isLoadingProducts = false;
      this.cdr.detectChanges();
    }
    );
  }
  search(event: any) {
    const filtered: any[] = [];
    const query = event.query;
    for (const item of this.ProductDropdown) {
      const product = item;

      if (product.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(product);
      }
    }
    this.filteredProduct = filtered;
  }
  
  
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

  modalMultiProductsConfig: ModalConfig = {
    modalTitle: 'Add Multiple Products',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    modalSize: 'lg',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };
  @ViewChild('modalMultiProducts') private modalMultiProductsComponent: ModalComponent;

  modalMultiProductsShopConfig: ModalConfig = {
    modalTitle: 'Add Multiple Products for shop',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    modalSize: 'lg',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };
  @ViewChild('modalMultiProductsShop') private modalMultiProductsShopComponent: ModalComponent;

  @ViewChild('open_product_variants_btn') open_product_variants_btn: ElementRef;
  @ViewChild('close_product_variants_btn') close_product_variants_btn: ElementRef;
  
  @ViewChild('btn_open_modal_location') btn_open_modal_location: ElementRef;
  @ViewChild('btn_close_modal_location') btn_close_modal_location: ElementRef;
  
  @ViewChild('btn_open_modal_prices') btn_open_modal_prices: ElementRef;
  @ViewChild('btn_close_modal_prices') btn_close_modal_prices: ElementRef;
  
  
  @ViewChild('btn_open_modal_orders') btn_open_modal_orders: ElementRef;
  @ViewChild('btn_close_modal_orders') btn_close_modal_orders: ElementRef;
  
  // activeTab: activeTabs = 'active';
  // searchTab: searchTabs = 'gsearchbyname';

  async openWishlistModal() {
    return await this.modalWishlistComponent.open();
  }

  async openMultiProductsModal() {
    return await this.modalMultiProductsComponent.open();
  }

  async openMultiProductsShopModal() {
    return await this.modalMultiProductsShopComponent.open();
  }
}
