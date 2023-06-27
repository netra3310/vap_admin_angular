import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
//import { LazyLoadEvent, SelectItem } from "primeng/api";
//import { Table } from "primeng/table";
import { FilterRequestModel } from "../../../Helper/models/FilterRequestModel";
import { ProductVariant } from "../../../Helper/models/Product";
import { vaplongapi } from "../../../Service/vaplongapi.service";
import { datefilter } from "src/app/Helper/datefilter";
import { Columns } from "src/app/shared/model/columns.model";
import { GenericMenuItems } from "src/app/shared/model/genric-menu-items.model";
import { TableColumnEnum } from "src/app/shared/Enum/table-column.enum";

import { ToastService } from "../../shell/services/toast.service";
import { untilDestroyed } from "src/app/shared/services/until-destroy";
import { StorageService } from "src/app/shared/services/storage.service";
import { CatalogPermissionEnum } from "src/app/shared/constant/catalog-permission";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-product-export",
  templateUrl: "./product-export.component.html",
  styleUrls: ["./product-export.component.scss"],
  styles: [],
  providers: [DatePipe],
})
export class ProductExportComponent implements OnInit, OnDestroy {
  // 
  dateForDD: any;
  SearchByDateDropdown: any[];
  selectedSearchByDateID = "";
  totalRecords = 0;
  rows = 10;
  first = 0;
  IsSpinner = false;
  Products: any[] = [];
  filterRequestModel: FilterRequestModel;
  mySearch: any;
  dateId = 6;
  filterModel = {
    PageNo: 0,
    PageSize: 10,
    Product: "",
  };
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss");
  toDate = this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss");
  password = "";
  displayPasswordPopup = false;
  selectedForPost: any;
  postType: any;
  genericMenuItems: GenericMenuItems[] = [];
  IsFirstTime = true;
  columns: Columns[] = [
    {
      field: "productChecked",
      header: "Select",
      sorting: "",
      placeholder: "",
      type: TableColumnEnum.EXPORT_COLUMN,
      translateCol: "SSGENERIC.SELECT",
    },
    {
      field: "Name",
      header: "Product",
      sorting: "Name",
      searching: true,
      placeholder: "",
      translateCol: "SSGENERIC.PRODUCT",
    },
    {
      field: "BLabel",
      header: "Model",
      sorting: "BLabel",
      searching: true,
      placeholder: "",
      translateCol: "SSGENERIC.MODEL",
    },
    {
      field: "Barcode",
      header: "EAN",
      sorting: "Barcode",
      searching: true,
      placeholder: "",
      translateCol: "SSGENERIC.EAN",
    },
    {
      field: "Quality",
      header: "Quality",
      sorting: "Quality",
      searching: true,
      placeholder: "",
      translateCol: "SSGENERIC.QUALITY",
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
      field: "MaximumStock",
      header: "Stock",
      sorting: "MaximumStock",
      placeholder: "",
      searching: true,
      translateCol: "MANAGEDPRODUCT.STOCK",
    },
  ];
  initialColumns = ['productChecked', 'Name','Quality','PurchasePrice', "Barcode", "BLabel", "ShopSalePrice","MaximumStock"];
  globalFilterFields = ["Product", "Barcode", "BLabel", "ShopSalePrice","MaximumStock"];
  rowsPerPageOptions = [10, 20, 50, 100];
  usermodel: any;

  selectedColorID = "";
  selectedBrandID = "";
  selectedProductModelID = "";
  selectedQualityLabelID = "";
  selectedProductSubModelID = "";
  selectedSeriesID = "";
  selectedBrandTypeID = "";

  selectedProductSizeID = "";
  selectedProductConnecterTypeID = "";
  selectedProductPackagingID = "";
  selectedProductCapacityID = "";
  selectedProductPowerID = "";
  selectedProductPrintID = "";

  ProductModelDropdown: any[];
  productModelItems: any[];
  ColorDropdown: any[];
  BrandDropdown: any[];
  QualityLabelDropdown: any[];

  SeriesDropdown: any[];
  BrandTypeDropdown: any[];

  ProductPackagingDD: any[];
  ProductCapacityDD: any[];
  ProductSizeDD: any[];
  ProductConnecterTypeDD: any[];
  ProductPowerDD: any[];
  ProductPrintDD: any[];
  modelProduct: any[];
  brandProduct: any[];
  qualityProduct: any[];

