import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WishlistModel } from 'src/app/Helper/models/WishlistModel';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { Columns } from 'src/app/shared/model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
// 
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
// //import { Table } from 'primeng/table';
// import { ConfirmationService, SelectItem } from 'primeng/api';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { DatePipe } from '@angular/common';
import { datefilter } from 'src/app/Helper/datefilter';
// import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { Router } from '@angular/router';
import { ReportPermissionEnum } from 'src/app/shared/constant/report-permission';
import { ConfirmationService } from 'src/app/Service/confirmation.service';
import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: 'app-opencartlog',
  templateUrl: './opencartlog.component.html',
  // styleUrls: ['./opencartlog.component.scss'],
  providers: [DatePipe,ConfirmationService]

})
export class OpencartLogComponent implements OnInit, OnDestroy { 
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
  rowGroup: RowGroup = {
    property: 'CreatedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  filterModel = {
    PageNo: 0,
    PageSize: 10,
    Product: '',
  };
  
  genericMenuItems: GenericMenuItems[] = [
    { label: 'RePost', icon: 'fas fa-undo', dependedProperty: 'ID',  permission: ReportPermissionEnum.OpencartReposting, permissionDisplayProperty: 'showPostable' }

  ];
  columns: Columns[] = [
    { field: 'ActionName', header: 'Action', sorting: 'ActionName', placeholder: '' , translateCol: 'SSGENERIC.ACTION'},
    { field: 'ActionID', header: 'ActionID', sorting: 'ActionID', placeholder: '' ,type: TableColumnEnum.REDIRECTION_COLUMN, translateCol: 'SSGENERIC.ACTIONID'},
    { field: 'CreatedAt', header: 'Date', sorting: 'CreatedAt', placeholder: '',type: TableColumnEnum.DATE_FORMAT ,translateCol: 'SSGENERIC.DATE' },
    { field: 'Status', header: 'Status', sorting: 'Status', placeholder: '', translateCol: 'SSGENERIC.STATUS' }
  ];
  initialCoulumns = ['ActionName', 'ActionID', 'Status', 'CreatedAt'];
  globalFilterFields = ['ActionName', 'ActionID', 'Status', 'CreatedAt'];
  rowsPerPageOptions = [10, 20, 50, 100];
  IsSpinner: boolean;
  usermodel: any;
  UserDropDownList: any;
  allLogs: any = [];
  totalRecords: any = 0;
  fromDate: any = new Date();
  toDate: any = new Date();
  dateId: number;
  typeId: number;
  statusId: number;
  constructor(
    private apiService: vaplongapi, 
    // private toastService: ToastService,
    private toastService : ToastService,
    private cdr : ChangeDetectorRef,
    public router: Router,
    private confirmationService: ConfirmationService,
    private datepipe: DatePipe, 
    private storageService: StorageService) {
    this.usermodel = this.storageService.getItem('UserModel');

    this.storageService.setItem('PurchaseDetailRoute', this.router.url);
    this.storageService.setItem('VPSaleDetailRoute', this.router.url);
    this.storageService.setItem('OnlineSaleDetailRoute', this.router.url);
    this.storageService.setItem('ReturnPurchaseDetailRoute', this.router.url);
    this.storageService.setItem('ReturnSaleDetailRoute', this.router.url);

    const obj = {
        Action: 'View',
        Description: `View OpenCart Log Report`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { });
    this.AddDatabaseBackup();
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
  SearchByType(event: any) {
  
      this.GetAllDataWithLazyLoadinFunction(this.filterModel);
   
  }
  SearchByStatus(event: any) {
  
    this.GetAllDataWithLazyLoadinFunction(this.filterModel);
 
}

  ngOnInit(): void {
    
    this.GetSearchByDateDropDownList();
    this.GetSearchByTypeDropDownList();
    this.GetSearchByStatusDropDownList();
    this.cdr.detectChanges();

  }
  emitAction(event : any) {
    if (event.forLabel === 'RePost') {
      this.RepostingOpenCart(event.selectedRowData);
    }
   
  }
  RepostingOpenCart(data : any) {
    // this.confirmationService.confirm({
    //   message: 'Are you sure, you want to repost on opencart',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     this.RepostDataToOpenCart(data.ID);
    //   }

    // });
    this.confirmationService.confirm('Are you sure, you want to repost on opencart?').then(
      (confirmed) => {
        this.RepostDataToOpenCart(data.ID);
      }
    )
  }

  RepostDataToOpenCart(id : any) {
    const param = {
      ID: id,
      RequestedUserID: this.usermodel.ID,
    };
    this.apiService.PostFailsRequestAgain(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        // this.toastService.showSuccessToast('Success', response.ResponseText);
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        // this.toastService.showErrorToast('Error', response.ResponseText);
        this.toastService.showErrorToast('Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    });
  }
  getDetailsPage(event : any) {
     //ActionType Sale=1, Online Order=2 ,Full Return Sale=3, Full Sale Refund Online = 4, half Sale Refund = 5, Purchase = 6,Full Purchase Refund=7, half Purchase Refund = 8 , manually Update All Product Stock = 9,manually update selected Product Stock =10, Updation on Assign Location =11;

    if(event.ActionID==0||event.ActionID=='0' )
    this.toastService.showInfoToast('Info', 'no redirection found for this.');
    else if(event.Type==1)
      this.router.navigate([`/sale/vp-sale-detail/${event.ActionID}`]);
    else if (event.Type == 2)
    this.router.navigate([`/sale/online-order-detail/${event.ActionID}`]);
    else if (event.Type == 6)
      this.router.navigate([`/purchase/details/${event.ActionID}`]);
    else if (event.Type == 7 || event.Type == 8)
      this.router.navigate([`/purchase/return-details/${event.ActionID}`]);
    else if (event.Type == 3 || event.Type == 4 || event.Type == 5)
      this.router.navigate([`/sale/refundsale-detail/${event.ActionID}`]);
    else if (event.Type == 11)
      this.toastService.showInfoToast('Info', 'no redirection found for this.');


      
  }

  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.datepickerModalComponent.close();
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
    this.SearchByDateDropdown.push({ value: 6, label: 'All' });
    this.SearchByDateDropdown.push({ value: 7, label: 'Custom' });
    this.dateId = 6;
  }
  GetSearchByTypeDropDownList() {

    this.SearchByTypeDropdown = [];
    this.SearchByTypeDropdown.push({ value: 0, label: 'All' });
    this.SearchByTypeDropdown.push({ value: 1, label: 'Sale' });
    this.SearchByTypeDropdown.push({ value: 6, label: 'Purchase' });
    this.SearchByTypeDropdown.push({ value: 2, label: 'Online Order' });
    this.SearchByTypeDropdown.push({ value: 3, label: 'Full Return Sale' });
    this.SearchByTypeDropdown.push({ value: 4, label: 'Full Sale Refund Online' });
    this.SearchByTypeDropdown.push({ value: 5, label: 'Half Sale Refund' });
    this.SearchByTypeDropdown.push({ value: 7, label: 'Full Purchase Refund' });
    this.SearchByTypeDropdown.push({ value: 8, label: 'Half Purchase Refund' });

    this.typeId = 0;
  }

  GetSearchByStatusDropDownList() {

    this.SearchByStatusDropdown = [];
    this.SearchByStatusDropdown.push({ value: 0, label: 'All' });
    this.SearchByStatusDropdown.push({ value: 1, label: 'Success' });
    this.SearchByStatusDropdown.push({ value: 2, label: 'Failure' });
    this.statusId = 0;
  }

  GetAllDataWithLazyLoadinFunction(filterRM : any) {
  
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.ToDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.UserID = this.selectedID ? this.selectedID.value : 0;
    filterRequestModel.Type = this.typeId;
    filterRequestModel.PermissionLevel = this.statusId;
    filterRequestModel.Product = filterRM.Product;

    if (this.dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(this.dateId);
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date((this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
      filterRequestModel.FromDate = new Date((this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    }
    else {
      filterRequestModel.IsGetAll = false;
      filterRequestModel.ToDate = new Date((this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
      filterRequestModel.FromDate = new Date((this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    }
    this.IsSpinner = true;
    this.apiService.GetAllOpenCartLogs(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      this.IsSpinner = false;
      if (response1.ResponseCode === 0) {
        response1.OpenCartLogModelList.forEach((element : any) => {
          element.showPostable = (element.IsPosted == false && element.IsFailed == true ) ? true : false;
        });
        this.allLogs = response1.OpenCartLogModelList;
        this.totalRecords = response1.TotalCount;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
      this.cdr.detectChanges();
    });
  }
  AddDatabaseBackup() 
  {
    var req = { ID: this.usermodel.ID };
    this.apiService.CreateBackup(req).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        // this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'backup created successfully.');
        // this.GetAllBackupHistoryList();
      }
      else {
        //this.toastService.showErrorToast('Error', response.ResponseText);
      }
    },
    );
  }
}
