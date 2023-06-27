import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { ShipmentDetailModel, ShipmentDocuments, ShipmentModel } from './../../../../Helper/models/ShipmentModel';
import { ActivatedRoute, Router } from '@angular/router';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { DatePipe } from '@angular/common';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { isNullOrUndefined } from 'src/app/Helper/global-functions';
import { SearchPipe } from 'src/app/shared/pipes/search-pipe';


@Component({
  selector: 'app-shipping-transfer-receive',
  templateUrl: './shipping-transfer-receive.component.html',
  styleUrls: ['./shipping-transfer-receive.component.scss'],
  providers: [DatePipe]
})

export class ShippingTransferReceiveComponent implements OnInit, OnDestroy {
  @ViewChild('btn_open_modal_documents') btn_open_modal_documents:ElementRef;

  IsSpinner = false;
  loading: boolean;
  first = 0;
  rows = 10;
  totalRecords = 0;
  selectedProductVariantID = 0;
  dataFunc: any = customSearchFn;
  trackables: any[] = [];
  displayTrackable = false;
  displayAllTrackable = false;

  TrackableListForDisplay: any[] = [];
  AllTrackableListForDisplay: any[] = [];

  selectedRowForProductTrackableSelectionID = 0;
  details: any[] = [];
  productAlltrackables: any[] = [];
  columns: Columns[] = [
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' },
    { field: 'Quantity', header: 'Shipped Quantity', sorting: 'Quantity', placeholder: '' },
    { field: 'ReceivedQuantity', header: 'Received Quantity', sorting: 'ReceivedQuantity', placeholder: '' },
  ];

  documentsColumns: Columns[] = [
    { field: 'sDocument', header: 'File Name', sorting: 'sDocument', placeholder: '' },
  ];

  globalFilterFields = ['Product', 'Quantity', 'ReceivedQuantity'];
  documentGlobalFilterFields = ['sDocument'];
  rowsPerPageOptions = [10, 20, 50, 100];

  selectedshipping: any = {};
  ShipmentDetails: any[] = [];
  showItems: any;
  ToOutLetData: any = {};
  FromOutLetData: any = {};
  ShipmentDocuments: [ShipmentDocuments];
  IsDocumentDialog = false;

  NewReceivedQuantity = 0;
  totalQuantity = 0;
  mySearch: any;
  // ToDate = new Date().toISOString();
  ReceivingDate: Date;
  usermodel: any;

  searchKey : string;
  constructor(
    private apiService: vaplongapi, 
    private toastService: ToastService,
    private route: ActivatedRoute, 
    private datepipe: DatePipe,
    private router: Router,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef) {
      this.usermodel = this.storageService.getItem('UserModel');
  

  }

