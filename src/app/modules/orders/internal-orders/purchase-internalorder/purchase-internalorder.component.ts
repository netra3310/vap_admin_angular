import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WishlistModel } from '../../../../Helper/models/WishlistModel';
import { UserModel } from '../../../../Helper/models/UserModel';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { FilterRequestModel } from '../../../../Helper/models/FilterRequestModel';
import { UpdateStatus } from '../../../../Helper/models/UpdateStatus';


import { Columns } from 'src/app/shared/model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

type Tabs = 'purchase' | 'no_purchase';

@Component({
  selector: 'app-purchase-internalorder',
  templateUrl: './purchase-internalorder.component.html',
  styleUrls: ['./purchase-internalorder.component.scss'],
  styles: [`

        :host ::ng-deep .row-purchased {
            background-color: rgb(221 215 215 / 91%) !important;
        }
    `
  ]
})
export class PurchaseInternalOrderComponent implements OnInit, OnDestroy {
    
  modalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideDismissButton: () => true
  };

  @ViewChild('modal') private modalComponent: ModalComponent;

  AllInternalOrderListOrginal: WishlistModel[] = [];
  AllInternalOrderList: WishlistModel[]=[];
  selectedInternalOrder: WishlistModel;
  public internalOrder: WishlistModel;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedProductID = '';
  Quantity: any;
  Remarks: any;
  selectedFilter = 2;
  items: any[];
  ProductDropdown: any[];
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 10;
  // last = 25;
  totalRecords = 0;

  usermodel: UserModel;
  displayDialog = false;
  DialogRemarks = '';

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Purchased', icon: 'fas fa-shopping-basket', dependedProperty: 'ID',permissionDisplayProperty:'showButton' },
    { label: 'Delete', icon: 'fas fa-trash-alt', dependedProperty: 'ID',permissionDisplayProperty:'showButton' },

  ];

  rowGroup: RowGroup = {
    property: 'CreatedAtString',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.STRING
  };
  columns: Columns[] = [
    { field: 'CreatedBy', header: 'Created By', sorting: 'CreatedBy', placeholder: '', translateCol: 'SSGENERIC.CREATEDBY' },
    { field: 'BLabel', header: 'Model', sorting: 'BLabel', placeholder: '', translateCol: 'SSGENERIC.MODEL' },
    { field: 'Barcode', header: 'EAN', sorting: 'Barcode', placeholder: '', translateCol: 'SSGENERIC.EAN' },
    { field: 'ProductVariant', header: 'Product', sorting: 'ProductVariant', placeholder: '' , translateCol: 'SSGENERIC.PRODUCT'},
    { field: 'Quantity', header: 'Quantity', sorting: 'Quantity', placeholder: '', translateCol: 'SSGENERIC.QUANTITY' },
    { field: 'CreatedAtString', header: 'CreatedAt', sorting: 'CreatedAtString', placeholder: '', translateCol: 'SSGENERIC.CREATEDAT' },
    { field: 'Outlet', header: 'Outlet', sorting: 'Outlet', placeholder: '' , translateCol: 'SSGENERIC.OUTLET'},
    { field: 'Remarks', header: 'Remarks', sorting: '', placeholder: '', type: TableColumnEnum.REMARKS, translateCol: 'SSGENERIC.REMARKS' },

  ];

  globalFilterFields = ['CreatedBy', 'ProductVariantID', 'Barcode', 'ProductVariant', 'Quantity', 'CreatedAtString', 'Outlet'];
  rowsPerPageOptions = [10, 20, 50, 100];

  activeTab: Tabs = 'purchase';

  constructor(
    private apiService: vaplongapi, 
    private storageService: StorageService, 
    private cdr: ChangeDetectorRef,
    private toastService: ToastService) {

  }

  ngOnInit(): void {

    this.usermodel = this.storageService.getItem('UserModel');

    this.GetAllInternalOrderList(); // Get All Internal Order List On Page Load

  }
  ngOnDestroy(): void {

  }
  emitAction(event: any) {
    if (event.forLabel === 'Purchased') {
      this.PurchasedInternalOrder(event.selectedRowData);
    }
    else if (event.forLabel === 'Delete') {
      this.RejectInternalOrder(event.selectedRowData);
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
    this.IsSpinner = true;
    this.apiService.GetAllInternalOrderList(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseText === 'success') {
        response.Wishlists.forEach((element1: any) => {
          element1.showButton = !element1.IsPurchased;
        });
        this.AllInternalOrderList = response.Wishlists.filter((x: any) => x.IsApproved === true);
        this.AllInternalOrderListOrginal = response.Wishlists.filter((x: any) => x.IsApproved === true);
        
        this.AllInternalOrderList = this.AllInternalOrderListOrginal.filter(x => x.IsPurchased === true);
        this.totalRecords = this.AllInternalOrderList.length;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
      this.cdr.detectChanges();
    });
  }
  PurchasedInternalOrder(internalOrder: WishlistModel) {
    const request = new UpdateStatus();
    request.ID = internalOrder.ID;
    request.Status = true;
    request.UpdatedByUserID = this.usermodel.ID;
    this.IsSpinner = true;
    this.apiService.UpdateWishlistStatusToPurchased(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllInternalOrderList();
      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
      this.cdr.detectChanges();
    });
  }
  RejectInternalOrder(internalOrder: WishlistModel) {
    const request = new UpdateStatus();
    request.ID = internalOrder.ID;
    request.Status = false;
    request.UpdatedByUserID = this.usermodel.ID;
    this.IsSpinner = true;
    this.apiService.UpdateWishlistStatusToRejected(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllInternalOrderList();
      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
      this.cdr.detectChanges();
    });
  }
  filterReport() {
    console.log(this.selectedFilter);
    if (Number(this.selectedFilter) === 1) {
      this.AllInternalOrderList = this.AllInternalOrderListOrginal;
    }
    else if (Number(this.selectedFilter) === 2) {
      this.AllInternalOrderList = this.AllInternalOrderListOrginal.filter(x => x.IsPurchased === true);
    }
    else {
      this.AllInternalOrderList = this.AllInternalOrderListOrginal.filter(x => x.IsPurchased === false);
    }
  }

  showDialog(event: any) {

    this.displayDialog = true;
    this.modalComponent.open();
    this.DialogRemarks = event.Remarks;
  }


  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
    switch(tab) {
      case 'purchase' :
        this.selectedFilter = 2;
        break;
      case 'no_purchase' :
        this.selectedFilter = 3;
        break;
    }
    this.filterReport(); 
  }
}


