import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// import { SelectItem } from 'primeng/api';
import { Level } from 'src/app/Helper/models/Level';
import { NonTrackableProductsLocationModel } from 'src/app/Helper/models/NonTrackableProductsLocationModel';
import { TrackableProductLocationModel } from 'src/app/Helper/models/TrackableProductLocationModel';
import { UpdateStatus } from 'src/app/Helper/models/UpdateStatus';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { ReportPermissionEnum } from 'src/app/shared/constant/report-permission';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { isNullOrUndefined } from 'src/app/Helper/global-functions';
import { ToastService } from '../../shell/services/toast.service';

@Component({
  selector: 'app-manage-location',
  templateUrl: './manage-location.component.html',
  styles: [
  ]
})
export class ManageLocationComponent implements OnInit, OnDestroy {

  AllNonTrackableProductsLocationList: NonTrackableProductsLocationModel[] = [];
  AllTrackableProductsLocationList: TrackableProductLocationModel[] = [];
  selectedLevel: Level;
  AllProductTrackabilityInfoItemList: any[] = [];
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];
  usermodel: UserModel;
  reportPermission = ReportPermissionEnum;

  valCheck = '';
  ProductSearch = '';
  selectedWarehouseID = '';
  selectedZoneID = '';
  selectedSectionID = '';
  selectedLevelID = '';

  WarehouseDropdown: any[];
  ZoneDropdown: any[];
  SectionDropdown: any[];
  LevelDropdown: any[];
  ProductDropdown: any[];
  filteredProduct: any[];
  selectedProduct: any;
  IsTrackable: boolean;

  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  totalRecords = 0;
  filterGlobal = false;
  multiSelect = false;
  txtQuantity = 0;
  // product section and dropdown data -----
  IsOpenProductDialog = false;
  // ends here ----------------------

  selectedTrackables: any[] = [];
  selectedNonTrackable: any;
  selectedNonTrackableProdID: any;
  selectedNonTrackableProdVarID: any;

  rowsPerPageOptions = [10, 20, 50, 100];

  genericMenuItems: GenericMenuItems[] = [
  ];

  trackableColumns: Columns[] = [
    { field: 'productChecked', header: 'Select', sorting: 'productChecked', placeholder: '', type: TableColumnEnum.CHECKBOX_COLUMN },
    { field: 'TrackableForShoppingID', header: 'ID', sorting: 'TrackableForShoppingID', placeholder: '' },
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' },
    { field: 'TrackableCode', header: 'TrackableCode', sorting: 'TrackableCode', placeholder: '' },
  ];
  globalFilterFields = ['TrackableForShoppingID', 'Product', 'TrackableCode'];
  nonTrackableColumns: Columns[] = [
    // { field: 'productChecked', header: 'Select', sorting: 'productChecked', placeholder: '', type: TableColumnEnum.CHECKBOX_COLUMN },
    // { field: 'ID', header: 'ID', sorting: 'ID', placeholder: '' },
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '', translateCol: 'SSGENERIC.PRODUCT' },
    { field: 'Quantity', header: 'Quantity', sorting: 'Quantity', placeholder: '', translateCol: 'SSGENERIC.QUANTITY' },
    { field: 'Location', header: 'Location', sorting: 'Location', placeholder: '', translateCol: 'SSGENERIC.LOCATION' },

  ];
  productsColumn: Columns[] = [
    { field: 'ProductVariantID', header: 'ID', sorting: 'ProductVariantID', placeholder: '' },
    { field: 'ProductName', header: 'Name', sorting: 'ProductName', placeholder: '' },
    { field: 'Barcode', header: 'Model', sorting: 'Barcode', placeholder: '' }
  ];
  globalFilterFields1 = ['ID', 'Product', 'Quantity', 'Location'];
  ProductData: any[] = [];
  dataFunc: any = customSearchFn;
  btnDisabled = false;

  isLoadingProducts = false;
  isLoadingData = false;

  @ViewChild('btn_open_modal_products') btn_open_modal_products: ElementRef;
  constructor(private apiService: vaplongapi, 
    private toastService: ToastService, 
    private storageService: StorageService,
    public router: Router,
    private cdr: ChangeDetectorRef) {

    this.usermodel = this.storageService.getItem('UserModel');
    this.storageService.setItem('SigleProductLifeLineRoute', this.router.url);

    const obj = {
      Action: 'Update',
      Description: `accessed manage location page`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { });
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    //this.GetProductTrackbilityFromAPI();
    this.GetProductDropDownList(); // Get product autocomplete data
    this.GetWarehouseList();

  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) { }
  //#region location mgt funtions
  GetWarehouseList() {
    this.WarehouseDropdown = [];
    this.apiService.GetWarehouseDropDownData().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        for (const item of response.DropDownData) {
          this.WarehouseDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        if (this.WarehouseDropdown.length > 0) {
          this.selectedWarehouseID = response.DropDownData[0].ID;
          this.GetZoneList(this.selectedWarehouseID);
        }
      }
      else {
        console.log('internal serve Error', response);
      }
      this.cdr.detectChanges();
    });
  }

 GoToLifelineReport(){
    if(this.selectedProduct?.value!='' && this.selectedProduct?.value!= null)
    {
      this.storageService.setItem('SingleProductLifeLineLocationRedirect', true);
      this.storageService.setItem('SingleProductLifeLifeSelectedProductID', { ID:this.selectedProduct.value });
      this.router.navigate([`/reports/single-product-life-line`]);
    }
    else
    {
      this.toastService.showInfoToast('Info','No product selected');
      
    }
  }

  GetZoneList(wareHouseId: any) {
    this.ZoneDropdown = [];

    const id = {
      ID: wareHouseId
    };
    this.apiService.GetZonesByWarehouseIDForDropdown(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        for (const item of response.DropDownData) {
          this.ZoneDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        if (this.ZoneDropdown.length > 0) {
          this.selectedZoneID = response.DropDownData[0].ID;
          this.GetSecionsList(this.selectedZoneID);
        }
      }
      else {
        console.log('internal serve Error', response);
      }
      this.cdr.detectChanges();
    });
  }

  GetSecionsList(ZoneId: any) {
    this.SectionDropdown = [];

    const id = {
      ID: ZoneId
    };
    this.apiService.GetSectionsByZoneIDForDropdown(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        for (const item of response.DropDownData) {
          this.SectionDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        if (this.SectionDropdown.length > 0) {
          this.selectedSectionID = response.DropDownData[0].ID;
          this.GetLevelsList(this.selectedSectionID);
        }
      }
      else {
        console.log('internal serve Error', response);
      }
      this.cdr.detectChanges();
    });
  }

  GetLevelsList(SectionId: any) {
    this.LevelDropdown = [];

    const id = {
      ID: SectionId
    };
    this.apiService.GetAllLevelsBySectionID(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        for (const item of response.DropDownData) {
          this.LevelDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        if (this.LevelDropdown.length > 0) {
          this.selectedLevelID = response.DropDownData[0].ID;
        }
      }
      else {
        console.log('internal serve Error', response);
      }
      this.cdr.detectChanges();
    });
  }

  onChangeWareHouse(event: any)// Bind zone by warehouseid
  {
    this.GetZoneList(event.value);
  }

  onChangeZone(event: any)// Bind Section by zoneid
  {
    this.GetSecionsList(event.value);
  }

  onChangeSection(event: any)// Bind Section by zoneid
  {
    this.GetLevelsList(event.value);
  }
  //#endregion location mgt funtions

  BindProductLocationDetail(event: any) {

    if (event !== null) {
      this.resetDataFeilds();
      this.CheckProductTrackbility();
    }
  }
  resetDataFeilds() {
    this.selectedTrackables = [];
    this.selectedNonTrackable = '';
    this.selectedNonTrackableProdID = '';
    this.selectedNonTrackableProdVarID = '';
  }
  CheckProductTrackbility() {
    const params = {
      PageNo: 0,
      PageSize: 10000000,
      // OutletID: this.usermodel.OutletID,
      ProductID: 0,
      IsLocationAssigned: true,
      ProductVariantID: this.selectedProduct.value
    };
    if (this.selectedProduct.value === '-1') {
      this.GetTrackableProducts(params);
    }
    else if (this.selectedProduct.value === '-2') {
      this.GetNonTrackableProducts(params);
    }
    else {
      const productID = this.ProductData.filter((x: any) => x.ProductVariantID === this.selectedProduct.value)[0].ProductID;
      params.ProductID = productID;
      // const trackables = this.AllProductTrackabilityInfoItemList.filter((x: any) => x.ProductID === productID);
      // if (trackables[0].IsTrackable) {
      //   this.IsTrackable = true;
      //   this.GetTrackableProducts(params);
      // }
      // else {
      //   this.IsTrackable = false;
      //   this.GetNonTrackableProducts(params);
      // }
      this.IsTrackable = false;
      this.GetNonTrackableProducts(params);
    }

  }

  GetProductTrackbilityFromAPI() {
    this.apiService.CheckAllProductsTrackability().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.AllProductTrackabilityInfoItemList = response.AllProductTrackabilityInfoItemList;
      }
      else {
        console.log('internal serve Error', response);
      }
    }
    );
  }

  GetTrackableProducts(params: any) {
    this.isLoadingData = true;
    this.apiService.GetTrackeableProductsLocation(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.AllTrackableProductsLocationList = response.TrackableProductLocationModelList;
        this.AllTrackableProductsLocationList.forEach(item => {
          item.Product = (item.ProductVariant == null || item.ProductVariant === '') ? item.Product :
            item.Product + '<br/>(' + item.ProductVariant + ')';
        });
      }
      else {
        console.log('internal serve Error', response);
      }
      this.isLoadingData = false;
      this.cdr.detectChanges();
    });
  }
  GetNonTrackableProducts(params: any) {
    this.isLoadingData = true;
    this.apiService.GetNonTrackeableProductsLocation(params).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseCode === 0) {
        this.AllNonTrackableProductsLocationList = response.AllNonTrackableProductsLocationModelList.filter((x: any) => x.Quantity > 0);
        this.AllNonTrackableProductsLocationList.forEach(item => {
          item.Product = (item.ProductVariant === null || item.ProductVariant === '') ? item.Product :
            item.Product + '<br/>(' + item.ProductVariant + ')';
        });
      }
      else {
        console.log('internal serve Error', response);
      }
      this.isLoadingData = false;
      this.cdr.detectChanges();
    });

  }

  GetProductDropDownList() {
    this.isLoadingProducts = true;
    this.ProductDropdown = [];
    this.apiService.GetProductDropDownDatawithVariantInfoActiveInactive().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.ProductData = response.DropDownData;
        for (const item of response.DropDownData) {
          this.ProductDropdown.push({
            value: item.ProductVariantID,
            label: item.ProducVariantName,
          });
        }
        this.filteredProduct = this.ProductDropdown;
        if (this.ProductDropdown.length > 0) {
                    
          let LocationRedirection = this.storageService.getItem('LocationRedirectReturn');
          if (LocationRedirection) {         
            this.storageService.removeItem('LocationRedirectReturn');
            let filtervalues = this.storageService.getItem('SingleProductLifeLifeSelectedProductID');
            let productValues = this.filteredProduct.filter((x: any) => x.value == filtervalues.ID)[0];
             this.selectedProduct =  {
              value: productValues.value,
              label: productValues.label
            }
          }
          else
          {
            this.selectedProduct = this.ProductDropdown[0];
          }
          this.CheckProductTrackbility();
        }
      }
      else {
        console.log('internal serve Error', response);
      }
      this.isLoadingProducts = false;
      this.cdr.detectChanges();
    });
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


  Save() {
    this.btnDisabled = true;
    if (this.IsTrackable) {
      this.addLocationToTrackable();
    }
    else {
      this.addLocationToNonTrackable();
    }
  }

  OpenProductDialog() {
    this.IsOpenProductDialog = true;
    this.btn_open_modal_products.nativeElement.click();
  }

  selectValue(newValue: any) {
    this.IsOpenProductDialog = false;
    this.btn_open_modal_products.nativeElement.click();
    this.selectedProduct = {
      value: newValue.ProductVariantID,
      label: newValue.ProductName,
    };
    this.CheckProductTrackbility();
  }

  NonTrackableCheckboxChange(event: any) {
    // if (event.productChecked) {
    // $('.chkNonTrackable').not(checkbox).prop('checked', false);
    this.selectedNonTrackable = event.ID === -1 ? 0 : event.ID;
    this.selectedNonTrackableProdID = event.ProductID;
    this.selectedNonTrackableProdVarID = event.ProductVariantID;


    this.txtQuantity = event.Quantity;

    // }
    // else {
    //   this.selectedNonTrackable = null;
    //   this.selectedNonTrackableProdID = null;
    //   this.selectedNonTrackableProdVarID = null;
    //   this.txtQuantity = 0;
    // }


  }
  TrackableCheckboxChange(event: any) {
    if (event.productChecked) {
      const code = { TrackableForShoppingID: event.TrackableForShoppingID, LevelID: 0 };
      this.selectedTrackables.push(code);
    }
    else {
      const checkID = this.selectedTrackables.filter((x: any) => x.TrackableForShoppingID === event.TrackableForShoppingID).shift();
      // tslint:disable-next-line: deprecation
      if (isNullOrUndefined(checkID)) {
        this.toastService.showErrorToast('Error', 'Product was not added in the list');
        return;
      }

      const index = this.selectedTrackables.findIndex((x: any) => x.TrackableForShoppingID === event.TrackableForShoppingID);
      // tslint:disable-next-line: deprecation
      if (!isNullOrUndefined(checkID)) {
        this.selectedTrackables.splice(index, 1);
      }
    }
  }
  validationForTrackable() {
    // tslint:disable-next-line: deprecation
    if (this.selectedLevelID === '' || isNullOrUndefined(this.selectedLevelID)) {
      this.toastService.showErrorToast('Error', 'Please select level');
      return false;
    }

    if (!(this.selectedTrackables.length > 0)) {
      this.toastService.showErrorToast('Error', 'No product selected');
      return;
    }

    return true;
  }

  addLocationToTrackable() {
    if (!this.validationForTrackable()) {
      this.btnDisabled = false;
      return;
    }
    this.isLoadingProducts = true;
    this.selectedTrackables.forEach((x: any) => x.LevelID = this.selectedLevelID);
    const Params = { TrackableLocationItemList: this.selectedTrackables };
    this.apiService.SetTrackableProductLocation(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoadingProducts = false;
      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.CheckProductTrackbility();
        this.btnDisabled = false;
      }
      else {
        this.toastService.showErrorToast('Error', response.ResponseText);
        this.btnDisabled = false;
      }
      this.cdr.detectChanges();
    });
  }

  addLocationToNonTrackable() {
    if (!this.validationForNonTrackable(Number(this.selectedNonTrackable))) {
      this.btnDisabled = false;
      return;
    }
    const Params = {
      NonTrackableProductLocationID: Number(this.selectedNonTrackable),
      CreatedByUserID: Number(this.usermodel.ID),
      ProductID: Number(this.selectedNonTrackableProdID),
      ProductVariantID: Number(this.selectedNonTrackableProdVarID),
      LevelID: Number(this.selectedLevelID),
      Quantity: Number(this.txtQuantity),
    };
    this.isLoadingProducts = true;
    this.apiService.SetNonTrackableProductLocation(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoadingProducts = false;
      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.CheckProductTrackbility();
        this.btnDisabled = false;
      }

      else {
        this.toastService.showErrorToast('Error', response.ResponseText);
        this.btnDisabled = false;
      }
      this.cdr.detectChanges();
    });
  }

  validationForNonTrackable(selectedLocationID: any) {
    // tslint:disable-next-line: deprecation
    if (this.selectedLevelID === '' || isNullOrUndefined(this.selectedLevelID)) {
      this.toastService.showErrorToast('Error', 'Please select level');
      return false;
    }
    if (this.txtQuantity === 0 || this.txtQuantity < 0) {
      this.toastService.showErrorToast('Error', 'Please enter quantity');
      return false;
    }
    if (this.selectedNonTrackable == null) {
      this.toastService.showErrorToast('Error', 'Please select a product');
      return false;
    }
    
    const selected: any = this.AllNonTrackableProductsLocationList.filter((x: any) =>
      x.ID === selectedLocationID).shift();
    const qty = this.txtQuantity;

    if (qty > selected.Quantity) {
      this.toastService.showErrorToast('Error', 'Added quantity is more than the remaining quantity');
      return false;
    }

    return true;
  }
}
