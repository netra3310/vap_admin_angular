import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
//import { Table } from "primeng/table";
// import { LazyLoadEvent, MenuItem } from "primeng/api";
import { ShopCategory } from "../../../Helper/models/ShopCategroy";
import { UpdateStatus } from "../../../Helper/models/UpdateStatus";
import { vaplongapi } from "../../../Service/vaplongapi.service";

import * as XLSX from "xlsx";

import { Columns } from "src/app/shared/model/columns.model";
import { GenericMenuItems } from "src/app/shared/model/genric-menu-items.model";
import { untilDestroyed } from "src/app/shared/services/until-destroy";

import { TableColumnEnum } from "src/app/shared/Enum/table-column.enum";
import { ToastService } from "../../shell/services/toast.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { UserModel } from "src/app/Helper/models/UserModel";
import { Categories } from "src/app/Helper/models/Categories";
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: "app-shop-category",
  templateUrl: "./shop-category.component.html",
  styles: [],
})
export class ShopCategoryComponent implements OnInit, OnDestroy {
    
  modalFileUploaderConfig: ModalConfig = {
    modalTitle: 'Attachments',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideDismissButton: () => true,
    hideCloseButton: () => true,
    modalSize: "lg"
  };

  @ViewChild('modalFileUploader') private modalFileUploaderComponent: ModalComponent;

  AllShopCategoriesList: ShopCategory[] = [];
  selectedShopCategory: ShopCategory;
  public shopCategory: ShopCategory;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  valCheck = "";
  ProductSearch = "";
  selectedShop: any;
  AttachDocumentPopDisplayForShop = false;
  uploadedFilesShop: any[] = [];
  MultipleShopCategories: any[] = [];

