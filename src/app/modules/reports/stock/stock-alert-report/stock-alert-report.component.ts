import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WishlistModel } from 'src/app/Helper/models/WishlistModel';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { Columns } from 'src/app/shared/model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { DatePipe } from '@angular/common';
import { datefilter } from 'src/app/Helper/datefilter';
import { Router } from '@angular/router';
import { ReportPermissionEnum } from 'src/app/shared/constant/report-permission';
import { AddwishlistDialogComponent } from 'src/app/EntryComponents/addwishlist-dialog/addwishlist-dialog.component';
import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { ConfirmationService } from 'src/app/Service/confirmation.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: 'app-stock-alert-report',
  templateUrl: './stock-alert-report.component.html',
  styleUrls: ['./stock-alert-report.component.scss'],
  providers: [DatePipe,ConfirmationService]

})
export class StockAlertReportComponent implements OnInit, OnDestroy {
  @ViewChild('wishList') wishList: AddwishlistDialogComponent;
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

  dateModalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };

  @ViewChild('datepicker') private datepickerModalComponent: ModalComponent;

  SearchByDateDropdown: any[];
  SearchByTypeDropdown: any[];
  SearchByStatusDropdown: any[];

  selectedSearchByDateID = '';
  isCustomDate = false;
  selectedID: any;
  // rowGroup: RowGroup = {
  //   property: 'Date',
  //   enableRowGroup: true,
  //   propertyType: RowGroupTypeEnum.DATE
  // };
  filterModel = {
    PageNo: 0,
    PageSize: 10,
    Product: '',
  };
  
  genericMenuItems: GenericMenuItems[] = [
    { label: 'Wishlist', icon: 'fas fa-shopping-cart', dependedProperty: 'ProductVariantID', permissionDisplayProperty:'IsAddToWhishlist' }

  ];
  columns: Columns[] = [
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' , translateCol: 'SSGENERIC.NAME'},
    { field: 'BLabel', header: 'ModelNo', sorting: 'BLabel', placeholder: '' , translateCol: 'SSGENERIC.MODELNO'},
    { field: 'Quantity', header: 'Quantity', sorting: 'Quantity', placeholder: '', translateCol: 'SSGENERIC.QUANTITY' },
    { field: 'Date', header: 'Date', sorting: 'Date', searching: true, placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DATE'}
  ];
  initialCoulumns = ['Product', 'BLabel', 'Quantity', 'Date'];
  globalFilterFields = ['Product', 'BLabel', 'Quantity','Date'];
  rowsPerPageOptions = [10, 20, 50, 100];
  IsSpinner: boolean;
  usermodel: any;
  UserDropDownList: any;
  StockAlertData: any = [];
  totalRecords: any = 0;
  fromDate: any = new Date();
  toDate: any = new Date();
  dateId: number;
  typeId: number;
  statusId: number;

  selectedVariantIDforWishlist: number;
  selectedProductNameforWishlist: string;
  isAddToWishlist = false;
  isLoadingData = false;
  constructor(
    private apiService: vaplongapi, 
    public router: Router,
    private datepipe: DatePipe, 
    private storageService: StorageService,
    private cdr: ChangeDetectorRef) {
    this.usermodel = this.storageService.getItem('UserModel');

    const obj = {
        Action: 'View',
        Description: 'View Stock Alert Report',
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }
  ngOnDestroy(): void {
  }
  SearchByDate(event: any) {
    if (event === 7) {
      this.isCustomDate = true;
      this.datepickerModalComponent.open();
    }
    else {
      this.dateId = Number(this.dateId);
      this.GetAllDataWithLazyLoadinFunction(this.filterModel);
    }
  }
 

  ngOnInit(): void {
    
    this.GetSearchByDateDropDownList();
  }
  emitAction(event: any) {
    if (event.forLabel === 'Wishlist') {
      this.AddToWishlist(event.selectedRowData.ProductVariantID, event.selectedRowData.Product);
    }

  }

  selectValue(newValue: any) {
    this.datepickerModalComponent.close();
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.dateId = 7;
    this.GetAllDataWithLazyLoadinFunction(this.filterModel);
  }

  GetSearchByDateDropDownList() {

    this.SearchByDateDropdown = [];

    this.SearchByDateDropdown.push({ value: 0, label: 'Today' });
    this.SearchByDateDropdown.push({ value: 1, label: 'Yesterday' });
    this.SearchByDateDropdown.push({ value: 2, label: 'Last7Days' });
    this.SearchByDateDropdown.push({ value: 3, label: 'Last30Days' });
    this.SearchByDateDropdown.push({ value: 4, label: 'ThisMonth' });
    this.SearchByDateDropdown.push({ value: 5, label: 'LastMonth' });
    this.SearchByDateDropdown.push({ value: 7, label: 'Custom' });
    this.dateId = 0;
  }
 
  GetAllDataWithLazyLoadinFunction(filterRM: any) {
  
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;

    if (this.dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(this.dateId);
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
      filterRequestModel.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    }
    else {
      filterRequestModel.IsGetAll = false;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
      filterRequestModel.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    }
    this.isLoadingData = true;
    this.apiService.GetStockAlertReportByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        this.StockAlertData = response1.AllStockAlertList;
        this.totalRecords = response1.TotalCount;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
      this.isLoadingData = false;
      this.cdr.detectChanges();
    });
  }
  AddToWishlist(ProductVariantID: number, Product: string) {
    this.selectedVariantIDforWishlist = ProductVariantID;
    this.selectedProductNameforWishlist = Product;
    this.isAddToWishlist = true;
    this.modalWishlistComponent.open();
  }
  CloseDialog(newValue: any) {
    this.isAddToWishlist = false;
    this.modalWishlistComponent.close();
    this.selectedVariantIDforWishlist = 0;
    this.selectedProductNameforWishlist = '';
    this.wishList.clearData();
  }
  close() {
    this.selectedVariantIDforWishlist = -1;
    this.selectedProductNameforWishlist = '';
    this.wishList.clearData();
  }
}
