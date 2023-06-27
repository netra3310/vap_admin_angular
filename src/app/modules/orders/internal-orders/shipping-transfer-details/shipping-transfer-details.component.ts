import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { ShipmentDetailModel, ShipmentDocuments, ShipmentModel } from './../../../../Helper/models/ShipmentModel';
import { ActivatedRoute, Router } from '@angular/router';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/shared/services/storage.service';
import { isNullOrUndefined } from 'src/app/Helper/global-functions';


@Component({
  selector: 'app-shipping-transfer-details',
  templateUrl: './shipping-transfer-details.component.html',
  styleUrls: ['./shipping-transfer-details.component.scss']
})

export class ShippingTransferDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('btn_open_modal_documents') btn_open_modal_documents:ElementRef;
  IsSpinner = false;
  loading: boolean;
  first = 0;
  rows = 25;
  totalRecords = 0;

  columns: Columns[] = [
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' },
    { field: 'BLabel', header: 'Model No', sorting: 'BLabel', placeholder: '' },
    { field: 'CurrencyID', header: 'Currency Used', sorting: 'CurrencyID', placeholder: '' },
    { field: 'Price', header: 'Price', sorting: 'Price', placeholder: '', type:TableColumnEnum.CURRENCY_SYMBOL },
    { field: 'Quantity', header: 'Shipped Quantity', sorting: 'Quantity', placeholder: '' },
    { field: 'ReceivedQuantity', header: 'Received Quantity', sorting: 'ReceivedQuantity', placeholder: '' },
  ];
  documentsColumns: Columns[] = [
    { field: 'sDocument', header: 'File Name', sorting: 'sDocument', placeholder: '' },
  ];

  globalFilterFields = ['Product', 'CurrencyID', 'Price', 'Quantity', 'ReceivedQuantity'];
  documentGlobalFilterFields = ['sDocument'];
  rowsPerPageOptions = [10, 20, 50, 100];

  selectedshipping: any = {};
  ShipmentDetails: any[] = [];
  ToOutLetData: any = {};
  FromOutLetData: any = {};
  currencyList: any;
  ShipmentDocuments: [ShipmentDocuments];
  IsDocumentDialog = false;
  totalData = {
    totalQuantity: 0,
    totalRMB: 0,
    totalDollar: 0,
    totalEuro: 0
  };
  usermodel: any;

  constructor(
    private apiService: vaplongapi, 
    private route: ActivatedRoute, 
    private router: Router,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Details of a Shipment`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });

  }
  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    const a = this.route.snapshot.params.id;
    
    // tslint:disable-next-line: deprecation
    if (!isNullOrUndefined(a)) {
      this.GetShipmentTransfersDetailsById(a);
    }
    this.GetAllExchangeRate();
  }
  GetAllExchangeRate() {
    this.apiService.GetAllExchangeRate().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.message === 'success') {
        this.currencyList = response.AllExchangeRateList;
      }
    });

  }
  cancelClick() {
    let callingRoute = this.storageService.getItem('STDetailRoute');
    if (isNullOrUndefined(callingRoute) || callingRoute == '') {
      this.router.navigate(['/orders/shipping-transfer']);
    }
    else {
      this.router.navigate([callingRoute]);
    }

  }
  GetShipmentTransfersDetailsById(id: any) {
    this.IsSpinner = true;
    const obj = {
      ID: id
    };
    this.apiService.GetShipmentTransfersDetailsById(obj).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseCode === 0) {
        this.selectedshipping = response.ShipmentModel;
        this.ShipmentDetails = [...this.selectedshipping.ShipmentDetails];
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
        this.ShipmentDocuments = this.selectedshipping.ShipmentDocuments;
        this.GetOutLetFromById(this.selectedshipping.OutletID);
        this.GetOutLetToById(this.selectedshipping.ToOutletID)
      }
      this.cdr.detectChanges();
    });
    // this.PurchaseOrder.PoNo = id;
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

  viewDocuments() {
    this.IsDocumentDialog = true;
    this.btn_open_modal_documents.nativeElement.click();
  }
  selectValue(newValue: any) {
    window.open(`${environment.SHIPMENT_PATH}${newValue.sDocument}`, 'blank');

  }

}

