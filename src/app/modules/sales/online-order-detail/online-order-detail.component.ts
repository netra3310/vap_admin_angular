import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ConfirmationService } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
// 
import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
// 
// import { ToastService } from '../../shell/services/toast.service';
import { ToastService } from '../../shell/services/toast.service';
import { ConfirmationService } from 'src/app/Service/confirmation.service';

@Component({
  selector: 'app-online-order-detail',
  templateUrl: './online-order-detail.component.html',
  styleUrls: ['./online-order-detail.component.scss']
})
export class OnlineOrderDetailComponent implements OnInit, OnDestroy {

  SaleDetails: any;
  customerDetails = {
    Number: '',
    Address: '',
    CurrentBalance: '',
    DeliveredToCompanyName : ''
  };
  DeliverToDetails = {
    Number: '',
    Address: ''
  };
  usermodel: any;
  loadingData : boolean = true;
  
  imgSrc: any;
  imageBasePath: any;
  @ViewChild('btn_open_multi_img_modal') btn_open_multi_img_modal: ElementRef;
  
  constructor(
    private apiService: vaplongapi, 
    private storageService: StorageService,
    // private toastService: ToastService,
    private toastService : ToastService,
    private cdr : ChangeDetectorRef,
    public route: Router,
    public router: ActivatedRoute) {
      this.imageBasePath = this.apiService.imageBasePath;
      this.usermodel = this.storageService.getItem('UserModel');

      const obj = {
        Action: 'View',
        Description: `View Details of Online Order`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { }); 
     }

  ngOnDestroy(): void {

  }
  ngOnInit() {
    const id = this.router.snapshot.params['id'];
    this.PrintingInvoiceFuntion(id);
  }
  Close() {
    let callingRoute = this.storageService.getItem('OnlineSaleDetailRoute');
    if ((callingRoute === null || callingRoute === undefined) || callingRoute == '') {
      this.route.navigate(['/reports/online-orders']);
    }
    else {
      this.route.navigate([callingRoute]);
    }
  }
  PrintingInvoiceFuntion(id : any) {
    const req = { ID: id };
    this.loadingData = true;
    this.apiService.GetOnlineOrderPackingSlipByID(req).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      this.loadingData = false;
      if (response1.ResponseCode === 0) {
        
        this.SaleDetails = response1.PackingSlip;
        
        const saleDetails = [];
        this.SaleDetails.OrderByName = this.SaleDetails.CustomerName;
        this.customerDetail(this.SaleDetails.CustomerID, true);
        //this.customerDetail(this.SaleDetails.DeliveredToID, false);

        let subtotal = 0;
        let totalDiscount = 0;
        let grandTotal = 0;
        this.SaleDetails.DeliveredToName = this.SaleDetails.DeliveredToName;
        this.SaleDetails.DeliveryAddress = this.SaleDetails.ShippingAddress;
        this.SaleDetails.InvoiceAddress = this.SaleDetails.InvoiceAddress;
        
        const shipment = this.SaleDetails.ShippingCost;
        this.SaleDetails.newSaleDetails = [...this.SaleDetails.PackingSlipDetails];
        this.SaleDetails.PackingSlipDetails.forEach((item : any) => {
          subtotal = subtotal + (item.dTotalValue-item.dTotalTaxValue);
          //totalDiscount = totalDiscount + item.dTotalDiscount;
          item.display = false;
        });
        grandTotal = subtotal - this.SaleDetails.dTotalDiscountValue  + shipment + this.SaleDetails.dTotalTaxValue ;
        const restAmount = grandTotal - this.SaleDetails.dTotalPaidValue;
        //this.SaleDetails.dDiscountValue = totalDiscount;
        this.SaleDetails.subTotal = subtotal;
        //this.SaleDetails.totalDiscount = totalDiscount;
        this.SaleDetails.shipment = shipment;
        this.SaleDetails.grandTotal = grandTotal;
        //this.SaleDetails.restAmount = restAmount;
        this.cdr.detectChanges();
      }
      else {
        // this.notificationService.notify(NotificationEnum.ERROR, 'Error', response1.message);
        this.toastService.showErrorToast('Error', response1.message);
      }
    });
  }

  customerDetail(customerId : any, isCustomer: boolean = true) {
    const id = {
      ID: customerId,
    };
    this.loadingData = true;
    this.apiService.GetCustomerbyID(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.loadingData = false;
      if (response.ResponseCode === 0) {
        if (isCustomer) {
          this.customerDetails.Number = response.CustomerModel.PhoneNo;
          this.customerDetails.Address = response.CustomerModel.Address;
          this.customerDetails.CurrentBalance = response.CustomerModel.CurrentBalance;
          this.SaleDetails.OrderByCompany = response.CustomerModel.PhoneNo;
        } else {
          this.DeliverToDetails.Number = response.CustomerModel.PhoneNo;
          this.SaleDetails.DeliveredToCompanyName = response.CustomerModel.PhoneNo;
        }
        this.cdr.detectChanges();
      }
    });
  }
  Print() {
    setTimeout(() => {


      let printContents;
      let popupWin;

      printContents = document.getElementById('printA4-online-order-preview')?.innerHTML ?? "";
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      if(popupWin) {
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

  openImageGellary(imagePath: any) {
    this.imgSrc = imagePath;
    this.btn_open_multi_img_modal.nativeElement.click();
  }

}
