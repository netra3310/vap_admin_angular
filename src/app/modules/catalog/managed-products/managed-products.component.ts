import { ProdutPriceTable } from "./../../../Helper/models/ProdutPriceTable";
import { SystemConfigModel } from "./../../../Helper/models/SystemConfigModel";
import { GetProductStockHistoryRequest } from "./../../../Helper/models/GetProductStockHistoryRequest";
import { AllNonTrackableProductsLocationModelList } from "./../../../Helper/models/AllNonTrackableProductsLocation";
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


type activeTabs = 'active' | 'inactive' | 'obselect';
type searchTabs =  'gsearchbyname' | 'gsearchbyattr';


@Component({
  selector: "app-managed-products",
  templateUrl: "./managed-products.component.html",
  styles: [],
  providers: [DatePipe, ConfirmationService],
})
export class ManagedProductsComponent implements OnInit, OnDestroy {
  CatalogPermission = CatalogPermissionEnum;
  // @ViewChild("dt") table: Table;
  @ViewChild("wishList") wishList: AddwishlistDialogComponent;
  @ViewChild("incomingList") incomingList: AddIncomingQuantityDialogComponent;
  imageBasePath;
  selectedProduct: AllProductList;
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
  rows = 25;
  alwaysShowPaginator = true;
  totalRecords = 0;
  filterGlobal = true;
  multiSelect = true;
  selectedVariantIDforWishlist: number;
  selectedProductNameforWishlist: string;
  isAddToWishlist = false;

