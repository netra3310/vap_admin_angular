// import { NotificationService } from "./../../shell/services/notification.service";

import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
// import {
//   ConfirmationService,
//   SelectItem,
//   Message,
//   LazyLoadEvent,
// } from "primeng/api";
/* import { BreadcrumbService } from 'src/app/app.breadcrumb.service'; */
import { FilterRequestModel } from "src/app/Helper/models/FilterRequestModel";
import { FolderHierarchys } from "src/app/Helper/models/FolderHierarchys";
import { AllProductList, IProductModel } from "src/app/Helper/models/Product";
import { vaplongapi } from "src/app/Service/vaplongapi.service";
import { UserModel } from "src/app/Helper/models/UserModel";
import { SystemConfigModel } from "src/app/Helper/models/SystemConfigModel";
// 
import { CatalogPermissionEnum } from "src/app/shared/constant/catalog-permission";
import { StorageService } from "src/app/shared/services/storage.service";
import { untilDestroyed } from "src/app/shared/services/until-destroy";
// import { isNullOrUndefined } from "util";
import { IImageModel } from "src/app/Helper/models/ImageModel";
import { Columns } from "src/app/shared/model/columns.model";
import { TableColumnEnum } from "src/app/shared/Enum/table-column.enum";
import { UpdateStatus } from "src/app/Helper/models/UpdateStatus";

import { randomNumber } from '../../../Helper/randomNumber';
import { ConfirmationService } from "src/app/Service/confirmation.service";
import { ToastService } from "../../shell/services/toast.service";
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';
import { LoadingService } from "../../shell/services/loading.service";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"],
  providers: [ConfirmationService],
})
export class AddProductComponent implements OnInit, OnDestroy {
  modalCaptchaConfig: ModalConfig = {
    modalTitle: 'User Captcha',
    modalContent: "Modal Content",
    // dismissButtonLabel: 'Submit',
    // closeButtonLabel: 'Cancel'
    hideCloseButton: () => true,
    hideDismissButton: () => true,
    modalSize: 'md'
  };

  @ViewChild('modalCaptcha') private modalCaptchaComponent: ModalComponent;
  CatalogPermission = CatalogPermissionEnum;
  trackable = "nonTrackable";
  nonTrackable: string;
  selectedFolder: any;
  selectedImage: any;
  AllProductModels: any[] = [];
  updateStatusModel: UpdateStatus;

  ImagesList: any[] = [];
  folderImagesList: FolderHierarchys;
  Images: any[] = [];
  selectedImages: any[] = [];
  imageBasePath = "";
  selectedProductModelID: any;
  selectedClassificationID = "";
  selectedMeasuringUnitID = "";
  selectedColorID = "";
  selectedTypeID = "1";
  selectedSeriesID = "";
  selectedBrandID = "";
  selectedBrandTypeID = "";

  selectedProductSizeID = "1";
  selectedProductConnecterTypeID = "1";
  selectedProductPackagingID = "1";
  selectedProductCapacityID = "1";
  selectedProductPowerID = "1";
  selectedProductPrintID = "1";

  isCaptchaDisplayed = false;
  isCapchaValidated = false;
  firstNumber=0;
  secondNumber=0;

  selectedProductSubModelID = "0";
  selectedQualityLabelID = "";
  selectedDepartmentID = "";
  selectedCategoryID = "";
  selectedSubCategoryID = "";
  ProductName = "";
  FoldersSearch = "";
  FolderName = "";
  ProductButtonLabel = "";
  buttonIcon = "";
  routeID: any;
  bShowInShop : any = true;
  bShowForReseller = true;
  IsObselete = false;

  bAddToWishList : any = true;
  shopEnable = true;

  ModelLabel = "";
  BrandLabel = "";
  LabelNo = "";

  filterRequestModel: FilterRequestModel;
  folderHierarchys: FolderHierarchys[] = [];
  ProductModelApiList: any[];
  productModelItems: any[];
  ClassificationDropdown: any[];
  MeasuringUnitDropdown: any[];
  ColorDropdown: any[];
  BrandDropdown: any[];
  TypeDropdown: any[];
  SeriesDropdown: any[];
  BrandTypeDropdown: any[];

  ProductPackagingDD: any[];
  ProductCapacityDD: any[];
  ProductSizeDD: any[];
  ProductConnecterTypeDD: any[];
  ProductPowerDD: any[];
  ProductPrintDD: any[];

  ProductSubModelDD: any[];

  QualityLabelDropdown: any[];
  DepartmentDropdown: any[];
  CategoryDropdown: any[];
  SubCategoryDropdown: any[];
  PurchasePriceDisabled = false;
  Sourcelist: any[] = [];
  Targetlist: any = [];

  valCheck: string[] = [];
  QRProductDetails:any;
  productModelId : any;
  selectedState: any;
  valSwitch: boolean;
  display = false;
  IsSpinner = false;
  AttachImagesPopDisplay = false;
  displayCustom: boolean;
  displayBasic: boolean;
  activeIndex = 0;
  addProduct: IProductModel = {};
  usermodel: UserModel;
  SystemConfigModel: SystemConfigModel;
  modelProduct: any[];
  brandProduct: any[];
  oldCategoryDetailID : any = 0;
  totalRecords = 0;
  first = 0;
  totalRecords1 = 0;
  first1 = 0;
  rows = 5;
  AttachDocumentPopDisplay = false;
  folderHierarchy: FolderHierarchys;
  base64textString: IImageModel[] = [];
  uploadedFiles: any[] = [];
  filterModel = {
    PageNo: 0,
    PageSize: 5,
    Product: "",
  };

  columns: Columns[] = [
    {
      field: "Image",
      header: "Image",
      sorting: "",
      placeholder: "",
      isImage: true,
      type: TableColumnEnum.IMAGE,
      translateCol: "SSGENERIC.IMAGE",
    },
    {
      field: "ImageName",
      header: "Image",
      sorting: "ImageName",
      placeholder: "",
      translateCol: "SSGENERIC.IMAGE",
    },
    {
      field: "ImageName",
      header: "Action",
      sorting: "",
      placeholder: "",
      type: TableColumnEnum.DELETE_BUTTON,
      translateCol: "SSGENERIC.ACTION",
    },
  ];
  initialColumnsImages = ['Image', 'ImageName']
  globalFilterFields = ["Image"];
  rowsPerPageOptions = [5, 10, 20, 50, 100];
  IsAdd = true;
  subModelProduct : any;
  // tslint:disable-next-line: max-line-length
  
  folderColumns: Columns[] = [
    { field: 'Name', header: 'Folder Name', sorting: 'Name', placeholder: '', },
    { field: 'Description', header: 'Path', sorting: 'Description', placeholder: '' , },
    { field: 'Action', header: 'Action', sorting: 'Action', placeholder: '' ,type:TableColumnEnum.FileUpload },
  ];
  isLoading: boolean = true;
  initialColumns: any = ['Name', 'Description', 'Action']
  loadingCategory = false;
  
  // @ViewChild('btn_open_modal_attachment') btn_open_modal_attachment: ElementRef;
  @ViewChild('btn_open_modal_attach_img') btn_open_modal_attach_img: ElementRef;
  @ViewChild('btn_open_modal_doc_attach') btn_open_modal_doc_attach: ElementRef;
  
  modalDocAttachConfig: ModalConfig = {
    modalTitle: 'Document Attachment',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    modalSize: 'lg',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };
  @ViewChild('modalDocAttach') private modalDocAttachComponent: ModalComponent;