  ngOnInit(): void {
    this.ReceivingDate = new Date();
    // this.dateFrom = abc + 'T' + Time;
    // this.ReceivingDate = result + 'T'
    // + Time;
    const a = this.route.snapshot.params.id;
    // tslint:disable-next-line: deprecation
    if (!isNullOrUndefined(a)) {
      this.GetShipmentTransfersDetailsById(a);
    }
  }
  cancelClick() {
    let callingRoute = this.storageService.getItem('STReceiveRoute');
    if (isNullOrUndefined(callingRoute) || callingRoute == '') {
      this.router.navigate(['/orders/shipping-transfer']);
    }
    else {
      this.router.navigate([callingRoute]);
    }

  }
  GetShipmentTransfersDetailsById(id: any) {
    const obj = {
      ID: id
    };
    this.IsSpinner = true;
    this.apiService.GetShipmentTransfersDetailsById(obj).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseCode === 0) {
        this.selectedshipping = response.ShipmentModel;
        this.ReceivingDate = new Date(this.datepipe.transform(this.ReceivingDate, 'MM-dd-yyyy') ?? "" + "Z"),

          this.ShipmentDetails = [...this.selectedshipping.ShipmentDetails];
        this.ShipmentDetails.forEach(element => {
          element.txtProductAddedToList = false;
          element.OldReceivedQuantity = element.ReceivedQuantity;
          this.totalQuantity += element.Quantity;
          element.ReceivedQuantity = element.ReceivedQuantity > 0 ? element.ReceivedQuantity : element.Quantity;
          this.NewReceivedQuantity += element.ReceivedQuantity > 0 ? element.ReceivedQuantity : element.Quantity;
        });
        
        this.ShipmentDocuments = this.selectedshipping.ShipmentDocuments;
        this.GetOutLetFromById(this.selectedshipping.OutletID);
        this.GetOutLetToById(this.selectedshipping.ToOutletID);
        this.showItems = this.ShipmentDetails;
      }
      this.cdr.detectChanges();
    });
  }
  GetOutLetFromById(OutletID: any) {
    const outLetFrom = {
      ID: OutletID
    };
    this.IsSpinner = true;
    this.apiService.GetOutLetById(outLetFrom).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseCode === 0) {
        this.FromOutLetData = response.OutletModel;
      }
      this.cdr.detectChanges();
    });

  }
  GetOutLetToById(ToOutletID: any) {
    const toOutLet = {
      ID: ToOutletID
    };
    this.IsSpinner = true;
    this.apiService.GetOutLetById(toOutLet).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseCode === 0) {
        this.ToOutLetData = response.OutletModel;
      }
      this.cdr.detectChanges();
    });
  }
  ngOnDestroy(): void {

  }
  viewDocuments() {
    this.IsDocumentDialog = true;
    this.btn_open_modal_documents.nativeElement.click();
  }
  OnChangeText(event: any, item: any) {
    let quantity = 0;
    let qty = 0;
    let oldQty = 0;
    let maxqty = 0;

    for (const item1 of this.ShipmentDetails) {
      qty = item1.ReceivedQuantity;
      oldQty = item1.OldReceivedQuantity;

      qty = Number(qty);
      oldQty = Number(oldQty);
      maxqty = item1.Quantity;
      maxqty = Number(maxqty);

      if (qty+oldQty > maxqty) {
        item1.ReceivedQuantity = maxqty-oldQty;
        qty = maxqty-oldQty;
      }
      quantity = quantity + qty;
    }
    this.NewReceivedQuantity = quantity;
  }
  selectValue(newValue: any) {
    window.open(`http://85.214.36.134:1947/Content/ShipmentDocuments/${newValue.sDocument}`, '_blank');
  }

  openProductTrackableDetailsDialog(item: any) {
    this.selectedProductVariantID = item.ProductVariantID;
    const selectedtrackables = this.trackables.filter(x => x.ProductVariantID === item.ProductVariantID);
    this.TrackableListForDisplay = selectedtrackables;
    this.displayTrackable = true;
  }
  RemoveTrackableFromProduct(item: any) {
    this.selectedProductVariantID = item.ProductVariantID;
    let removed = false;
    const i = this.trackables.findIndex(obj => obj.TrackableForShoppingID === item.TrackableForShoppingID);
    if (i != null) {
      this.trackables.splice(i, 1);
      removed = true;
      const currItem = this.ShipmentDetails.filter(x => x.ProductVariantID === item.ProductVariantID)[0];
      const curentQuantity = currItem.ReceivedQuantity;

      this.ShipmentDetails.filter(x => x.ProductVariantID === item.ProductVariantID)[0].ReceivedQuantity = curentQuantity - 1;
      this.OnChangeText(this.ShipmentDetails.filter(x => x.ProductVariantID === item.ProductVariantID)[0], true);

      this.openProductTrackableDetailsDialog(item);
      this.refreshSelectedProductTrackables(item.ProductVariantID);
      this.toastService.showInfoToast('info', 'Trackable code removed from selected product');
    } else {
      this.toastService.showInfoToast('info', 'No trackable code found to remove for this product');
    }
  }
  refreshSelectedProductTrackables(productVariantID: any) {

    const selectedRow = this.ShipmentDetails.filter(x => x.ProductVariantID === productVariantID)[0];
    const prodVariantID = selectedRow.ProductVariantID;
    const isAdded = selectedRow.txtProductAddedToList;
    let code;
    let indexno;
    if (isAdded === 'true') {
      const detailsIndex = this.details.findIndex(x => x.ProductVariantID === parseInt(prodVariantID, 10));
      const prodtrackables = this.details[detailsIndex].AllTrackableOutletAssignmentItemDetailList;
      this.productAlltrackables.forEach(item => {
        code = prodtrackables.filter((x: any) => x.TrackableForShoppingID === item.TrackableCode).shift();
        indexno = this.trackables.findIndex(x => x.TrackableForShoppingID === item.TrackableForShoppingID);
        if (indexno !== -1) {
          return;
        }
        // tslint:disable-next-line: deprecation
        if (isNullOrUndefined(code)) {
          const listItem = {
            Product: item.Product,
            TrackableCode: item.TrackableCode,
            TrackableForShoppingID: item.TrackableForShoppingID,
            StockHistoryID: item.StockHistoryID,
            OutletStockHistoryID: item.OutletStockHistoryID
          };
          this.AllTrackableListForDisplay.push(listItem);
        }
      });
    }
    else {
      // let code;
      // let indexno;
      this.productAlltrackables.forEach(item => {
        code = this.trackables.filter(x => x.TrackableForShoppingID === item.TrackableForShoppingID).shift();
        indexno = this.trackables.findIndex(x => x.TrackableForShoppingID === item.TrackableForShoppingID);
        if (indexno !== -1) {
          return;
        }
        // tslint:disable-next-line: deprecation
        if (isNullOrUndefined(code)) {
          const listItem = {
            Product: item.Product,
            TrackableCode: item.TrackableCode,
            TrackableForShoppingID: item.TrackableForShoppingID,
            StockHistoryID: item.StockHistoryID,
            OutletStockHistoryID: item.OutletStockHistoryID
          };
          this.AllTrackableListForDisplay.push(listItem);
        }
      });
    }
  }
  openTrackableDialog(item: any) {

    this.selectedProductVariantID = item.ProductVariantID;
    const selectedRow = this.ShipmentDetails.filter(x => x.ProductVariantID === item.ProductVariantID)[0];
    const varid = selectedRow.ProductVariantID;
    const isAdded = selectedRow.txtProductAddedToList;
    const prodid = selectedRow.ProductID;
    const outletID = this.selectedshipping.OutletID;
    const request =
    {
      PageNo: 0,
      PageSize: 10000000,
      OutletID: outletID,
      ProductID: prodid,
      ProductVariantID: varid,
    };
    this.apiService.GetTrackableStockForOutletTransfer(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.productAlltrackables = response.AllTrackbleStockDetailsItemList;
        if (this.productAlltrackables != null) {
          if (this.productAlltrackables.length !== 0) {
            this.refreshSelectedProductTrackables(item.ProductVariantID);
          }
          this.displayAllTrackable = true;
        }
      } else {
        this.toastService.showErrorToast('error', response.ResponseText);
      }
    });
  }
  onTrackableRowClick(item: any) {

    const selectedRow = this.ShipmentDetails.filter(x => x.ProductVariantID === this.selectedProductVariantID)[0];
    const maxcurentQuantity = selectedRow.Quantity;
    const curentQuantity = selectedRow.ReceivedQuantity;

    if (curentQuantity === maxcurentQuantity) {
      this.toastService.showInfoToast('info', 'Selected maximum shipped quantity');
      return;
    }

    const prodVariantID = selectedRow.ProductVariantID;
    const trackablecode = item.TrackableCode;
    const trackableShoppingID = item.TrackableForShoppingID;
    const stockHistoryID = item.StockHistoryID;
    const outletStockHistoryID = item.OutletStockHistoryID;
    const saleDetailTrackable = {
      TrackableForShoppingID: trackableShoppingID,
      TrackableCode: trackablecode,
      StockHistoryID: stockHistoryID,
      OutletStockHistoryID: outletStockHistoryID,
      ProductVariantID: parseInt(prodVariantID, 10)
    };

    const isAdded = selectedRow.txtProductAddedToList;

    if (isAdded === 'true') {
      const detailsIndex = this.details.findIndex(x => x.ProductVariantID === parseInt(prodVariantID, 10));
      const prodtrackables = this.details[detailsIndex].AllTrackableOutletAssignmentItemDetailList;
      prodtrackables.push(saleDetailTrackable);
    } else {
      this.trackables.push(saleDetailTrackable);
    }

    this.ShipmentDetails.filter(x => x.ProductVariantID === this.selectedProductVariantID)[0].ReceivedQuantity = curentQuantity + 1;
    this.OnChangeText(selectedRow, false);

    this.refreshSelectedProductTrackables(this.selectedProductVariantID);
    this.toastService.showInfoToast('info', 'Trackable code added to selected product');

  }
  Receive() {

    const detailArr = [];
    this.ShipmentDetails.forEach(element => {
      detailArr.push({
        ShipmentDetailID: element.ID,
        ProductVariantID: element.ProductVariantID,
        Quantity: element.ReceivedQuantity
      });
    });

    let detail: any;
    const saleDetails = new Array();
    const outletStockHistoryIDs = new Array();
    const stockHistoryIDs = new Array();
    let shipID: any;
    let variant: any;
    let quantity: any;
    let trackablesCodes: any;
    let trackableCodesStockHistoryIDBased;
    let outletStockHistoryIdIndex;
    let stockHistoryIdIndex;

    for (const item1 of this.ShipmentDetails) {

      variant = item1.ProductVariantID;
      shipID = item1.ID;
      quantity = item1.ReceivedQuantity;
      quantity = Number(quantity);

      if (this.trackables.length > 0) {
        trackablesCodes = this.trackables.filter(x => x.ProductVariantID === Number(variant) || x.ProductVariantID === '' + variant);
        if (trackablesCodes.length > 0) {

          trackablesCodes.forEach((item: any) => {
            if (item.OutletStockHistoryID != null) {
              outletStockHistoryIdIndex = outletStockHistoryIDs.findIndex(x => x === item.OutletStockHistoryID);
              if (outletStockHistoryIdIndex === -1) {
                outletStockHistoryIDs.push(item.OutletStockHistoryID);
              } else {
                return;
              }
              trackableCodesStockHistoryIDBased = trackablesCodes.filter((x: any) => x.OutletStockHistoryID === item.OutletStockHistoryID);
              if (trackableCodesStockHistoryIDBased.length > 0) {
                detail = {
                  ShipmentDetailID: shipID,
                  ProductVariantID: variant,
                  OutletStockHistoryID: item.OutletStockHistoryID,
                  StockHistoryID: item.StockHistoryID,
                  Quantity: trackableCodesStockHistoryIDBased.length,
                  AllTrackableOutletAssignmentItemDetailList: trackableCodesStockHistoryIDBased
                };
              }
            } else {
              stockHistoryIdIndex = stockHistoryIDs.findIndex(x => x === item.StockHistoryID);
              if (stockHistoryIdIndex === -1) {
                stockHistoryIDs.push(item.StockHistoryID);
              } else {
                return;
              }

              trackableCodesStockHistoryIDBased = trackablesCodes.filter((x: any) => x.StockHistoryID === item.StockHistoryID);
              if (trackableCodesStockHistoryIDBased.length > 0) {
                detail = {
                  ShipmentDetailID: shipID,
                  ProductVariantID: variant,
                  OutletStockHistoryID: 0,
                  StockHistoryID: item.StockHistoryID,
                  Quantity: trackableCodesStockHistoryIDBased.length,
                  AllTrackableOutletAssignmentItemDetailList: trackableCodesStockHistoryIDBased
                };
              }
            }
            saleDetails.push(detail);
          });
          continue;
        }
      }

      detail = {
        ShipmentDetailID: shipID,
        ProductVariantID: variant,
        Quantity: parseInt(quantity, 10),
        AllTrackableOutletAssignmentItemDetailList: trackablesCodes
      };
      saleDetails.push(detail);
    }

    let receivingDate = new Date(this.ReceivingDate).toJSON();
    receivingDate = receivingDate.split('T')[0];
    const obj = {
      RequestedUserID: this.usermodel.ID,
      OutletID: this.selectedshipping.OutletID,
      ToOutletID: this.selectedshipping.ToOutletID,
      ShipmentID: this.selectedshipping.ID,
      TrackingCode: this.selectedshipping.TrackingCode,
      ReceivingDate: receivingDate,
      ShipmentDeliveryItems: saleDetails
    };
    this.IsSpinner = true;
    this.apiService.AddShipmentDelivery(obj).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
      }
      else {
        this.toastService.showErrorToast('error', response.ResponseText);
      }
      this.cdr.detectChanges();
    });
  }

  searchData() {
    let searchResult = new SearchPipe().transform(this.ShipmentDetails, this.columns, this.searchKey);
    this.showItems = searchResult;
  }
}

