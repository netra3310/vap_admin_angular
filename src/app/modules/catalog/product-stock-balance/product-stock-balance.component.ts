import { SystemConfigModel } from "../../../Helper/models/SystemConfigModel";
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
// import {
//   LazyLoadEvent,
//   MenuItem,
//   ConfirmationService,
// } from "primeng/api";
import { ActivatedRoute } from "@angular/router";

import { DatePipe } from "@angular/common";

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

@Component({
  selector: "app-product-stock-balance",
  templateUrl: "./product-stock-balance.component.html",
  styles: [],
  providers: [DatePipe, ConfirmationService],
})
export class ProducStockBalanceComponent implements OnInit, OnDestroy {
  imageBasePath;
  AllProductList:any = [];
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
    {
      label: "Sync Stock",
      icon: "fas fa-image",
      dependedProperty: "ID",
    },
  ];
  columns: Columns[] = [
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
      field: "MaximumStock",
      header: "Actual Stock",
      sorting: "MaximumStock",
      placeholder: "",
      translateCol: "SSGENERIC.ActualStock",
    },
    {
      field: "RemainingStock",
      header: "Display Stock",
      sorting: "RemainingStock",
      placeholder: "",
      translateCol: "SSGENERIC.DisplayStock",
    },
    
  ];
  initialColumns = ['DisplayImage', 'Name', 'BLabel', 'MaximumStock', 'RemainingStock'];
  isLoadingData = false;
  rowsPerPageOptions = [10, 20, 50, 100];
  globalFilterFields = ['Name','BLabel'];
  // tslint:disable-next-line: max-line-length
  constructor(
    private vapLongApiService: vaplongapi,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {
    // this.breadcrumbService.setItems([
    //   { label: 'Managed Products' }
    // ]);
    this.imageBasePath = this.vapLongApiService.imageBasePath;
    this.usermodel = this.storageService.getItem("UserModel");
    // const obj = {
    //   Action: "View",
    //   Description: `View Product Image Listing`,
    //   PerformedAt: new Date().toISOString(),
    //   UserID: this.usermodel.ID,
    // };
    // this.vapLongApiService
    //   .SaveActivityLog(obj)
    //   .toPromise()
    //   .then((x) => {});
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem("UserModel");
    if(localStorage.getItem('SystemConfig')) {
      this.SystemConfigModel = JSON.parse(localStorage.getItem("SystemConfig") ?? "");
    }
    this.totalRecords = this.route.snapshot.data.val;
    this.GetAllProductWithStockDifference();
  }
 
  ngOnDestroy(): void {}
 
  emitAction(event: any) {
    if (event.forLabel === "Sync Stock") {
      this.SyncProductStocks(event.selectedRowData.ID);
    } 
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
          this.GetAllProductWithStockDifference();
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
  ViewProductFunction(product: any) {
    this.toastService.showInfoToast("Product Selected", product.name);
  }

  ProductSearchFunction(value: any) {
    this.filterRequestModel.Product = value;
  } 

  GetAllProductWithStockDifference() {  
    this.isLoadingData = true;
    this.vapLongApiService
      .GetAllProductWithDifferentStock()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
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
        } else {
          this.IsSpinner = false;
          console.log("internal server error ! not getting api data");
        }
        this.isLoadingData = false;
        this.cdr.detectChanges();
      });
  }
  popUpImageFuction(imgSrc: any) {
    this.imgSrc = imgSrc;
    this.displayImage = true;
  }
}