  AllProductModels: any[] = [];
  subModelProduct: any[] = [];
  ProductSubModelDD: any[] = [];

  isLoadingProducts = false;
  constructor(
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private router: Router,
    private vapLongApiService: vaplongapi,
    private storageService: StorageService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    this.totalRecords = this.route.snapshot.data.val;
    this.usermodel = this.storageService.getItem("UserModel");
    const obj = {
      Action: "Listing",
      Description: `product export page`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID,
    };
    this.vapLongApiService
      .SaveActivityLog(obj)
      .toPromise()
      .then((x) => {});
  }

  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.GetColorDDFunction(0);
    this.GetQualityLabelDDFunction(0);
    this.GetProductModelDDFunction(0);
    this.GetSizeDDFunction(0);
    this.GetConnecterTypeDDFunction(0);
    this.GetCapacityDDFunction(0);
    this.GetPackagingDDFunction(0);
    this.GetPowerDDFunction(0);
    this.GetPrintDDFunction(0);
    this.GetBrandDDFunction(0);
    //this.GetSearchByDateDropDownList();
    // this.GetAllProductWithLazyLoadFunction(this.filterModel);
  }
  emitAction(event: any) {}

  // GetBrandDDFunction(ID: any) {
  //   this.BrandDropdown = [];
  //   this.vapLongApiService.GetAllBrands().pipe(untilDestroyed(this)).subscribe((response: any) => {
  //     if (response.ResponseCode === 0) {
  //       this.brandProduct = response.AllBrandsList.filter((x: any) => x.IsActive !== false);

  //       this.BrandDropdown.push({ value: '0', label: 'All' });
  //       this.selectedBrandID = '0';
  //       for (const item of this.brandProduct) {
  //         this.BrandDropdown.push({
  //           value: item.ID,
  //           label: item.Name,
  //         });
  //       }
  //     }
  //   },
  //     error => {
  //       this.toastService.showErrorToast('error', 'internal server error ! GetProductModelDropDownData function not getting data');
  //     });

  // }

  GetSizeDDFunction(ID: any) {
    this.ProductSizeDD = [];
    this.vapLongApiService
      .GetDropDownDataSize()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.ProductSizeDD.push({ value: "0", label: "All" });
          if (ID === 0) {
            // this.selectedProductSizeID = response.DropDownData[0]?.ID;
            this.selectedProductSizeID = "0";
          } else {
            this.selectedProductSizeID = ID;
          }
          for (const item of response.DropDownData) {
            this.ProductSizeDD.push({
              value: item.ID,
              label: item.Name,
            });
          }
        } else {
          this.toastService.showErrorToast('Error', 'Internal serve error');
          
          // console.log('internal serve Error', response);
        }
      });
  }

  GetConnecterTypeDDFunction(ID: any) {
    this.ProductConnecterTypeDD = [];
    this.vapLongApiService
      .GetDropDownDataConnecterType()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.ProductConnecterTypeDD.push({ value: "0", label: "All" });
          if (ID === 0) {
            //this.selectedProductConnecterTypeID = response.DropDownData[0]?.ID;
            this.selectedProductConnecterTypeID = "0";
          } else {
            this.selectedProductConnecterTypeID = ID;
          }
          for (const item of response.DropDownData) {
            this.ProductConnecterTypeDD.push({
              value: item.ID,
              label: item.Name,
            });
          }
        } else {
          this.toastService.showErrorToast('Error', 'Internal serve error');
          // console.log('internal serve Error', response);
        }
      });
  }

  GetPackagingDDFunction(ID: any) {
    this.ProductPackagingDD = [];
    this.vapLongApiService
      .GetDropDownDataPackaging()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.ProductPackagingDD.push({ value: "0", label: "All" });
          if (ID === 0) {
            //this.selectedProductPackagingID = response.DropDownData[0]?.ID;
            this.selectedProductPackagingID = "0";
          } else {
            this.selectedProductPackagingID = ID;
          }
          for (const item of response.DropDownData) {
            this.ProductPackagingDD.push({
              value: item.ID,
              label: item.Name,
            });
          }
          this.cdr.detectChanges();
        } else {
          this.toastService.showErrorToast('Error', 'Internal serve error');
          // console.log('internal serve Error', response);
        }
      });
  }

  GetCapacityDDFunction(ID: any) {
    this.ProductCapacityDD = [];
    this.vapLongApiService
      .GetDropDownDataCapacity()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.ProductCapacityDD.push({ value: "0", label: "All" });
          if (ID === 0) {
            //this.selectedProductCapacityID = response.DropDownData[0]?.ID;
            this.selectedProductCapacityID = "0";
          } else {
            this.selectedProductCapacityID = ID;
          }
          for (const item of response.DropDownData) {
            this.ProductCapacityDD.push({
              value: item.ID,
              label: item.Name,
            });
          }
          this.cdr.detectChanges();
        } else {
          this.toastService.showErrorToast('Error', 'Internal serve error');
          // console.log('internal serve Error', response);
        }
      });
  }

  GetPowerDDFunction(ID: any) {
    this.ProductPowerDD = [];
    this.vapLongApiService
      .GetDropDownDataPower()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.ProductPowerDD.push({ value: "0", label: "All" });
          if (ID === 0) {
            //this.selectedProductPowerID = response.DropDownData[0]?.ID;
            this.selectedProductPowerID = "0";
          } else {
            this.selectedProductPowerID = ID;
          }
          for (const item of response.DropDownData) {
            this.ProductPowerDD.push({
              value: item.ID,
              label: item.Name,
            });
          }
        } else {
          this.toastService.showErrorToast('Error', 'Internal serve error');
          // console.log('internal serve Error', response);
        }
      });
  }
  GetPrintDDFunction(ID: any) {
    this.ProductPrintDD = [];
    this.vapLongApiService
      .GetDropDownDataPrint()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.ProductPrintDD.push({ value: "0", label: "All" });
          if (ID === 0) {
            //this.selectedProductPrintID = response.DropDownData[0]?.ID;
            this.selectedProductPrintID = "0";
          } else {
            this.selectedProductPrintID = ID;
          }
          for (const item of response.DropDownData) {
            this.ProductPrintDD.push({
              value: item.ID,
              label: item.Name,
            });
          }
        } else {
          this.toastService.showErrorToast('Error', 'Internal serve error');
          // console.log('internal serve Error', response);
        }
      });
  }

  GetBrandDDFunction(ID: any) {
    this.BrandDropdown = [];
    this.vapLongApiService
      .GetDropDownDataBrand()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.BrandDropdown.push({ value: "0", label: "All" });
          if (ID === 0) {
            //this.selectedBrandID = response.DropDownData[0]?.ID;
            this.selectedBrandID = "0";
            this.GetBrandTypeByBrandID(this.selectedBrandID);
            this.GetSeriesByBrandID(this.selectedBrandID);
          } else {
            this.selectedBrandID = ID;
            this.GetBrandTypeByBrandID(this.selectedBrandID);
            this.GetSeriesByBrandID(this.selectedBrandID);
          }

          for (const item of response.DropDownData) {
            this.BrandDropdown.push({
              value: item.ID,
              label: item.Name,
            });
          }
        } else {
          this.toastService.showErrorToast('Error', 'Internal serve error');
          // console.log('internal serve Error', response);
        }
        this.cdr.detectChanges();
      });
  }
  GetSeriesByBrandID(Id: any) {
    // tslint:disable-next-line: prefer-const
    this.SeriesDropdown = [];
    if (Id != 0) {
      let id = {
        ID: Id,
      };
      this.vapLongApiService
        .GetProductSeriesByBrandID(id)
        .pipe(untilDestroyed(this))
        .subscribe((response) => {
          if (response.ResponseText === "success") {
            this.SeriesDropdown.push({
              value: "-1",
              label: "All",
            });
            this.SeriesDropdown.push({
              value: "0",
              label: "N.A.",
            });
            if (response.DropDownData.length > 0) {
              if (this.selectedSeriesID == "-1") {
                //this.selectedSeriesID = response.DropDownData[0].ID;
                this.selectedSeriesID = '-1';
              } else {
                var selectedOne = response.DropDownData.filter(
                  (x: any) => x.ID == Number(this.selectedSeriesID)
                );
                if (selectedOne.length > 0)
                  this.selectedSeriesID = selectedOne[0].ID;
                else this.selectedSeriesID = response.DropDownData[0].ID;
              }
            }

            for (let i = 0; i < response.DropDownData.length; i++) {
              this.SeriesDropdown.push({
                value: response.DropDownData[i].ID,
                label: response.DropDownData[i].Name,
              });
            }
          } else {
            console.log("internal serve Error", response);
          }
          this.cdr.detectChanges();
        });
    } else {
      this.SeriesDropdown.push({
        value: "-1",
        label: "All",
      });
      this.SeriesDropdown.push({
        value: "0",
        label: "N.A.",
      });
      this.selectedSeriesID = "-1";
    }
  }
  GetBrandTypeByBrandID(Id: any) {
    // tslint:disable-next-line: prefer-const
    this.BrandTypeDropdown = [];
    if (Id != 0) {
      let id = {
        ID: Id,
      };
      this.vapLongApiService
        .GetBrandTypeByBrandID(id)
        .pipe(untilDestroyed(this))
        .subscribe((response) => {
          if (response.ResponseText === "success") {
            this.BrandTypeDropdown.push({
              value: "-1",
              label: "All",
            });
            this.BrandTypeDropdown.push({
              value: "0",
              label: "N.A.",
            });
            if (response.DropDownData.length > 0) {
              if (this.selectedBrandTypeID == "-1") {
                // this.selectedBrandTypeID = response.DropDownData[0].ID;
                this.selectedBrandTypeID = '-1';
              } else {
                var selectedOne = response.DropDownData.filter(
                  (x: any) => x.ID == Number(this.selectedBrandTypeID)
                );
                if (selectedOne.length > 0)
                  this.selectedBrandTypeID = selectedOne[0].ID;
                else this.selectedBrandTypeID = response.DropDownData[0].ID;
              }
            }

            for (let i = 0; i < response.DropDownData.length; i++) {
              this.BrandTypeDropdown.push({
                value: response.DropDownData[i].ID,
                label: response.DropDownData[i].Name,
              });
            }
          } else {
            console.log("internal serve Error", response);
          }
          this.cdr.detectChanges();
        });
    } else {
      this.BrandTypeDropdown.push({
        value: "-1",
        label: "All",
      });
      this.BrandTypeDropdown.push({
        value: "0",
        label: "N.A.",
      });
      this.selectedBrandTypeID = "-1";
    }
  }

  productBrandChange(event: any) {
    this.GetBrandTypeByBrandID(event.value);
    this.GetSeriesByBrandID(event.value);

    //this.BrandLabel= this.brandProduct.filter((x: any) => x.ID === Number(event.value))[0].Description;
  }
  GetColorDDFunction(ID: any) {
    this.ColorDropdown = [];
    this.vapLongApiService
      .GetDropDownDataColor()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.ColorDropdown.push({ value: "0", label: "All" });
          this.selectedColorID = "0";
          for (const item of response.DropDownData) {
            this.ColorDropdown.push({
              value: item.ID,
              label: item.Name,
            });
          }
        } else {
          this.toastService.showErrorToast('Error', 'Internal serve error');
          // console.log('internal serve Error', response);
        }
        this.cdr.detectChanges();
      });
  }
  GetQualityLabelDDFunction(ID: any) {
    this.QualityLabelDropdown = [];
    this.vapLongApiService
      .QualityLabelDD()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.QualityLabelDropdown.push({ value: "0", label: "All" });
          this.selectedQualityLabelID = "0";

          for (const item of response.DropDownData) {
            this.QualityLabelDropdown.push({
              value: item.ID,
              label: item.Name,
            });
          }
        } else {
          this.toastService.showErrorToast('Error', 'Internal serve error');
          // console.log('internal serve Error', response);
        }
      });
  }

  GetProductModelDDFunction(para: any) {
    this.ProductModelDropdown = [];
    this.modelProduct = [];
    this.ProductModelDropdown.push({ value: "0", label: "All" });
    this.selectedProductModelID = "0";
    this.vapLongApiService
      .GetProductModelListData()
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          if (response.ResponseCode === 0) {
            this.AllProductModels = response.ProductModels.filter(
              (x: any) => x.IsActive !== false
            );
            this.modelProduct = this.AllProductModels.filter(
              (x) => x.ParentID == 0 && x.IsActive !== false
            );
            for (const item of this.modelProduct) {
              this.ProductModelDropdown.push({
                value: item.Description,
                label: item.DisplayName,
              });
            }
           
          }
          this.selectedProductSubModelID = "-1";
          this.ProductSubModelDD.push({
            value: "-1",
            label: "All",
          });
        },
        (error) => {
          this.toastService.showErrorToast("error", "internal server error ! GetProductModelDropDownData function not getting data");
          // console.log('internal server error ! GetProductModelDropDownData function not getting data');
        }
      );
  }
  GetProductSubModelDDFunction(para: any) {
    this.subModelProduct = [];
    this.ProductSubModelDD = [];
    if (para == "0") {
      return;
    }
    let mID = this.AllProductModels.filter((x) => x.Description == para)[0].ID;

    this.subModelProduct = this.AllProductModels.filter(
      (x) => x.ParentID == mID
    );
    if (this.subModelProduct.length > 0) {
      // this.selectedProductSubModelID = this.subModelProduct[0].ID;
      this.selectedProductSubModelID = "-1";
      this.ProductSubModelDD.push({
        value: "-1",
        label: "All",
      });
      for (const item of this.subModelProduct) {
        this.ProductSubModelDD.push({
          value: item.ID,
          label: item.Name,
        });
      }
    } else {
      // this.selectedProductSubModelID = "";
      this.selectedProductSubModelID = "-1";
    }
  }
  productModelChange(event: any) {
    this.GetProductSubModelDDFunction(event.value);
  }
  GetAllProductWithLazyLoadFunction(filterRM: any) {
    if(this.IsFirstTime)
    {
      this.IsFirstTime = false;
      return;
    }
    this.Products = [];
    const filterRequestModel = new FilterRequestModel();
    filterRequestModel.FromDate = new Date(
      this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss") ?? ""
    );
    filterRequestModel.ToDate = new Date(
      this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss") ?? ""
    );
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = true;
    filterRequestModel.BrandID = Number(this.selectedBrandID);
    filterRequestModel.BrandTypeID = Number(this.selectedBrandTypeID);
    filterRequestModel.ColorID = Number(this.selectedColorID);
    filterRequestModel.QualityLabelID = Number(this.selectedQualityLabelID);
    filterRequestModel.Product = filterRM.Product;
    filterRequestModel.SeriesID = Number(this.selectedSeriesID);
    filterRequestModel.SizeID = Number(this.selectedProductSizeID);
    filterRequestModel.ConnecterTypeID = Number(
      this.selectedProductConnecterTypeID
    );
    filterRequestModel.CapacityID = Number(this.selectedProductCapacityID);
    filterRequestModel.PackagingID = Number(this.selectedProductPackagingID);
    filterRequestModel.PowerID = Number(this.selectedProductPowerID);
    filterRequestModel.PrintID = Number(this.selectedProductPrintID);

    if (this.selectedProductModelID != "0") {
      // if(filterRM.Product!="")
      // filterRequestModel.Product = this.selectedProductModelID+" "+filterRM.Product;
      // else
      // filterRequestModel.Product = this.selectedProductModelID;
      if (this.selectedProductSubModelID == "-1") {
        filterRequestModel.ColumnName = this.selectedProductModelID;
        filterRequestModel.ID = 0;
      } else {
        filterRequestModel.ID = Number(this.selectedProductSubModelID);
      }
    } else {
      filterRequestModel.ID = 0;
      filterRequestModel.ColumnName = "";

      //filterRequestModel.Product = filterRM.Product;
    }
    this.isLoadingProducts = true;
    this.vapLongApiService
      .GetAllProductExportPagination(filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.isLoadingProducts = false;
        if (response.ResponseText === "success") {
          if (response.TotalCount == 0) {
            this.toastService.showInfoToast("Info", "No records found against these filters.");
          }
          this.totalRecords = response.TotalCount;
          this.Products = response.AllProductList;
          this.Products.forEach((element) => {
            element.productChecked = false;
            if (element.ProductImage != null && element.ProductImage != "") {
              element.DisplayImage = element.ProductImage.split("|")[0];
            } else {
              element.DisplayImage = null;
            }
          });
          this.cdr.detectChanges();
        } else {
          this.toastService.showErrorToast("error", "internal server Error");
        }
      });
  }

  Reset() {
    this.GetAllProductWithLazyLoadFunction(this.filterModel);
  }
}