  modalCategoryAssignmentConfig: ModalConfig = {
    modalTitle: 'Category Assignment',
    modalContent: "",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    modalSize: 'xl',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };
  @ViewChild('modalCategoryAssignment') private modalCategoryAssignmentComponent: ModalComponent;
  loadingAction = false;
  constructor(
    private route: ActivatedRoute,
    private vapLongApiService: vaplongapi,
    private confirmationService: ConfirmationService,
    // private toastService: ToastService,
    private toastService: ToastService,
    private router: Router,
    private storageService: StorageService,
    private chref: ChangeDetectorRef,
    private loadingService: LoadingService
  ) {
    this.routeID = this.route.snapshot.params.id;
    this.imageBasePath = this.vapLongApiService.imageBasePath;
    this.addProduct.MinDiscPer = 0;
    this.addProduct.MaxDiscPer = 0;
    this.addProduct.ReorderPoint = 0;
    this.addProduct.MaximumStock = 0;
    this.addProduct.IsObselete = false;
    this.addProduct.bShopAllowDiscount = false;
  }

  ngOnInit(): void {
    // this.addProduct.bShowInShop = false;
    this.usermodel = this.storageService.getItem("UserModel");
    if(localStorage.getItem('SystemConfig')) {
      this.SystemConfigModel = JSON.parse(localStorage.getItem("SystemConfig") ?? "");
    }

    if (this.routeID !== "0") {
      this.ProductButtonLabel = "Update Product";
      this.buttonIcon = "fas fa-pen";
      this.IsAdd = false;
      this.fillFields(this.routeID);
    } else {
      this.ProductButtonLabel = "Add Product";
      this.buttonIcon = "fas fa-plus";
      this.IsAdd = true;
      this.GetMeasuringUnitDDFunction(0);
      this.GetColorDDFunction(0);
      this.GetBrandDDFunction(0);
      this.GetQualityLabelDDFunction(0);
      this.GetProductModelDDFunction(0);
      this.GetClassificationDDFunction(0, false, 0, 0, 0);
      this.GetSizeDDFunction(0);
      this.GetConnecterTypeDDFunction(0);
      this.GetCapacityDDFunction(0);
      this.GetPackagingDDFunction(0);
      this.GetPowerDDFunction(0);
      this.GetPrintDDFunction(0);
      //this.GetTypeDDFunction(0);
      //this.GetSeriesDDFunction(0);
    }
  }
  ngOnDestroy(): void {}

