import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WishlistModel } from 'src/app/Helper/models/WishlistModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';


import { Columns } from 'src/app/shared/model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: 'app-manage-internal-orders',
  templateUrl: './manage-internal-orders.component.html',
  styleUrls: ['./manage-internal-orders.component.scss']
})

export class ManageInternalOrdersComponent implements OnInit, OnDestroy {
  
  modalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideDismissButton: () => true
  };

  @ViewChild('modal') private modalComponent: ModalComponent;

  @ViewChild('btn_open_modal_add_internal_order') btn_open_modal_add_internal_order: ElementRef
  @ViewChild('btn_open_modal_products') btn_open_modal_products: ElementRef
  loadingData = false;
  AllInternalOrderList: WishlistModel[] = [];
  selectedInternalOrder: WishlistModel;
  public internalOrder: WishlistModel;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedProductID = '';
  Products: any[];
  filteredProduct: any[];
  selectedProduct: any;
  Quantity: any;
  Remarks: any;
  items: any[];
  ProductDropdown: any[];
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 25;
  // last = 25;
  totalRecords = 0;

  usermodel: UserModel;
  displayDialog = false;
  DialogRemarks = '';

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-edit', dependedProperty: 'ID' },
  ];

  rowGroup: RowGroup = {
    property: 'CreatedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };

  columns: Columns[] = [
    { field: 'CreatedBy', header: 'Created By', sorting: 'CreatedBy', placeholder: '' , translateCol: 'SSGENERIC.CREATEDBY'},
    { field: 'BLabel', header: 'Model', sorting: 'BLabel', placeholder: '', translateCol: 'SSGENERIC.MODEL' },
    { field: 'Barcode', header: 'EAN', sorting: 'Barcode', placeholder: '' , translateCol: 'SSGENERIC.EAN'},
    { field: 'ProductVariant', header: 'Product', sorting: 'ProductVariant', placeholder: '', translateCol: 'SSGENERIC.PRODUCT' },
    { field: 'Quantity', header: 'Quantity', sorting: 'Quantity', placeholder: '' , translateCol: 'SSGENERIC.QUANTITY'},
    { field: 'CreatedAt', header: 'CreatedAt', sorting: 'CreatedAt', placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.CREATEDAT' },
    { field: 'Outlet', header: 'Outlet', sorting: 'Outlet', placeholder: '' , translateCol: 'SSGENERIC.OUTLET'},
    { field: 'Remarks', header: 'Remarks', sorting: '', placeholder: '', type: TableColumnEnum.REMARKS, translateCol: 'SSGENERIC.REMARKS' },

  ];
  productsColumn: Columns[] = [
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' },
    { field: 'Color', header: 'Color', sorting: 'Color', placeholder: '' },
    { field: 'PurchasePrice', header: 'PurchasePrice', sorting: 'PurchasePrice', placeholder: '' }
  ];
  globalFilterFields = ['CreatedBy','BLabel', 'ProductVariantID', 'Barcode', 'ProductVariant', 'Quantity', 'CreatedAt', 'Outlet'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];

  dataFunc: any = customSearchFn;
  ProductData: any = [];
  IsOpenProductDialog = false;
  constructor(
    private apiService: vaplongapi, 
    private toastService: ToastService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef) {
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Wish-Lists`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { });
  }

  ngOnInit(): void {

    this.usermodel = this.storageService.getItem('UserModel');
    this.internalOrder = new WishlistModel();
    this.GetAllInternalOrderList(); // Get All Internal Order List On Page Load
    this.GetProductVariantDropDownList(); // Get All ProductVariant List On Page Load for Dropdown

  }
  ngOnDestroy(): void {

  }
  emitAction(event: any) {
    if (event.forLabel === 'Update') {
      this.EditInternalOrder(event.selectedRowData);
    }

  }
  GetAllInternalOrderList() // Get All Internal Method Get Data from Service
  {
    const request = new FilterRequestModel();
    request.IsPurchased = false;
    request.IsAproved = false;
    if (this.usermodel.ID === 1) {
      request.IsGetAll = true;
    } else {
      request.ID = this.usermodel.ID;
    }
    this.loadingData = true;
    this.apiService.GetAllInternalOrderList(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.loadingData = false;
      if (response.ResponseCode === 0) {
        
        this.AllInternalOrderList = response.Wishlists.filter((x: any) => x.IsApproved === false);
        this.totalRecords = this.AllInternalOrderList.length;

      }
      else {
        console.log('internal server error ! not getting api data');
      }
      this.cdr.detectChanges();
    },
    );

  }

  GetProductVariantDropDownList() {

    this.Products = [];
    // this.apiService.GetProductDropDownDatawithVariantInfo().pipe(untilDestroyed(this)).subscribe((response: any) => {
    //   if (response.ResponseCode === 0) {
    //     this.selectedProductID = response.DropDownData[0].ProductVariantID;
    //     for (let i = 0; i < response.DropDownData.length; i++) {
    //       this.Products.push({
    //         value: response.DropDownData[i].ProductVariantID,
    //         label: response.DropDownData[i].ProducVariantName,
    //       });
    //     }
    this.apiService.GetPurchaseProduct().pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = true;
      if (response.ResponseText === 'success') {
        this.IsSpinner = false;
        response.AllProductVariantList = response.AllProductVariantList.filter((x: any) => x.IsActive === true);
        this.ProductData = response.AllProductVariantList;
        for (const item of response.AllProductVariantList) {
          this.Products.push({
            value: item.ID,
            label: item.Product,
          });
        }
        this.filteredProduct = this.Products;
      }
      else {
        console.log('internal serve Error', response);
      }
      this.cdr.detectChanges();
    }
    );
  }

  SaveUpdateInternalOrderDetails() {
    this.btn_open_modal_add_internal_order.nativeElement.click();
    if (this.internalOrder.ID > 0)  // for Update
    {
      this.UpdateInternalOrder();
    }
    else {
      this.SaveInternalOrder(); // for save
    }


  }
  SaveInternalOrder() // Save InternalOrder Method To Communicate API
  {
    this.IsSpinner = true;
    this.internalOrder.ProductVariantID = Number(this.selectedProduct.value);
    this.internalOrder.Remarks = this.Remarks;
    this.internalOrder.Quantity = this.Quantity;
    this.internalOrder.CreatedByID = this.usermodel.ID;
    this.internalOrder.OutletID = this.usermodel.OutletID;
    this.apiService.AddWishlist(this.internalOrder).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllInternalOrderList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
    });
  }
  UpdateInternalOrder() // Update Cash Register Method To Communicate API
  {
    this.IsSpinner = true;
    this.internalOrder.ProductVariantID = Number(this.selectedProduct.value);
    this.internalOrder.Remarks = this.Remarks;
    this.internalOrder.Quantity = this.Quantity;
    this.internalOrder.CreatedByID = this.usermodel.ID;
    this.internalOrder.OutletID = this.usermodel.OutletID;

    this.apiService.UpdateWishlist(this.internalOrder).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllInternalOrderList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
      this.cdr.detectChanges();
    },
    );
  }

  EditInternalOrder(internalOrder: WishlistModel) {
    this.internalOrder = internalOrder;
    this.selectedProduct = {
      value: internalOrder.ProductVariantID,
      label: internalOrder.ProductVariant
    };
    this.Quantity = this.internalOrder.Quantity;
    this.Remarks = this.internalOrder.Remarks;
    this.btn_open_modal_add_internal_order.nativeElement.click();
  }

  showDialog(event: any) {
    this.displayDialog = true;
    this.DialogRemarks = event.Remarks;
    this.openModal();
  }
  OpenProductDialog() {
    this.IsOpenProductDialog = true;
    this.btn_open_modal_products.nativeElement.click();
  }
  selectValue(newValue: any) {
    const obj = {
      value: newValue.ID,
      label: newValue.Product
    };
    this.selectedProduct = obj;
    this.IsOpenProductDialog = false;

    this.closeProductsModal();
  }

  closeProductsModal() {
    this.btn_open_modal_products.nativeElement.click();
    this.btn_open_modal_add_internal_order.nativeElement.click();
  }

  openAddModal() {
    this.btn_open_modal_add_internal_order.nativeElement.click();
  }
  
  async openModal() {
    return await this.modalComponent.open();
  }
}