  items: any[];
  ShopCategories: any[];
  filteredShopCategories: any[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 10;
  alwaysShowPaginator = true;
  // last = 10;
  totalRecords = 0;

  arrayBuffershop: any;
  fileshop: File;
  genericMenuItems: GenericMenuItems[] = [
    { label: "Update", icon: "fas fa-pencil-alt", dependedProperty: "ID" },
  ];
  columns: Columns[] = [
    {
      field: "IsActive",
      header: "Status",
      sorting: "",
      placeholder: "",
      type: TableColumnEnum.TOGGLE_BUTTON,
      translateCol: "SSGENERIC.STATUS",
    },
    {
      field: "Name",
      header: "Name",
      sorting: "Name",
      placeholder: "",
      translateCol: "SSGENERIC.NAME",
    },
    {
      field: "Description",
      header: "Description",
      sorting: "Description",
      placeholder: "",
      translateCol: "SSGENERIC.DESCRIPTION",
    },
  ];
  globalFilterFields = ["Name", "Description"];
  rowsPerPageOptions = [10, 20, 50, 100];
  usermodel: UserModel;

  @ViewChild('btn_open_modal_add_shop_category') btn_open_modal_add_shop_category: ElementRef;

  constructor(
    private apiService: vaplongapi,
    private toastService: ToastService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {
    this.shopCategory = new ShopCategory();
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem("UserModel");
    this.GetAllShopCategoryList(); // Get All Shop Categories List On Page Load
    this.BindShopCategoryDropdownList(); // Bind Autocomplete
  }
  ngOnDestroy(): void {}
  emitAction(event: any) {
    this.EditShopCategory(event.selectedRowData);
  }
  GetAllShopCategoryList() { // Get All Shop Categories Method Get Data from Service
    this.IsSpinner = true;
    this.apiService
      .GetAllShopCategories()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          //this.AllShopCategoriesList = response.ShopCategories.filter((x: any) => x.IsActive === true);
          this.AllShopCategoriesList = response.ShopCategories;
          this.filteredShopCategories = this.AllShopCategoriesList;
          this.totalRecords = response.ShopCategories.length;
        } else {
          this.toastService.showErrorToast("error", response.ResponseText);
        }
        this.IsSpinner = false;
        this.cdr.detectChanges();
      });
  }

  AddShopCategory() { // Open Add Shop Category Section
    this.ResetFields();
    this.IsAdd = true;
    this.btn_open_modal_add_shop_category.nativeElement.click();
  }
  CloseAddSection() { // Close Add New Shop Category Section
    this.IsAdd = false;
    this.btn_open_modal_add_shop_category.nativeElement.click();
  }
  SaveUpdateShopCategoryDetails() {
    if (this.shopCategory.ID > 0) {
      // for Update
      this.UpdateShopCategory();
    } else {
      this.SaveShopCategory(); // for save
    }
  }
  SaveShopCategory() { // Save Shop Category Method To Communicate API
    if (this.selectedShop.ID == null || this.selectedShop.ID == undefined) {
      this.toastService.showErrorToast("Error", "please select parent category");
    }
    this.shopCategory.ID = 0;
    this.shopCategory.Description = "";
    this.shopCategory.IsActive = true;
    this.shopCategory.CreatedByUserID = this.usermodel.ID;
    this.shopCategory.ParentID = this.selectedShop.ID;

    this.apiService
      .AddShopCategory(this.shopCategory)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.toastService.showSuccessToast("Success", response.ResponseText);
          this.GetAllShopCategoryList();
          this.IsAdd = false;
          this.btn_open_modal_add_shop_category.nativeElement.click();
        } else {
          this.toastService.showErrorToast("error", response.ResponseText);
        }
      });
  }
  UpdateShopCategory() { // Update Shop Category Method To Communicate API
    if (
      this.selectedShop.value == null ||
      this.selectedShop.value == undefined
    ) {
      if (this.selectedShop.ID == null || this.selectedShop.ID == undefined) {
        this.toastService.showErrorToast("Error", "please select parent category");
      }
    }
    this.shopCategory.Description = "";
    this.shopCategory.IsActive = true;
    this.shopCategory.CreatedByUserID = this.usermodel.ID;
    if (
      this.selectedShop.value != null &&
      this.selectedShop.value != undefined
    ) {
      this.shopCategory.ParentID = this.selectedShop.value;
    }

    if (this.selectedShop.ID != null && this.selectedShop.ID != undefined) {
      this.shopCategory.ParentID = this.selectedShop.ID;
    }

    this.apiService
      .UpdateShopCategory(this.shopCategory)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.toastService.showSuccessToast("Success", response.ResponseText);
          this.GetAllShopCategoryList();
          this.IsAdd = false;
          this.btn_open_modal_add_shop_category.nativeElement.click();
        } else {
          this.toastService.showErrorToast("error", response.ResponseText);
        }
      });
  }

  EditShopCategory(shopCategory: ShopCategory) {
    this.shopCategory = shopCategory;
    var pcategory: any = this.AllShopCategoriesList.find(
      (x) => x.ID == shopCategory.ParentID
    );
    this.selectedShop = {
      value: pcategory.ID,
      Description: pcategory.Description,
    };
    this.IsAdd = true;
    this.btn_open_modal_add_shop_category.nativeElement.click();
  }
  UpdateShopCateogryStatus(
    shopCategory: any // Update Shop Category Status Method To Communicate API
  ) {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = shopCategory.ID;
    this.updateStatusModel.Status = !shopCategory.IsActive;
    this.updateStatusModel.UpdatedByUserID = shopCategory.CreatedByUserID;
    this.apiService
      .UpdateShopCategoryStatus(this.updateStatusModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.toastService.showSuccessToast("Success", response.ResponseText);
          this.GetAllShopCategoryList();
          this.IsSpinner = false;
        } else {
          this.IsSpinner = false;
          this.toastService.showErrorToast("error", response.ResponseText);
        }
      });
  }
  search(event: any) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.ShopCategories.length; i++) {
      const shopCategory = this.ShopCategories[i];

      if (shopCategory.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(shopCategory);
      }
    }
    this.filteredShopCategories = filtered;
  }

  BindShopCategoryDropdownList() {
    this.ShopCategories = [];
    this.apiService
      .GetShopCategoriesForDropdown()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          for (let i = 0; i < response.DropDownData.length; i++) {
            this.ShopCategories.push({
              value: response.DropDownData[i].ID,
              label: response.DropDownData[i].Name,
            });
          }
        } else {
          this.IsSpinner = false;
          this.toastService.showErrorToast("error", response.ResponseText);
          console.log("internal server error ! not getting api data");
        }
        
        this.cdr.detectChanges();
      });
  }

  ResetFields() { // Reset Object
    this.shopCategory = new ShopCategory();
  }

  AddMultipleShopCategory() {
    this.AttachDocumentPopDisplayForShop = true;
    this.openModalFileUploader();
  }
  myUploaderForShop(event: any) {
    this.MultipleShopCategories = [];

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
          ID: 0,
          IsActive: true,
          CreatedByUserID: 1,
          Description: "",
          ParientID: Number(item["ParentID"]),
          Name: item["Name"],
          ShopID: Number(item["ShopID"]),
        };

        this.MultipleShopCategories.push(model);
      }
      const param = { CategoriesList: this.MultipleShopCategories };
      this.IsSpinner = true;
      this.apiService
        .AddMultipleShopCategories(param)
        .pipe(untilDestroyed(this))
        .subscribe((response: any) => {
          this.IsSpinner = false;
          if (response.ResponseCode === 0) {
            this.AttachDocumentPopDisplayForShop = false;
            this.modalFileUploaderComponent.close();
            this.toastService.showSuccessToast("Success", response.ResponseText);
            this.GetAllShopCategoryList(); // Get All Shop Categories List On Page Load
            this.BindShopCategoryDropdownList(); // Bind Autocomplete
          } else {
            this.toastService.showErrorToast("Error", response.ResponseText);
          }
          this.cdr.detectChanges();
        });
    };
  }

  async openModalFileUploader() {
    return await this.modalFileUploaderComponent.open();
  }
}