  GetProductModelDDFunction(para: any) {
    this.ProductModelApiList = [];
    this.modelProduct = [];
    this.vapLongApiService
      .GetProductModelListData()
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          if (response.ResponseCode === 0) {
            this.AllProductModels = response.ProductModels.filter(
              (x : any) => x.IsActive !== false
            );
            this.modelProduct = this.AllProductModels.filter(
              (x : any) => x.ParentID == 0 && x.IsActive !== false
            );

            if (para !== 0) {
              let pModel = this.modelProduct.filter(
                (x : any) => x.Description === para
              );
              if (pModel.length > 0) {
                this.selectedProductModelID = pModel[0].Description;
                this.GetProductSubModelDDFunction(this.selectedProductModelID);
              } else {
                this.selectedProductModelID = this.modelProduct[0].Description;
                this.GetProductSubModelDDFunction(this.selectedProductModelID);
              }
              //this.ModelLabel = this.selectedProductModelID;
            } else {
              this.selectedProductModelID = this.modelProduct[0].Description;
              this.addProduct.BLabel = this.selectedProductModelID;
              this.GetProductSubModelDDFunction(this.selectedProductModelID);

              //this.ModelLabel = this.selectedProductModelID;
            }
            for (const item of this.modelProduct) {
              this.ProductModelApiList.push({
                value: item.Description,
                label: item.Name,
              });
            }
          }
        },
        (error) => {
          // this.notificationService.notify(
          //   NotificationEnum.ERROR,
          //   "error",
          //   "internal server error ! GetProductModelDropDownData function not getting data"
          // );
          this.toastService.showErrorToast("Error", "internal server error ! GetProductModelDropDownData function not getting data");
          // console.log('internal server error ! GetProductModelDropDownData function not getting data');
        }
      );
  }

  GetProductSubModelDDFunction(para: any) {
    this.subModelProduct = [];
    this.ProductSubModelDD = [];
    let mID = this.AllProductModels.filter((x : any) => x.Description == para)[0].ID;

    this.subModelProduct = this.AllProductModels.filter(
      (x : any) => x.ParentID == mID
    );
    if (this.subModelProduct.length > 0) {
      if (this.selectedProductSubModelID == "0")
        //this.selectedProductSubModelID = this.subModelProduct[0].ID;
        this.ProductSubModelDD.push({
          value: 0,
          label: "N.A.",
        });
      else {
        var selectedOne = this.subModelProduct.filter(
          (x : any) => x.ID == Number(this.selectedProductSubModelID)
        );
        if (selectedOne.length > 0)
          this.selectedProductSubModelID = selectedOne[0].ID;
        else this.selectedProductSubModelID = this.subModelProduct[0].ID;
      }

      for (const item of this.subModelProduct) {
        this.ProductSubModelDD.push({
          value: item.ID,
          label: item.Name,
        });
      }
    }
  }

  productModelChange(event: any) {
    // tslint:disable-next-line: deprecation
    if (this.addProduct.ID === 0 || (this.addProduct.ID === null || this.addProduct.ID === undefined)) {
      this.addProduct.BLabel = event.value;
      //this.ModelLabel= event.value;
    } else {
      //this.addProduct.BLabel = event.value + '-' + this.addProduct.ID;
      this.addProduct.BLabel = event.value;
      //this.ModelLabel= event.value;
    }
    this.GetProductSubModelDDFunction(event.value);
  }

  // GetSeriesDDFunction(ID : any) {
  //   this.SeriesDropdown = [];
  //   this.vapLongApiService.GetDropDownDataSeries().pipe(untilDestroyed(this)).subscribe((response: any) => {
  //     if (response.ResponseText === 'success') {
  //       if (ID === 0) {
  //         this.selectedSeriesID = response.DropDownData[0]?.ID;
  //       } else {
  //         this.selectedSeriesID = ID;
  //       }
  //       for (const item of response.DropDownData) {
  //         this.SeriesDropdown.push({
  //           value: item.ID,
  //           label: item.Name,
  //         });
  //       }
  //     }
  //     else {
  //       this.toastService.showErrorToast('error', 'internal serve Error');
  //       // console.log('internal serve Error', response);
  //     }
  //   });
  // }
  GetSeriesByBrandID(Id : any) {
    // tslint:disable-next-line: prefer-const
    let id = {
      ID: Id,
    };
    this.SeriesDropdown = [];
    this.vapLongApiService
      .GetProductSeriesByBrandID(id)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        if (response.ResponseText === "success") {
          if (response.DropDownData.length > 0) {
            if (this.selectedSeriesID == "0") {
              //this.selectedSeriesID = response.DropDownData[0].ID;
              this.SeriesDropdown.push({
                value: 0,
                label: "N.A.",
              });
            } else {
              var selectedOne = response.DropDownData.filter(
                (x : any) => x.ID == Number(this.selectedSeriesID)
              );
              if (selectedOne.length > 0)
                this.selectedSeriesID = selectedOne[0].ID;
              else this.selectedSeriesID = response.DropDownData[0].ID;
            }
          }
          else
          {
            this.SeriesDropdown.push({
              value: 0,
              label: "N.A.",
            });

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
        this.chref.detectChanges();
      });
  }
  GetBrandTypeByBrandID(Id : any) {
    // tslint:disable-next-line: prefer-const
    let id = {
      ID: Id,
    };
    this.BrandTypeDropdown = [];
    this.vapLongApiService
      .GetBrandTypeByBrandID(id)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        if (response.ResponseText === "success") {
          if (response.DropDownData.length > 0) {
            if (this.selectedBrandTypeID == "0")
            {
//this.selectedBrandTypeID = response.DropDownData[0].ID;
this.BrandTypeDropdown.push({
  value: 0,
  label: "N.A.",
});
            }
            else {
              var selectedOne = response.DropDownData.filter(
                (x : any) => x.ID == Number(this.selectedBrandTypeID)
              );
              if (selectedOne.length > 0)
                this.selectedBrandTypeID = selectedOne[0].ID;
              else this.selectedBrandTypeID = response.DropDownData[0].ID;
            }
          }
          else
          {
            this.BrandTypeDropdown.push({
              value: 0,
              label: "N.A.",
            });
            this.selectedBrandTypeID = '0';
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
        this.chref.detectChanges();
      });
  }

  productBrandChange(event: any) {
    this.GetBrandTypeByBrandID(event.value);
    this.GetSeriesByBrandID(event.value);

    //this.BrandLabel= this.brandProduct.filter((x: any) => x.ID === Number(event.value))[0].Description;
  }
  onProductNameChange(event: any) {
    this.addProduct.Description = event.value;
    this.addProduct.Tags = event.value;
  }

  GetMeasuringUnitDDFunction(ID : any) {
    this.MeasuringUnitDropdown = [];
    this.vapLongApiService
      .GetMeasuringUnitDD()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          if (ID === 0) {
            this.selectedMeasuringUnitID = response.DropDownData[ID]?.ID;
          } else {
            this.selectedMeasuringUnitID = ID;
          }
          for (const item of response.DropDownData) {
            this.MeasuringUnitDropdown.push({
              value: item.ID,
              label: item.Name,
            });
          }
        } else {
          // this.notificationService.notify(
          //   NotificationEnum.ERROR,
          //   "error",
          //   "internal serve Error"
          // );
          this.toastService.showErrorToast("Error", "internal serve Error");
          // console.log('internal serve Error', response);
        }
      });
  }
  GetColorDDFunction(ID : any) {
    this.ColorDropdown = [];
    this.vapLongApiService
      .GetDropDownDataColor()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          if (ID === 0) {
            this.selectedColorID = response.DropDownData[0]?.ID;
          } else {
            this.selectedColorID = ID;
          }
          for (const item of response.DropDownData) {
            this.ColorDropdown.push({
              value: item.ID,
              label: item.Name,
            });
          }
        } else {
          this.toastService.showErrorToast("Error", "internal serve Error");
          // console.log('internal serve Error', response);
        }
      });
  }

  GetSizeDDFunction(ID : any) {
    this.ProductSizeDD = [];
    this.vapLongApiService
      .GetDropDownDataSize()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          if (ID === 0) {
            this.selectedProductSizeID = response.DropDownData[0]?.ID;
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
          this.toastService.showErrorToast("Error", "internal serve Error");
          // console.log('internal serve Error', response);
        }
      });
  }

  GetConnecterTypeDDFunction(ID : any) {
    this.ProductConnecterTypeDD = [];
    this.vapLongApiService
      .GetDropDownDataConnecterType()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          if (ID === 0) {
            this.selectedProductConnecterTypeID = response.DropDownData[0]?.ID;
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
          this.toastService.showErrorToast("Error", "internal serve Error");
          // console.log('internal serve Error', response);
        }
      });
  }

  GetPackagingDDFunction(ID : any) {
    this.ProductPackagingDD = [];
    this.vapLongApiService
      .GetDropDownDataPackaging()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          if (ID === 0) {
            this.selectedProductPackagingID = response.DropDownData[0]?.ID;
          } else {
            this.selectedProductPackagingID = ID;
          }
          for (const item of response.DropDownData) {
            this.ProductPackagingDD.push({
              value: item.ID,
              label: item.Name,
            });
          }
        } else {
          this.toastService.showErrorToast("Error", "internal serve Error");
          // console.log('internal serve Error', response);
        }
      });
  }

  GetCapacityDDFunction(ID : any) {
    this.ProductCapacityDD = [];
    this.vapLongApiService
      .GetDropDownDataCapacity()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          if (ID === 0) {
            this.selectedProductCapacityID = response.DropDownData[0]?.ID;
          } else {
            this.selectedProductCapacityID = ID;
          }
          for (const item of response.DropDownData) {
            this.ProductCapacityDD.push({
              value: item.ID,
              label: item.Name,
            });
          }
        } else {
          this.toastService.showErrorToast("Error", "internal serve Error");
          // console.log('internal serve Error', response);
        }
      });
  }

  GetPowerDDFunction(ID : any) {
    this.ProductPowerDD = [];
    this.vapLongApiService
      .GetDropDownDataPower()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          if (ID === 0) {
            this.selectedProductPowerID = response.DropDownData[0]?.ID;
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
          this.toastService.showErrorToast("Error", "internal serve Error");
          // console.log('internal serve Error', response);
        }
      });
  }
  GetPrintDDFunction(ID : any) {
    this.ProductPrintDD = [];
    this.vapLongApiService
      .GetDropDownDataPrint()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          if (ID === 0) {
            this.selectedProductPrintID = response.DropDownData[0]?.ID;
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
          this.toastService.showErrorToast("Error", "internal serve Error");
          // console.log('internal serve Error', response);
        }
      });
  }

  GetBrandDDFunction(ID : any) {
    this.BrandDropdown = [];
    this.vapLongApiService
      .GetDropDownDataBrand()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          if (ID === 0) {
            this.selectedBrandID = response.DropDownData[0]?.ID;
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
          this.toastService.showErrorToast("Error", "internal serve Error");
          // console.log('internal serve Error', response);
        }
      });
  }
  // GetTypeDDFunction(ID : any) {
  //   this.TypeDropdown = [];
  //   this.vapLongApiService.GetDropDownDataType().pipe(untilDestroyed(this)).subscribe((response: any) => {
  //     if (response.ResponseText === 'success') {
  //       if (ID === 0) {
  //         this.selectedTypeID = response.DropDownData[0]?.ID;
  //       } else {
  //         this.selectedTypeID = ID;
  //       }
  //       for (const item of response.DropDownData) {
  //         this.TypeDropdown.push({
  //           value: item.ID,
  //           label: item.Name,
  //         });
  //       }
  //     }
  //     else {
  //       this.toastService.showErrorToast('error', 'internal serve Error');
  //       // console.log('internal serve Error', response);
  //     }
  //   });
  // }

  // GetBrandDDFunction(ID : any) {
  //   this.BrandDropdown = [];
  //   this.vapLongApiService.GetAllBrands().pipe(untilDestroyed(this)).subscribe((response: any) => {
  //     if (response.ResponseCode === 0) {
  //       this.brandProduct = response.AllBrandsList.filter((x: any) => x.IsActive !== false);
  //       if (ID !== 0) {
  //         let selectedBrand = this.brandProduct.filter((x: any) => x.ID === ID)[0];
  //         if(selectedBrand!=null)
  //         {
  //           this.selectedBrandID = selectedBrand.ID;
  //           this.BrandLabel = selectedBrand.Description;
  //           this.GetProductModelDDFunction(this.addProduct.BLabel.replace(this.BrandLabel,"").match(/[a-zA-Z]+/g)[0]);
  //         }
  //         else
  //         {
  //           this.GetProductModelDDFunction(this.addProduct.BLabel.match(/[a-zA-Z]+/g)[0]);
  //         }
  //       } else {
  //         this.selectedBrandID = this.brandProduct[0].ID;
  //         this.BrandLabel = this.brandProduct[0].Description;
  //       }
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
  //       // console.log('internal server error ! GetProductModelDropDownData function not getting data');
  //     });

  // }
  GetQualityLabelDDFunction(ID : any) {
    this.QualityLabelDropdown = [];
    this.vapLongApiService
      .QualityLabelDD()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          if (ID !== 0) {
            this.selectedQualityLabelID = ID;
          }
          for (const item of response.DropDownData) {
            this.QualityLabelDropdown.push({
              value: item.ID,
              label: item.Name,
            });
          }
        } else {
          this.toastService.showErrorToast("Error", "internal serve Error");
          // console.log('internal serve Error', response);
        }
      });
  }

  GetClassificationDDFunction(
    selected: any,
    isEdit: any,
    department: any,
    category: any,
    subcategory: any
  ) {
    this.ClassificationDropdown = [];
    this.vapLongApiService
      .GetClassificationDropList()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          // tslint:disable-next-line: deprecation
          if (
            selected !== 0 &&
            !(selected === null || selected === undefined) &&
            isEdit === true
          ) {
            this.selectedClassificationID = selected;
            this.GetDepartmentByClassificationID_DDFuntion(
              selected,
              department,
              true,
              category,
              subcategory
            );
          } else {
            this.GetDepartmentByClassificationID_DDFuntion(
              response.DropDownData[0]?.ID,
              0,
              false,
              0,
              0
            );
            this.selectedClassificationID = response.DropDownData[0]?.ID;
          }
          for (const item of response.DropDownData) {
            this.ClassificationDropdown.push({
              value: item.ID,
              label: item.Name,
            });
          }
          this.chref.detectChanges();
        } else {
          this.toastService.showErrorToast("Error", "internal serve Error");
          // console.log('internal serve Error', response);
        }
      });
  }

  GetDepartmentByClassificationID_DDFuntion(
    para: any,
    selected: any,
    isEdit: any,
    category: any,
    subcategory: any
  ) {
    // tslint:disable-next-line: prefer-const
    let id = {
      ID: para,
    };
    this.DepartmentDropdown = [];
    this.vapLongApiService
      .GetDepartmentByClassificationID(id)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          // tslint:disable-next-line: deprecation
          if (
            selected !== 0 &&
            !(selected === null || selected === undefined) &&
            isEdit === true
          ) {
            this.selectedDepartmentID = selected;
            this.GetCategoryByDepartmentID_DDFuntion(
              selected,
              category,
              true,
              subcategory
            );
          } else {
            this.GetCategoryByDepartmentID_DDFuntion(
              response.DropDownData[0]?.ID,
              0,
              false,
              0
            );
            this.selectedDepartmentID = response.DropDownData[0]?.ID;
          }
          for (const item of response.DropDownData) {
            this.DepartmentDropdown.push({
              value: item.ID,
              label: item.Name,
            });
          }
          this.chref.detectChanges();
        } else {
          this.toastService.showErrorToast("Error", "internal serve Error");
          // console.log('internal serve Error', response);
        }
      });
  }

  GetCategoryByDepartmentID_DDFuntion(para: any, selected: any, isEdit: any, subcategory: any) {
    // tslint:disable-next-line: prefer-const
    let id = {
      ID: para,
    };
    this.CategoryDropdown = [];
    this.vapLongApiService
      .GetCategoryByDepartmentID(id)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        if (response.ResponseText === "success") {
          // tslint:disable-next-line: deprecation
          if (
            selected !== 0 &&
            !(selected === null || selected === undefined) &&
            isEdit === true
          ) {
            this.selectedCategoryID = selected;
            this.GetSubCategoryByCategoryID_DDFuntion(
              selected,
              subcategory,
              true
            );
          } else {
            const catId = response.DropDownData.find(
              (x : any) => x.Name === "All"
            )?.ID;
            this.GetSubCategoryByCategoryID_DDFuntion(catId || 0, 0, false);
            this.selectedCategoryID = catId || 0;
          }
          for (const item of response.DropDownData) {
            this.CategoryDropdown.push({
              value: item.ID,
              label: item.Name,
            });
          }
          this.chref.detectChanges();
        } else {
          this.toastService.showErrorToast("Error", "internal serve Error");
          // console.log('internal serve Error', response);
        }
      });
  }

  GetSubCategoryByCategoryID_DDFuntion(para: any, selected: any, isEdit: any) {
    // tslint:disable-next-line: prefer-const
    let id = {
      ID: para,
    };
    this.SubCategoryDropdown = [];
    this.vapLongApiService
      .GetSubCategoryByCategorytID(id)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          // tslint:disable-next-line: deprecation
          if (
            selected !== 0 &&
            !(selected === null || selected === undefined) &&
            isEdit === true
          ) {
            this.selectedSubCategoryID = selected;
          } else {
            this.selectedSubCategoryID = response.DropDownData[0]?.ID;
          }
          for (const item of response.DropDownData) {
            this.SubCategoryDropdown.push({
              value: item.ID,
              label: item.Name,
            });
          }
          this.chref.detectChanges();
        } else {
          this.toastService.showErrorToast("Error", "internal serve Error");
          // console.log('internal serve Error', response);
        }
      });
  }

  CategoryAssignment() {
    if (this.Sourcelist.length > 0) {
      this.display = true;
      this.openModalCategoryAssignment();
      return;
    }
    this.loadingCategory = true;
    const param = {
      Product: "",
      PageNo: 0,
      PageSize: 1000000,
    };

    this.vapLongApiService
      .GetAllShopCategoryPagination(param)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.loadingCategory = false;
        if (response.ResponseText === "success") {
          this.Sourcelist = response.ProductCategoryDetails;
          console.log(this.Targetlist);
          this.Targetlist.forEach((element: any) => {
            this.Sourcelist = this.Sourcelist.filter(
              (obj) => obj.ShopCategoryID !== element.ShopCategoryID
            );
          });
          this.display = true;
          this.chref.detectChanges();
          this.openModalCategoryAssignment();
        }
      });
  }

  FilterRequestModelInilizationFunction() {
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
      100000,
      0,
      true,
      true,
      -1,
      -1,
      -1,
      true,
      true,
      true,
      "",
      "",
      true,
      true,
      -1,
      -1,
      true,
      true,
      "",
      "",
      "",
      0
    );
  }


  PrintQRCode() {
   // this.QRProductDetails = this.addProduct;
    setTimeout(() => {
     
      let printContents;
      let popupWin;

      printContents = document.getElementById('printA4-qr-print')?.innerHTML ?? "";
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      if(popupWin){
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>Report</title>
              <style>
              //........Customized style.......
              .sty{
                'width: 67%;color: #000; float: left;text-align: left; margin: 0;font-size: 12px; font-weight: 600;padding-right: 10px;
              }
              </style>
            </head>
            <body onload='window.print();self.close();'>${printContents}</body>
          </html>`);
        popupWin.document.close();
      }
    }, 500);

 }
  GenerateQRCode() {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = this.addProduct.ID ?? -1;
    this.updateStatusModel.Status = this.addProduct.IsActive ?? false;
    this.updateStatusModel.UpdatedByUserID = this.usermodel.ID;
    this.vapLongApiService.GenerateQRCode(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.fillFields(response.ProductModel.ID);
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }

  ValidateCaptcha(newValue: any) {
    this.isCaptchaDisplayed = false;
    this.modalCaptchaComponent.close();
    // console.log(newValue.IsDone);
    this.isCapchaValidated = newValue.IsDone;
    if(this.isCapchaValidated)
    {
      this.SaveUpdateProductDetails();
    }
  }

  close() {
    this.isCaptchaDisplayed = false;
    this.isCapchaValidated =  false;
    this.modalCaptchaComponent.close();
  }

  openCaptcha(){
    this.firstNumber = randomNumber.generate(1);
    this.secondNumber = randomNumber.generate(1);
    this.isCaptchaDisplayed = true;
    this.modalCaptchaComponent.open();

  }

  AttachImagesFunction() {
    this.AttachImagesPopDisplay = true;
    this.FilterRequestModelInilizationFunction();
    this.GetAllFolderHierarchyWithLazyLoadinFunction(this.filterModel);
    // this.vapLongApiService.GetAllFolderHierarchyPaginationFolderHierarchy(this.filterRequestModel).pipe(untilDestroyed(this))
    //   .subscribe((response: any) => {
    //     if (response.ResponseText === 'success' || response.ResponseCode === 0) {
    //       this.folderHierarchys = response.FolderHierarchys;
    //     } else if (response.ResponseCode === -1) {
    //       console.log(response.ResponseText);
    //     } else {
    //       this.toastService.showErrorToast('error', 'internal serve Error');
    //       // console.log('internal server error !');
    //     }
    //   },
    //     error => {
    //       this.toastService.showErrorToast('error', 'internal serve Error');
    //       // console.log('internal server error !  not getting api data');
    //     });
  }
  LazyLoadFolderFunction(event: any) {
    console.log(event);
    const start = event.first / event.rows;
    const product = "";
    if (event.Product) {
      this.filterModel.Product = event.Product;
    } else {
      this.filterModel.Product = product;
    }
    this.filterModel.PageNo = event.PageNo;
    this.filterModel.PageSize = event.PageSize;
    this.GetAllFolderHierarchyWithLazyLoadinFunction(this.filterModel);
  }
  GetAllFolderHierarchyWithLazyLoadinFunction(filterRM: any) {
    this.filterRequestModel = new FilterRequestModel();
    this.filterRequestModel.PageNo = filterRM.PageNo;
    this.filterRequestModel.PageSize = filterRM.PageSize;
    this.filterRequestModel.IsGetAll = false;
    this.filterRequestModel.Product = filterRM.Product;
    this.isLoading = true;
    this.vapLongApiService
      .GetAllFolderHierarchyTotalCount(this.filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          this.totalRecords = response.TotalRowCount;
          this.vapLongApiService
            .GetAllFolderHierarchyPagination(this.filterRequestModel)
            .pipe(untilDestroyed(this))
            .subscribe((response1: any) => {
              if (response1.ResponseCode === 0) {
                this.folderHierarchys = response1.FolderHierarchys;
                this.isLoading = false;
                this.chref.detectChanges();
              } else {
              }
            });
            this.chref.detectChanges();
        } else {
        }
      });
  }
  onRowSelect(event: any) {
    console.log("event is ", event);
    const id = {
      ID: event.ID,
    };
    this.folderImagesList = new FolderHierarchys();
    this.vapLongApiService
      .GetFolderHierarchyByID(id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          if (response.ResponseCode === 0) {
            this.folderImagesList = response.FolderHierarchy;
            this.folderHierarchy = response.FolderHierarchy;
            if (
              !(this.folderImagesList.Images === null || this.folderImagesList.Images === undefined) &&
              this.folderImagesList.Images != ""
            ) {
              this.Images = [];
              this.ImagesList = this.folderImagesList.Images.split("|");
              this.ImagesList.forEach((element: any) => {
                var obj = {
                  Image: this.folderImagesList.Description + "/" + element,
                  ImageName: element,
                };
                this.Images.push(obj);
              });
            } else this.Images = [];
            console.log("images is ", this.Images);
            this.chref.detectChanges();
          } else if (response.ResponseCode === -1) {
            this.toastService.showErrorToast("Error", "Internal server error.")
          } else {
            this.toastService.showErrorToast("Error", 'No Stock Available')
          }
        },
        (error) => {
          this.toastService.showErrorToast("Error", "Internal server error.")
          // console.log('internal server error ');
        }
      );
  }

  // ImageSrcFunction(event, name) {
  //   ;
  //   // const imageSrc = event.srcElement.currentSrc;
  //   const imageSrc = this.imageBasePath + name;
  //   const index = this.selectedImages.findIndex((x: any) => x.src === imageSrc);
  //   if (index === -1) {
  //     const imageDetail = { src: imageSrc, name: name };
  //     this.selectedImages.push(imageDetail);
  //     this.toastService.showSuccessToast('Success', 'image selected successfully');
  //   } else {
  //     // this.selectedImages.splice(index, 1);
  //     this.toastService.showInfoToast('Info', 'Already selected for this Product');
  //   }
  // }
  ImageSrcFunction(event: any) {
    // const imageSrc = event.srcElement.currentSrc;
    const imageSrc = this.imageBasePath + event.Image;
    const index = this.selectedImages.findIndex((x : any) => x.src === imageSrc);
    if (index === -1) {
      const imageDetail = { src: imageSrc, name: event.Image };
      this.selectedImages.push(imageDetail);
      // this.notificationService.notify(
      //   NotificationEnum.SUCCESS,
      //   "Success",
      //   "image selected successfully"
      // );
      this.toastService.showSuccessToast('Success', 'Image selected successfully');
    } else {
      // this.selectedImages.splice(index, 1);
      // this.notificationService.notify(
      //   NotificationEnum.INFO,
      //   "Info",
      //   "Already selected for this Product"
      // );
      this.toastService.showInfoToast('Info', 'Already selected for this product.');
    }
    this.chref.detectChanges();
  }

  DeleteImage(event: any) {
    const imageSrc = event.src;
    const index = this.selectedImages.findIndex((x : any) => x.src === imageSrc);
    if (index !== -1) {
      this.selectedImages.splice(index, 1);
    }
  }
  setPriceDefaultValueForFeilds(purchasePrice: any) {
    this.addProduct.SalePrice = Number(
      (
        parseFloat(purchasePrice) +
        (20 * parseFloat(purchasePrice)) / 100
      ).toFixed(2)
    );
    this.addProduct.ShopSalePrice = (
      parseFloat(purchasePrice) +
      (20 * parseFloat(purchasePrice)) / 100
    ).toFixed(2);
  }

  fillFields(id : any) {
    this.addProduct = new AllProductList();
    const params = { ID: id };
    this.vapLongApiService
      .GetProductByProductID(params)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          if (response.ResponseCode === 0) {
            this.chref.detectChanges();
            this.addProduct = response.ProductModel;
            this.QRProductDetails = response.ProductModel;
            this.PurchasePriceDisabled = true;
            //this.setPriceDefaultValueForFeilds(this.addProduct.PurchasePrice);
            this.Targetlist = this.addProduct.ProductCategoryDetails;
            if(!(this.addProduct.ProductCategoryDetails === null || this.addProduct.ProductCategoryDetails === undefined)) {
              if (this.addProduct.ProductCategoryDetails.length > 0)
                this.oldCategoryDetailID =
                  this.addProduct.ProductCategoryDetails[0].ID;
              else this.oldCategoryDetailID = 0;
            }
            this.bShowInShop = this.addProduct.bShowInShop;
            this.bShowForReseller = (this.addProduct.bShowForReseller!=null)?this.addProduct.bShowForReseller:true;
            this.IsObselete = (this.addProduct.IsObselete!=null)?this.addProduct.IsObselete:false;

            //this.LabelNo = this.addProduct.BLabel.match(/[0-9]+/g)[0];
            this.bAddToWishList = this.addProduct.IsAutoAddToWishlist;

            this.GetBrandDDFunction(this.addProduct.BrandID?? 0);

            this.selectedProductSubModelID =
              this.addProduct.ModelID != null
                ? this.addProduct.ModelID.toString()
                : "0";
            this.selectedBrandTypeID =
              this.addProduct.BrandTypeID != null
                ? this.addProduct.BrandTypeID.toString()
                : "0";
            this.selectedSeriesID =
              this.addProduct.SeriesID != null
                ? this.addProduct.SeriesID.toString()
                : "0";

            //this.GetTypeDDFunction(this.addProduct.TypeID??0);
            //this.GetSeriesDDFunction(this.addProduct.SeriesID??0);
            this.GetColorDDFunction(this.addProduct.ColorID ?? 0);
            this.GetSizeDDFunction(this.addProduct.SizeID ?? 0);
            this.GetConnecterTypeDDFunction(
              this.addProduct.ConnecterTypeID ?? 0
            );
            this.GetCapacityDDFunction(this.addProduct.CapacityID ?? 0);
            this.GetPackagingDDFunction(this.addProduct.PackagingID ?? 0);
            this.GetPowerDDFunction(this.addProduct.PowerID ?? 0);
            this.GetPrintDDFunction(this.addProduct.PrintID ?? 0);

            
            this.GetMeasuringUnitDDFunction(this.addProduct.MeasuringUnitID);
            this.GetQualityLabelDDFunction(this.addProduct.QualityID);
            const bLabel = this.addProduct?.BLabel;
            if (!(bLabel === null || bLabel === undefined)) {
              const matchArray = bLabel.match(/[a-zA-Z]+/g);
              if(!(matchArray === null || matchArray === undefined))
                this.GetProductModelDDFunction(matchArray[0]);
            }
            this.chref.detectChanges();
            if (this.addProduct.IsTrackable) {
              this.trackable = "Trackable";
            } else {
              this.trackable = "nonTrackable";
            }

            if(this.addProduct.ReservedQuantity==null){          
              this.addProduct.ReservedQuantity =0;
            }
            this.selectedImages = [];
            if (
              !(this.addProduct.Image === null || this.addProduct.Image === undefined) &&
              this.addProduct.Image != ""
            ) {
              for (const item of this.addProduct.Image.split("|")) {
                const imageDetail = {
                  src: this.imageBasePath + item,
                  name: item,
                };
                this.selectedImages.push(imageDetail);
              }
            }
            this.vapLongApiService
              .GetAllSubCategories()
              .pipe(untilDestroyed(this))
              .subscribe((response1: any) => {
                const SubCategory = response1.AllSubCategoryList.find(
                  (x : any) => x.ID === this.addProduct.SubCategoryID
                );
                this.addProduct.CategoryID = SubCategory.CategoryID;
                this.addProduct.DepartmentID = SubCategory.DepartmentID;
                this.addProduct.ClassificationID = SubCategory.ClassificationID;
                // this.selectedClassificationID = this.addProduct.ClassificationID.toString() ;
                // this.selectedDepartmentID = this.addProduct.DepartmentID.toString();
                // this.selectedCategoryID = this.addProduct.CategoryID.toString();
                // this.selectedSubCategoryID = this.addProduct.SubCategoryID.toString();
                this.GetClassificationDDFunction(
                  this.addProduct.ClassificationID,
                  true,
                  this.addProduct.DepartmentID,
                  this.addProduct.CategoryID,
                  this.addProduct.SubCategoryID
                );
              });
          } else {
            this.toastService.showErrorToast("error", "internal server error ");
            // console.log('internal server error ! fillFields ');
          }
        },
        (error) => {
          this.toastService.showErrorToast("error", "internal server error ");
          // console.log('internal server error ! fillFields');
        }
      );
  }

  onChangeClassification(event: any) {
    this.GetClassificationDDFunction(event.value, false, 0, 0, 0);
  }
  onChangeDepartment(event: any) {
    this.GetCategoryByDepartmentID_DDFuntion(event.value, 0, false, 0);
  }
  onChangeCategory(event: any) {
    this.GetSubCategoryByCategoryID_DDFuntion(event.value, 0, false);
  }

  checkConfirmation() {
    if (this.addProduct.bShowInShop) {
      // this.confirmationService.confirm({
      //   message: "Are you sure you want to Update the product to shop?",
      //   header: "Confirmation",
      //   icon: "pi pi-exclamation-triangle",
      //   accept: () => {
      //     // this.notificationService.notify(NotificationEnum.INFO, 'Confirmed', 'Ok. Product can be posted to shop');
      //     // tslint:disable-next-line: deprecation
      //     if (
      //       isNullOrUndefined(this.addProduct.ShopAdvicePrice) ||
      //       this.addProduct.ShopAdvicePrice <= 0
      //     ) {
      //       //this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Advice price should be greater than 0.');
      //       //return;
      //       this.addProduct.bShowInShop = false;
      //       this.SaveUpdateProductDetails();
      //     } else {
      //       this.SaveUpdateProductDetails();
      //     }
      //   },
      //   reject: () => {
      //     this.notificationService.notify(
      //       NotificationEnum.INFO,
      //       "Rejected",
      //       "Ok. Product will not be available for shop"
      //     );
      //     this.addProduct.bShowInShop = false;
      //     this.SaveUpdateProductDetails();
      //     // return null;
      //   },
      // });
      this.confirmationService.confirm('Are you sure you want to Update the product to shop?').then(
        (confirmed) => {
          if(confirmed) {
            if (
              (this.addProduct.ShopAdvicePrice === null || this.addProduct.ShopAdvicePrice === undefined) ||
              this.addProduct.ShopAdvicePrice <= 0
            ) {
              //this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Advice price should be greater than 0.');
              //return;
              this.addProduct.bShowInShop = false;
              this.SaveUpdateProductDetails();
            } else {
              this.SaveUpdateProductDetails();
            }
          } else {
            this.toastService.showInfoToast("Rejected", "Ok. Product will not be available for shop")
            this.addProduct.bShowInShop = false;
            this.SaveUpdateProductDetails();
          }
        }
      )
    } else {
      this.addProduct.bShowInShop = false;
      this.SaveUpdateProductDetails();
    }
  }
  SaveUpdateProductDetails() {
    // if (this.addProduct.bShowInShop) {
    //   if (confirm('Are you sure you want to post the product to shop')) {
    //     if (isNullOrUndefined(this.addProduct.ShopAdvicePrice) || this.addProduct.ShopAdvicePrice <= 0) {
    //       this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Advice price should be greater than 0.');
    //       return;
    //     }
    //   } else {
    //     return;
    //   }
    // }

    if(!this.isCapchaValidated)
    {
      this.openCaptcha();
      return;
    }
    if (
      (this.addProduct.ShopAdvicePrice === null || this.addProduct.ShopAdvicePrice === undefined) ||
      this.addProduct.ShopAdvicePrice <= 0
    ) {
      if (confirm("Do you want to proceed with this Advice Price value")) {
        if (this.addProduct.ID && this.addProduct.ID > 0) {
          this.UpdateProduct();
        } else {
          this.SaveProduct();
        }
      }
    } else {
      if (this.addProduct.ID && this.addProduct.ID > 0) {
        this.UpdateProduct();
      } else {
        this.SaveProduct();
      }
    }
  }

  SaveProduct() { // Save Method To Communicate API
    this.addProduct.ID = 0;

    // if (this.addProduct.bShowInShop) {
    //   if (confirm('Are you sure you want to post the product to shop')) {
    //     if (isNullOrUndefined(this.addProduct.ShopAdvicePrice) || this.addProduct.ShopAdvicePrice <= 0) {
    //       this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Advice price should be greater than 0.');
    //       return;
    //     }
    //   } else {
    //     return;
    //   }
    // }
    if (!this.validateFields()) {
      return;
    }

    if(!this.isCapchaValidated)
    {
      this.openCaptcha();
      return;
    }
    this.addProduct.QualityID = Number(this.selectedQualityLabelID);
    this.addProduct.Quality = this.QualityLabelDropdown.filter(
      (x : any) => x.value === this.selectedQualityLabelID
    )[0].label;
    this.addProduct.MeasuringUnitID = Number(this.selectedMeasuringUnitID);

    this.addProduct.ColorID = Number(this.selectedColorID);
    this.addProduct.TypeID = Number(this.selectedTypeID);
    this.addProduct.BrandID = Number(this.selectedBrandID);

    this.addProduct.SizeID = Number(this.selectedProductSizeID);
    this.addProduct.ConnecterTypeID = Number(
      this.selectedProductConnecterTypeID
    );
    this.addProduct.CapacityID = Number(this.selectedProductCapacityID);
    this.addProduct.PackagingID = Number(this.selectedProductPackagingID);
    this.addProduct.PowerID = Number(this.selectedProductPowerID);
    this.addProduct.PrintID = Number(this.selectedProductPrintID);

    this.addProduct.ClassificationID = Number(this.selectedClassificationID);
    this.addProduct.DepartmentID = Number(this.selectedDepartmentID);
    this.addProduct.CategoryID = Number(this.selectedCategoryID);
    this.addProduct.SubCategoryID = Number(this.selectedSubCategoryID);
    // this.addProduct.ModelID = (Number(this.selectedProductSubModelID)!=0)?Number(this.selectedProductSubModelID):null;
    // this.addProduct.BrandTypeID = (Number(this.selectedBrandTypeID)!=0)?Number(this.selectedBrandTypeID):null;
    // this.addProduct.SeriesID = (Number(this.selectedSeriesID)!=0)?Number(this.selectedSeriesID):null;
    this.addProduct.ModelID = Number(this.selectedProductSubModelID);
    this.addProduct.BrandTypeID = Number(this.selectedBrandTypeID);
    this.addProduct.SeriesID = Number(this.selectedSeriesID);

    if (this.trackable === "Trackable") {
      this.addProduct.IsTrackable = true;
    } else {
      this.addProduct.IsTrackable = false;
    }

    this.addProduct.IsActive = true;
    this.addProduct.nMaxShop = 0;
    this.addProduct.DisplayOrder = 0;
    //this.addProduct.ReorderPoint = 0;
    this.addProduct.MaximumStock = 10;

    this.addProduct.bShowInShop = this.bShowInShop;
    this.addProduct.bShowForReseller = this.bShowForReseller;
    this.addProduct.IsObselete = this.IsObselete;

    this.addProduct.IsAutoAddToWishlist = this.bAddToWishList;

    // tslint:disable-next-line: deprecation
    if ((this.addProduct.bShopAllowDiscount === null || this.addProduct.bShopAllowDiscount === undefined)) {
      this.addProduct.bShopAllowDiscount = false;
    }

    this.addProduct.TaxTypeID = 1;
    this.addProduct.StandardTaxPercentage = 0;
    this.addProduct.LuxuryTaxValue = 0;
    this.addProduct.IsLuxuryTax = true;
    this.addProduct.ActiveFrom = new Date();
    this.addProduct.ActiveTo = new Date();
    this.addProduct.CreatedByUserID = this.usermodel.ID;
    this.addProduct.CreatedByUserID = this.usermodel.ID;

    //this.addProduct.BLabel=this.BrandLabel+"-"+this.ModelLabel;

    this.Targetlist = this.Targetlist.filter(
      (value: any, index: any, array: any) =>
        !array.filter(
          (v: any, i: any) => JSON.stringify(value) == JSON.stringify(v) && i < index
        ).length
    );

    this.addProduct.ProductCategoryDetails = this.Targetlist;
    this.addProduct.Image = "";
    for (const item of this.selectedImages) {
      this.addProduct.Image += item.name + "|";
    }
    if (
      this.addProduct.Image.charAt(this.addProduct.Image.length - 1) === "|"
    ) {
      this.addProduct.Image = this.addProduct.Image.slice(0, -1);
    }
    this.loadingAction = true;
    this.vapLongApiService
      .AddProduct(this.addProduct)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.loadingAction = false;
        if (response.ResponseCode === 0) {
          
          this.PrintQRCode();
          // this.notificationService.notify(
          //   NotificationEnum.SUCCESS,
          //   "Success",
          //   response.ResponseText
          // );
          this.toastService.showSuccessToast("Success", response.ResponseText);
          this.router.navigate(["/catalog/managed-products"]);
        } else {
          // this.notificationService.notify(
          //   NotificationEnum.ERROR,
          //   "Error",
          //   response.ResponseText
          // );
          this.toastService.showErrorToast("Error", response.ResponseText)
        }
        this.chref.detectChanges();
      });
  }
  UpdateProduct() { // Save  Method To Communicate API
    // if (this.addProduct.bShowInShop) {
    //   if (confirm('Are you sure you want to post the product to shop')) {
    //     if (isNullOrUndefined(this.addProduct.ShopAdvicePrice) || this.addProduct.ShopAdvicePrice <= 0) {
    //       this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Advice price should be greater than 0.');
    //       return;
    //     }
    //   } else {
    //     return;
    //   }
    // }
    if (!this.validateFields()) {
      return;
    }
    
    if (this.selectedQualityLabelID != "") {
      this.addProduct.QualityID = Number(this.selectedQualityLabelID);
      this.addProduct.Quality = this.QualityLabelDropdown.filter(
        (x : any) => x.value === this.selectedQualityLabelID
      )[0].label;
    }
    this.addProduct.MeasuringUnitID = Number(this.selectedMeasuringUnitID);
    this.addProduct.CreatedByUserID = this.usermodel.ID;

    this.addProduct.ColorID = Number(this.selectedColorID);
    this.addProduct.BrandID = Number(this.selectedBrandID);
    this.addProduct.TypeID = Number(this.selectedTypeID);
    //this.addProduct.SeriesID = Number(this.selectedSeriesID);

    this.addProduct.SizeID = Number(this.selectedProductSizeID);
    this.addProduct.ConnecterTypeID = Number(
      this.selectedProductConnecterTypeID
    );
    this.addProduct.CapacityID = Number(this.selectedProductCapacityID);
    this.addProduct.PackagingID = Number(this.selectedProductPackagingID);
    this.addProduct.PowerID = Number(this.selectedProductPowerID);
    this.addProduct.PrintID = Number(this.selectedProductPrintID);

    this.addProduct.ClassificationID = Number(this.selectedClassificationID);
    this.addProduct.DepartmentID = Number(this.selectedDepartmentID);
    this.addProduct.CategoryID = Number(this.selectedCategoryID);
    this.addProduct.SubCategoryID = Number(this.selectedSubCategoryID);

    // this.addProduct.ModelID = (Number(this.selectedProductSubModelID)!=0)?Number(this.selectedProductSubModelID):null;
    // this.addProduct.BrandTypeID = (Number(this.selectedBrandTypeID)!=0)?Number(this.selectedBrandTypeID):null;
    // this.addProduct.SeriesID = (Number(this.selectedSeriesID)!=0)?Number(this.selectedSeriesID):null;
    this.addProduct.ModelID = Number(this.selectedProductSubModelID);
    this.addProduct.BrandTypeID = Number(this.selectedBrandTypeID);
    this.addProduct.SeriesID = Number(this.selectedSeriesID);

    if (this.trackable === "Trackable") {
      this.addProduct.IsTrackable = true;
    } else {
      this.addProduct.IsTrackable = false;
    }

    //this.addProduct.IsActive = true;
    this.addProduct.nMaxShop = 0;
    this.addProduct.DisplayOrder = 0;

    //this.addProduct.ReorderPoint = 0;

    this.addProduct.MaximumStock = 10;

    this.addProduct.bShowInShop = this.bShowInShop;
    this.addProduct.bShowForReseller = this.bShowForReseller;
    
    this.addProduct.IsAutoAddToWishlist = this.bAddToWishList;
    this.addProduct.IsObselete = this.IsObselete;

    // tslint:disable-next-line: deprecation
    if ((this.addProduct.bShopAllowDiscount === undefined || this.addProduct.bShopAllowDiscount === null)) {
      this.addProduct.bShopAllowDiscount = false;
    }
    this.addProduct.TaxTypeID = 1;
    this.addProduct.StandardTaxPercentage = 0;
    this.addProduct.LuxuryTaxValue = 0;
    this.addProduct.IsLuxuryTax = true;
    this.addProduct.ActiveFrom = new Date();
    this.addProduct.ActiveTo = new Date();
    
    const bLabel = this.addProduct?.BLabel;
    if (!(bLabel === null || bLabel === undefined)) {
      const matchArray = bLabel.match(/[a-zA-Z]+/g);
      if(!(matchArray === null || matchArray === undefined))
        this.addProduct.BLabel  = matchArray[0];
    }
    // this.addProduct.BLabel = this.addProduct.BLabel.match(/[a-zA-Z]+/g)[0];
    //this.addProduct.BLabel=this.BrandLabel+ "-"+this.ModelLabel;

    this.Targetlist.forEach((element: any) => {
      element.ID = this.oldCategoryDetailID;
    });

    this.Targetlist = this.Targetlist.filter(
      (value: any, index: any, array: any) =>
        !array.filter(
          (v: any, i: any) => JSON.stringify(value) == JSON.stringify(v) && i < index
        ).length
    );

    this.addProduct.ProductCategoryDetails = this.Targetlist;
    this.addProduct.Image = "";
    for (const item of this.selectedImages) {
      this.addProduct.Image += item.name + "|";
    }
    if (
      this.addProduct.Image.charAt(this.addProduct.Image.length - 1) === "|"
    ) {
      this.addProduct.Image = this.addProduct.Image.slice(0, -1);
    }
    this.loadingAction = true;
    this.vapLongApiService
      .UpdateProduct(this.addProduct)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.loadingAction = false;
        if (response.ResponseCode === 0) {
          this.toastService.showSuccessToast('Success', response.ResponseText);
          this.router.navigate(["/catalog/managed-products"]);
        } else {
          this.toastService.showErrorToast('Error', response.ResponseText);
        }
        this.chref.detectChanges();
      });
  }

  validateFields() {
    // tslint:disable-next-line: deprecation
    if (
      (this.addProduct.Name === undefined || this.addProduct.Name === null) ||
      this.addProduct.Name === "" ||
      (this.addProduct.ShopSalePrice === undefined || this.addProduct.ShopSalePrice === null) ||
      this.selectedProductModelID === "" ||
      +this.selectedMeasuringUnitID <= 0 ||
      +this.selectedClassificationID <= 0 ||
      +this.selectedCategoryID <= 0 ||
      +this.selectedSubCategoryID <= 0 ||
      // tslint:disable-next-line: deprecation
      (this.addProduct.SalePrice === null || this.addProduct.SalePrice === undefined) ||
      this.addProduct.SalePrice <= 0 ||
      +this.selectedDepartmentID <= 0 ||
      this.addProduct.ShopSalePrice === "" ||
      Number(this.addProduct.ShopSalePrice) <= 0 ||
      Number(this.selectedColorID) <= 0 ||
      this.selectedBrandID === "" ||
      this.selectedBrandTypeID === "" ||
      this.selectedSeriesID === "" ||
      this.selectedQualityLabelID === "" ||
      Number(this.selectedTypeID) <= 0 ||
      Number(this.selectedProductSizeID) <= 0 ||
      Number(this.selectedProductConnecterTypeID) <= 0 ||
      Number(this.selectedProductCapacityID) <= 0 ||
      Number(this.selectedProductPackagingID) <= 0 ||
      Number(this.selectedProductPowerID) <= 0 ||
      Number(this.selectedProductPrintID) <= 0 ||
      Number(this.addProduct.PurchasePrice) <= 0
    ) {
      // this.notificationService.notify(
      //   NotificationEnum.INFO,
      //   "info",
      //   "Please fill required Fields"
      // );
      // this.addProduct.PurchasePrice = 0;
      // this.addProduct.SalePrice = 0;
      // this.addProduct.ShopSalePrice = '';
      this.toastService.showInfoToast("info", "Please fill required Fields");
      return false;
    } else {
      return true;
    }
  }

  getFolderHirarchyByID(Id : any) {
    this.loadingAction = true;
    this.vapLongApiService
      .GetFolderImagesById(Id)
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        this.loadingAction = false;
        if (res.ResponseText === "success") {
          this.folderImagesList = res.FolderHierarchy;
          this.folderHierarchy = res.FolderHierarchy;

          if (
            !(this.folderImagesList.Images === null || this.folderImagesList.Images === undefined) &&
            this.folderImagesList.Images != ""
          ) {
            this.Images = [];
            this.ImagesList = this.folderImagesList.Images.split("|");
            this.ImagesList.forEach((element: any) => {
              var obj = {
                Image: this.folderImagesList.Description + "/" + element,
                ImageName: element,
              };
              this.Images.push(obj);
            });
          } else this.Images = [];
          this.AttachfileFunction();
        }
        this.chref.detectChanges();
      });
  }

  UpdateImages(folderHierarchy: FolderHierarchys) {
    console.log(folderHierarchy);
    this.folderHierarchy = folderHierarchy;

    // this.btn_open_modal_attachment.nativeElement.click();
    // this.openModalDocAttach();
    this.btn_open_modal_doc_attach.nativeElement.click();
    this.getFolderHirarchyByID(this.folderHierarchy.ID);
  }
  AttachfileFunction() {
    this.AttachDocumentPopDisplay = true;
  }
  onUpload(event: any, form: any = null) {
    if (this.base64textString.length > 0) {
      // form.clear();
      this.base64textString = [];
    }
    for (const file of event) {
      if (file) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        const self = this;
        // tslint:disable-next-line: only-arrow-functions
        reader.onload = function (e) {
          // self.base64textString.push({ Base64String: reader.result.toString(), Extention: file.type.split('/')[1] });
          self.base64textString.push({
            Base64String: reader.result?.toString() ?? '',
            Extention: file.name,
          });
        };
      }
    }
  }
  UpdateImage(form: any) {
    this.IsSpinner = true;
    const obj: FolderHierarchys = {
      AttachedImages: this.base64textString,
      Description: this.folderHierarchy.Description,
      ID: this.folderHierarchy.ID,
      Images: this.folderHierarchy.Images,
      Name: this.folderHierarchy.Name,
    };
    this.vapLongApiService
      .UploadImageFolderHierarchy(obj)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          if (response.ResponseCode === 0) {
            this.getFolderHirarchyByID(this.folderHierarchy.ID);
            // form.clear();
            this.base64textString = [];
            // this.notificationService.notify(
            //   NotificationEnum.SUCCESS,
            //   "Success",
            //   response.ResponseText
            // );
            this.toastService.showSuccessToast('Success', response.ResponseText);
            this.chref.detectChanges();
          } else {
            // this.notificationService.notify(
            //   NotificationEnum.ERROR,
            //   "Error",
            //   response.ResponseText
            // );
            this.toastService.showErrorToast("Error", response.ResponseText);
          }
          this.IsSpinner = false;
        },
        (error) => {
          // this.notificationService.notify(
          //   NotificationEnum.ERROR,
          //   "Error",
          //   "Something went wrong"
          // );
          this.toastService.showErrorToast("Error", "Something went wrong");
          this.IsSpinner = false;
        }
      );
  }
  DeleteImage1(Image: any) {
    this.loadingAction = true;
    let finalImage = "";
    if (Image === this.folderHierarchy.Images) {
      finalImage = "";
    } else {
      let images = this.folderHierarchy.Images?.split("|");
      let newImages = images?.filter((e) => e !== Image);
      finalImage = newImages?.join("|") ?? '';
    }

    const obj: FolderHierarchys = {
      Description: this.folderHierarchy.Description,
      ID: this.folderHierarchy.ID,
      Images: finalImage,
      Name: this.folderHierarchy.Name,
    };
    this.vapLongApiService
      .UploadImageFolderHierarchy(obj)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.loadingAction = false;
        if (response.ResponseCode === 0) {
          this.getFolderHirarchyByID(this.folderHierarchy.ID);
          this.toastService.showSuccessToast('Success', response.ResponseText);
        }
        this.chref.detectChanges();
      });
  }

  handleReaderLoaded(e: any) {
    this.base64textString.push({
      Base64String: "data:image/png;base64," + btoa(e.target.result),
      Extention: "png",
    });
  }

  async openModalDocAttach() {
    return await this.modalDocAttachComponent.open();
  }

  async openModalCategoryAssignment() {
    return await this.modalCategoryAssignmentComponent.open();
  }

  setCategoryAssignment(event : any) {
    this.Targetlist = event;
    console.log('category assignment is ', this.Targetlist);
  }

  showAttachModal() {
    this.btn_open_modal_attach_img.nativeElement.click();
  }
}
