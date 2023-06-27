import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { SalesPermissionEnum } from 'src/app/shared/constant/sales-permission';
// 
import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
// 
// import { ToastService } from '../../shell/services/toast.service';
import { ToastService } from '../../shell/services/toast.service';

@Component({
  selector: 'app-refundsale-detail',
  templateUrl: './refundsale-detail.component.html',
  styleUrls: ['./refundsale-detail.component.scss']
})
export class RefundSaleDetailComponent implements OnInit, OnDestroy {
  SalePermission = SalesPermissionEnum;
  SaleDetails: any;
  customerDetails = {
    Number: '',
    Address: '',
    CurrentBalance: ''
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
    // private toastService: ToastService,
    private toastService : ToastService,
    public route: Router,
    public router: ActivatedRoute, 
    private storageService: StorageService,
    private cdr : ChangeDetectorRef
    )
  {
    this.imageBasePath = this.apiService.imageBasePath;
    this.usermodel = this.storageService.getItem('UserModel');

      const obj = {
        Action: 'View',
        Description: `View Details of Refunded Sale`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { }); 
   }
   Close() {
    let callingRoute = this.storageService.getItem('ReturnSaleDetailRoute');
    if ((callingRoute === null || callingRoute === undefined) || callingRoute == '') {
      this.route.navigate(['/sale/salerefundreport-index']);
    }
    else {
      this.route.navigate([callingRoute]);
    }
  }
  ngOnDestroy(): void {

  }
  ngOnInit() {
    const id = this.router.snapshot.params['id'];
    this.PrintingReturnSaleFuntion(id);
  }
  PrintingReturnSaleFuntion(id : any) {
    const req = { ID: id };
    this.loadingData = true;
    this.apiService.GetReturnSaleByID(req).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      this.loadingData = false;
      if (response1.ResponseCode === 0) {
        this.SaleDetails = response1.ReturnSale;
        const saleDetails = [];
        this.customerDetail(this.SaleDetails.CustomerID, true);
        this.SaleDetails.OrderByName = this.SaleDetails.Customer;
        this.SaleDetails.txtSubTotal = response1.ReturnSale.ReturnSaleDetails.reduce((sum : any, current : any) => sum + current.dTotalValue, 0);
        this.SaleDetails.txtTotalDiscount = response1.ReturnSale.ReturnSaleDetails.reduce((sum : any, current : any) =>
          sum + current.dTotalDiscount, 0);
        this.SaleDetails.txtTotal = (this.SaleDetails.txtSubTotal - this.SaleDetails.txtTotalDiscount).toFixed();
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
          this.SaleDetails.InvoiceAddress = response.CustomerModel.Address;
          this.cdr.detectChanges();
        } else {
          this.DeliverToDetails.Number = response.CustomerModel.PhoneNo;
          // this.DeliverToDetails.Address = response.CustomerModel.Address;
          this.SaleDetails.DeliveredToCompanyName = response.CustomerModel.PhoneNo;
        }
      }
    });
  }

  Print() {
    setTimeout(() => {


      let printContents;
      let popupWin;

      printContents = document.getElementById('printA4-sale-refund')?.innerHTML ?? "";
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