  locationProductName = '';
  
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
      permission: CatalogPermissionEnum.ProductDisableOnShop,
    },
    {
      label: "Set To Obselete",
      icon: "fas fa-image",
      dependedProperty: "ID",
      permissionDisplayProperty: "NotIsObselete",
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
  initialCoulumns: any = ["IsActive", "ArticalNo", "DisplayImage", "Name", "BLabel", "Barcode", "MaximumStock", "SalePrice", "PurchasePrice", "Quality"]
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
      field: "MaximumStock",
      header: "Stock",
      sorting: "MaximumStock",
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

  initialPriceColumns = ['ProductName', 'AvgPrice', 'LastPrice', 'SalePrice']
  isLoadingPrices = true;
  
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

  isLoadingData: boolean = true;
  initPageNo = 0;
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

    const initPageNo = this.storageService.getItem('managed_products_page_no');
    const selectedFilter = this.storageService.getItem('managed_products_selected_filter');
    const gSearchFilter = this.storageService.getItem('managed_products_g_search_filter');
    if(initPageNo > 0) {
      this.initPageNo = initPageNo;
      this.storageService.removeItem('managed_products_page_no');
    }
    if(selectedFilter) {
      this.selectedFilter = Number(selectedFilter);
      this.GlobalSearchFilter = Number(gSearchFilter);
      this.initTabs();
      this.storageService.removeItem('managed_products_selected_filter');
      this.storageService.removeItem('managed_products_g_search_filter');
    }
    
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
    this.GetAllProductTotalCountProductFunction();

    this.GetColorDDFuntion();
    // this.GetCodeDDFuntion();
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
    this.storageService.setItem('managed_products_page_no', (event.curPageNo - 1));
    this.storageService.setItem('managed_products_selected_filter', this.selectedFilter);
    this.storageService.setItem('managed_products_g_search_filter', this.GlobalSearchFilter);
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
    
    else if (event.forLabel === "Set To Obselete") {
      this.SetToObselete(event.selectedRowData.ID);
    } 
    

  }
  UpdateProductFunction(ID: any) {
    this.router.navigate(["/catalog/add-product", ID]);
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
      this.initPageNo,
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
      this.GlobalSearchFilter? true: false,
      false,
      -1,
      -1,
      false,
      false,
      "",
      "",
      "",
      0,
      false,
      0,
      false,
      this.selectedFilter
    );
  }

  GetAllProductTotalCountProductFunction() {
    if (Number(this.GlobalSearchFilter) === 1) {
      this.filterRequestModel.IsReceived = true;
    } else {
      this.filterRequestModel.IsReceived = false;
    }
    this.vapLongApiService
      .GetAllProductTotalCountProduct(this.filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.totalRecords = response.TotalRowCount;
          this.cdr.detectChanges();
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

  UpdateProductQualityStatusFunction(product: AllProductList) {
    this.IsSpinner = true;
    this.isLoadingData = true;
    this.updateProductQualityStatus = new UpdateProductQualityStatus(
      product.ID,
      !product.IsActive,
      product.CreatedByUserID
    );
    this.vapLongApiService
      .ProductQualityUpdateStatus(this.updateProductQualityStatus)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.IsSpinner = false;
          this.isLoadingData = false;
          this.GetAllProductWithLazyLoadinFunction(this.filterRequestModel);
          this.toastService.showSuccessToast("success", "Change Status Successfully");
        } else {
          this.IsSpinner = false;
          this.isLoadingData = false;
          this.toastService.showErrorToast("error", "internal server Erro ! try again");
          console.log("internal server error !  not getting api data");
        }
        this.cdr.detectChanges();
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
          this.GetAllProductWithLazyLoadinFunction(this.filterRequestModel);
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
          this.GetAllProductWithLazyLoadinFunction(this.filterRequestModel);
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
          this.GetAllProductWithLazyLoadinFunction(this.filterRequestModel);
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

  SetToObselete(para: any) {
    // this.confirmationService.confirm({
    //   message:
    //     "Are you sure that you want to Obselete this product on system?",
    //   icon: "pi pi-exclamation-triangle",
    //   accept: () => {
    //     this.SetToObseleteProductFunction(para);
    //   },
    // });

    this.confirmationService.confirm("Are you sure that you want to Obselete this product on system?").then(
      (confirmed) => {
        if(confirmed) {
          this.SetToObseleteProductFunction(para);
        }
      }
    )
  }
  SetToObseleteProductFunction(Id: any) {
    this.updateProductVariantStatus = new UpdateProductVariantStatus(
      Id,
      true,
      this.usermodel.ID,
    );
    this.vapLongApiService
      .SetToObseleteProductFunction(this.updateProductVariantStatus)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          if (
            response.ResponseText === "success" ||
            response.ResponseCode >= 0
          ) {
            // this.notificationService.notify(
            //   NotificationEnum.SUCCESS,
            //   "Success",
            //   "Changed Successfully"
            // );
            this.toastService.showSuccessToast("Success", "Changed Successfully");
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
          this.GetAllProductWithLazyLoadinFunction(this.filterRequestModel);
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
  ProductVariant(para: number, barcode: string = '') {
    if(!this.displayVariantPopup) {
      this.displayVariantPopup = true;
      this.open_product_variants_btn.nativeElement.click();
    }
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
            this.cdr.detectChanges();
          } else {
            this.IsSpinner = false;
            console.log(
              "internal server error ! DeleteProduct not getting api data"
            );
          }
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
      !para.IsActive,
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
    this.locationProductName = para.Name;
    this.displayLocationPopup = true;
    this.btn_open_modal_location.nativeElement.click();
    this.IsSpinner = true;
    this.vapLongApiService
      .GetNonTrackableProductLocationDetailReport(params)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          this.IsSpinner = false;
          if (response.ResponseCode === 0) {
            this.allNonTrackableProductsLocationModelList =
              response.AllNonTrackableProductsLocationModelList;
          } else if (response.ResponseCode === -1) {
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
        this.isLoadingPrices = false;
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
              console.log("ssssssssss", this.ProdutPriceTableModel);
              this.cdr.detectChanges()
          }
        }
      );
  }

  ProductLocationClosedPopUp() {
    this.displayLocationPopup = false;
    this.btn_close_modal_location.nativeElement.click();
  }

  ProductPricesClosedPopUp() {
    this.displayPricesPopup = false;
    this.btn_close_modal_prices.nativeElement.click();
  }

  filterReport() {
    if (Number(this.selectedFilter) === 1) {
      this.filterRequestModel.Status = 1;
    } else if (Number(this.selectedFilter) === 2){
      this.filterRequestModel.Status = 2;
    }
    else
    {
      this.filterRequestModel.Status = 3;
    }
    
    this.GetAllProductWithLazyLoadinFunction(this.filterRequestModel);
  }
  GlobalSearchfilterReport() {
    if (Number(this.GlobalSearchFilter) === 1) {
      this.filterRequestModel.IsReceived = true;
    } else {
      this.filterRequestModel.IsReceived = false;
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

    if (Number(this.GlobalSearchFilter) === 1) {
      this.filterRequestModel.IsReceived = true;
    } else {
      this.filterRequestModel.IsReceived = false;
    }
    this.GetAllProductTotalCountProductFunction();
    this.isLoadingData = true;
    this.vapLongApiService
      .GetAllProductPagination(this.filterRequestModel)
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
            if(item.IsObselete!=null || item.IsObselete==true)
            {
              item.NotIsObselete = false;
            }
            else
            {
              item.NotIsObselete = true;
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
    this.openMultiProductsModal();
  }
  AddMultipleShopProduct() {
    this.AttachDocumentPopDisplayForShop = true;
    this.openMultiProductsShopModal();
  }
  myUploader(event: any) {
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
            this.modalMultiProductsComponent.close();
            this.toastService.showSuccessToast("Success", response.ResponseText);
            this.FilterRequestModelInilizationFunction();
            this.GetAllProductTotalCountProductFunction();
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
            this.modalMultiProductsShopComponent.close();
            this.toastService.showSuccessToast("Success", response.ResponseText);
            this.FilterRequestModelInilizationFunction();
            this.GetAllProductTotalCountProductFunction();
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
            this.modalMultiProductsShopComponent.close();
            this.toastService.showSuccessToast("Success", response.ResponseText);
            this.FilterRequestModelInilizationFunction();
            this.GetAllProductTotalCountProductFunction();
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
  
  activeTab: activeTabs = 'active';
  searchTab: searchTabs = 'gsearchbyname';

  async openWishlistModal() {
    return await this.modalWishlistComponent.open();
  }

  async openMultiProductsModal() {
    return await this.modalMultiProductsComponent.open();
  }

  async openMultiProductsShopModal() {
    return await this.modalMultiProductsShopComponent.open();
  }
  
  setActiveTab(tab: activeTabs) {
    this.activeTab = tab;
    switch(tab) {
      case 'active' :
        this.selectedFilter = 1;
        break;
      case 'inactive' :
        this.selectedFilter = 2;
        break;
      case 'obselect' :
        this.selectedFilter = 3;
        break;
    }
    this.filterReport(); 
  }

  setSearchTab(tab: searchTabs) {
    this.searchTab = tab;
    switch(tab) {
      case 'gsearchbyname' :
        this.GlobalSearchFilter = 1;
        break;
      case 'gsearchbyattr' :
        this.GlobalSearchFilter = 0;
        break;
    }
    this.GlobalSearchfilterReport(); 
  }
  initTabs() {
    switch(this.selectedFilter) {
      case 1:
        this.activeTab = 'active';
        break;
      case 2:
        this.activeTab = 'inactive';
        break;
      case 3:
        this.activeTab = 'obselect';
        break;
              
    }
    switch(this.GlobalSearchFilter) {
      case 0:
        this.searchTab = 'gsearchbyattr';
        break;
      case 1:
        this.searchTab = 'gsearchbyname';
        break;
              
    }
  }
}
