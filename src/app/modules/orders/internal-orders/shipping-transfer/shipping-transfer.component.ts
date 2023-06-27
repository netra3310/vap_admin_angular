import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { datefilter } from 'src/app/Helper/datefilter';

import { DatePipe } from '@angular/common';
import { Columns } from 'src/app/shared/model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { ShipmentModel } from './../../../../Helper/models/ShipmentModel';
import {  Router } from '@angular/router';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { OrderPermissionEnum } from 'src/app/shared/constant/order-permission';
import { forkJoin } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';


@Component({
  selector: 'app-shipping-transfer',
  templateUrl: './shipping-transfer.component.html',
  styleUrls: ['./shipping-transfer.component.scss'],
  providers: [DatePipe]
})

export class ShippingTransferComponent implements OnInit, OnDestroy {
  dateModalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };

  @ViewChild('datepicker') private datepickerModalComponent: ModalComponent;

  @ViewChild("btn_open_modal_update") btn_open_modal_update: ElementRef
  OrderPermission = OrderPermissionEnum;

  printHidden = false;
  IsSpinner = false;
  loading: boolean;
  first = 0;
  totalRecords = 0;
  dateId = 6;
  rows = 10;
  filterModel = {
    PageNo: 0,
    PageSize: 10,
    Product: '',
  };
  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z";
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z";

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-edit', dependedProperty: 'ID' },
    { label: 'Show Details', icon: 'fas fa-edit', dependedProperty: 'ID' },
    { label: 'Receive', icon: 'fas fa-edit', dependedProperty: 'ID' },
    { label: 'Print', icon: 'fas fa-edit', dependedProperty: 'ID' },

  ];

  rowGroup: RowGroup = {
    property: 'dtDate',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  columns: Columns[] = [
    { field: 'TrackingCode', header: 'Tracking Code', sorting: 'TrackingCode', placeholder: '', translateCol: 'SSGENERIC.TRACKINGCODE' },
    { field: 'Outlet', header: 'From Head Office | Outlet', sorting: 'Outlet', placeholder: '', translateCol: 'SSGENERIC.FROMHEADOFFC' },
    {
      field: 'Outlet1', header: 'To Outlet | Head Office', sorting: 'Outlet1', placeholder: '',
      translateCol: 'SSGENERIC.TOOUTLETHEADOFFC'
    },
    { field: 'TrackingWebsite', header: 'Tracking Website', sorting: 'TrackingWebsite', placeholder: '', translateCol: 'SSGENERIC.TRACKINGWEBSITE' },
    {
      field: 'dtDate', header: 'Date', sorting: 'dtDate', placeholder: '',
      type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DATE'
    },
  ];
  globalFilterFields = ['TrackingCode', 'Outlet', 'Outlet1', 'TrackingWebsite', 'dtDate'];
  rowsPerPageOptions = [10, 20, 50, 100];

  SearchByDateDropdown: any[];
  filterRequestModel: FilterRequestModel;
  selectedSearchByDateID: any;
  ShippingTransferList: any[] = [];
  shippingTransfer: ShipmentModel;
  selectedshipping: { TrackingCode: string; TrackingWebsite: string; };
  IsUpdateDialog: boolean;
  selectedshiping: any = {};
  totalData = {
    totalQuantity: 0,
    totalRMB: 0,
    totalDollar: 0,
    totalEuro: 0
  };
  ShipmentDetails: any[] = [];
  FromOutLetData: any = {};
  ToOutLetData: any = {};
  usermodel: any;
  initPageNo = 0;
  constructor(
    private apiService: vaplongapi, 
    private datepipe: DatePipe, 
    private toastService: ToastService, 
    public router: Router,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef) {
    this.storageService.setItem('STDetailRoute', this.router.url);
    this.storageService.setItem('STReceiveRoute', this.router.url);

    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Created Shipment`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {

    const initPageNo = this.storageService.getItem('shipping_transfer_page_no');
    if(initPageNo > 0) {
      this.initPageNo = initPageNo;
      this.filterModel.PageNo = this.initPageNo;
      this.storageService.removeItem('shipping_transfer_page_no');
    }

    this.SearchByDateDropdown = [];

    this.SearchByDateDropdown.push({ value: '0', label: 'Today' });
    this.SearchByDateDropdown.push({ value: '1', label: 'Yesterday' });
    this.SearchByDateDropdown.push({ value: '2', label: 'Last7Days' });
    this.SearchByDateDropdown.push({ value: '3', label: 'Last30Days' });
    this.SearchByDateDropdown.push({ value: '4', label: 'ThisMonth' });
    this.SearchByDateDropdown.push({ value: '5', label: 'LastMonth' });
    this.SearchByDateDropdown.push({ value: '6', label: 'All' });
    this.SearchByDateDropdown.push({ value: '7', label: 'Custom' });
    this.selectedSearchByDateID = '6';
    this.GetAllShipmentTransfers(this.filterModel); // Get All Internal Order List On Page Load
  }

  ngOnDestroy(): void {

  }
  emitAction(event: any) {
    if (event.forLabel === 'Update') {
      this.updateShipping(event.selectedRowData);
    }
    else if (event.forLabel === 'Show Details') {
      this.storageService.setItem("shipping_transfer_page_no", (event.curPageNo - 1));
      this.GoToDetails(event.selectedRowData);
    }
    else if (event.forLabel === 'Receive') {
      this.storageService.setItem("shipping_transfer_page_no", (event.curPageNo - 1));
      this.GoToReceive(event.selectedRowData);
    }
    else if (event.forLabel === 'Print') {
      this.GetShipmentTransfersDetailsById(event.selectedRowData);
    }
  }
  onChangeDate(event: any) {
    if (event === '7') {
      this.isCustomDate = true;
      this.openDatePickerModal();
    }
    else {
      this.dateId = Number(this.selectedSearchByDateID);
      this.GetAllShipmentTransfers(this.filterModel);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.datepickerModalComponent.close();
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;

    this.dateId = 7;
    this.GetAllShipmentTransfers(this.filterModel);
  }


  updateShipping(shipping: ShipmentModel) {
    this.IsUpdateDialog = true;
    this.btn_open_modal_update.nativeElement.click();
    this.shippingTransfer = shipping;
    this.shippingTransfer.TrackingCode = shipping.TrackingCode;
    this.shippingTransfer.TrackingWebsite = shipping.TrackingWebsite;

  }
  GoToDetails(selectedRowData: any) {
    
    this.router.navigate([`/orders/shipping-transfer/Details/ID/${selectedRowData.ID}`]);
  }
  GoToReceive(selectedRowData: any) {
    this.router.navigate([`/orders/shipping-transfer/Receive/ID/${selectedRowData.ID}`]);
  }
  GetShipmentTransfersDetailsById(selectedRowData: any) {
    const obj = {
      ID: selectedRowData.ID
    };
    this.IsSpinner = true;
    this.apiService.GetShipmentTransfersDetailsById(obj).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseCode === 0) {
        this.selectedshiping = response.ShipmentModel;
        this.ShipmentDetails = [...this.selectedshiping.ShipmentDetails];
        this.ShipmentDetails.forEach(element => {
          element.CurrencyID = element.CurrencyID === 1 ? 'RMB' : element.CurrencyID === 2 ? 'Dollar' : 'Euro';
        });
        this.ShipmentDetails.forEach(element => {
          this.totalData.totalQuantity += element.Quantity;
          if (element.CurrencyID === 'RMB') {
            this.totalData.totalRMB += element.Price;
          }
          if (element.CurrencyID === 'Dollar') {
            this.totalData.totalDollar += element.Price;
          }
          if (element.CurrencyID === 'Euro') {
            this.totalData.totalEuro += element.Price;
          }
        });
        // this.ShipmentDocuments = this.selectedshiping.ShipmentDocuments;
        this.GetOutLetFromById(this.selectedshiping.OutletID, this.selectedshiping.ToOutletID);
        // this.GetOutLetToById(this.selectedshiping.ToOutletID);
      }
      this.cdr.detectChanges();
    });
  }
  GetOutLetFromById(OutletID: any, ToOutletID: any) {
    const outLetFrom = {
      ID: OutletID
    };
    const toOutLet = {
      ID: ToOutletID
    };
    // tslint:disable-next-line: deprecation
    this.IsSpinner = true;
    forkJoin(
      this.apiService.GetOutLetById(outLetFrom).pipe(untilDestroyed(this)),
      this.apiService.GetOutLetById(toOutLet).pipe(untilDestroyed(this))).subscribe((response: any) => {
        this.IsSpinner = false;
        if (response) {
          this.FromOutLetData = response[0].OutletModel;
          this.ToOutLetData = response[1].OutletModel;
          this.Print();
        }
        this.cdr.detectChanges();
      });

  }
  // GetOutLetToById(ToOutletID) {
  //   const toOutLet = {
  //     ID: ToOutletID
  //   }
  //   this.apiService.GetOutLetById(toOutLet).pipe(untilDestroyed(this)).subscribe((response: any) => {
  //     if (response.ResponseCode === 0) {
  //       this.ToOutLetData = response.OutletModel;

  //     }
  //   })
  // }
  GetAllShipmentTransfers(filterRM: any) // Get All Internal Method Get Data from Service
  {
    const Type = 1;
    const filterRequestModel = new FilterRequestModel();
    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "" + "Z");
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.IsReceived = true;
    filterRequestModel.Product = filterRM.Product;

    if (+Type === 0) {
      filterRequestModel.PermissionLevel = 3;
    } else {
      filterRequestModel.PermissionLevel = Type;
    }

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
    this.IsSpinner = true;
    this.apiService.GetAllShipmentTransfers(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseCode === 0) {
        response.AllShipmentList.forEach((element: any) => {
          element.CurrencyID = element.CurrencyID === 1 ? 'RMB' : element.CurrencyID === 2 ? 'Dollar' : 'Euro';
        });
        this.ShippingTransferList = response.AllShipmentList;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
      this.cdr.detectChanges();
    });

  }

  updateShippingData() {
    this.IsSpinner = true;
    this.btn_open_modal_update.nativeElement.click();
    this.apiService.UpdateInternalShipment(this.shippingTransfer).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      this.IsUpdateDialog = false;
      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllShipmentTransfers(this.filterModel);
      }
      else {
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
    },
    );
  }

  Print() {
    setTimeout(() => {
      let printContents;
      let popupWin;

      printContents = document.getElementById('printA4')?.innerHTML ?? "";
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

  async openDatePickerModal() {
    return await this.datepickerModalComponent.open();
  }

}

