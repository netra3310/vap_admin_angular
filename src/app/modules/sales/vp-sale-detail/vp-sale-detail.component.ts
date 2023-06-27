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
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';


@Component({
  selector: 'app-vp-sale-detail',
  templateUrl: './vp-sale-detail.component.html',
  styleUrls: ['./vp-sale-detail.component.scss']
})
export class VpSaleDetailComponent implements OnInit, OnDestroy {
  
  modalTrackableConfig: ModalConfig = {
    modalTitle: 'Trackable Codes',
    modalContent: "",
    modalSize: 'xl',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };
  @ViewChild('modalTrackable') private modalTrackableComponent: ModalComponent;

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
  trackableProduct : any;
  
  imgSrc: any;
  imageBasePath: any;
  @ViewChild('btn_open_multi_img_modal') btn_open_multi_img_modal: ElementRef;
  
  constructor(
    private apiService: vaplongapi,
    private storageService: StorageService, 
    public route: Router,
    // private toastService: ToastService, 
    private toastService : ToastService,
    private cdr : ChangeDetectorRef,
    public router: ActivatedRoute)
  {
    this.imageBasePath = this.apiService.imageBasePath;
    this.usermodel = this.storageService.getItem('UserModel');

    const obj = {
      Action: 'View',
      Description: `View Details of VP Orders`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { }); 
  }
  Close() {
    let callingRoute = this.storageService.getItem('VPSaleDetailRoute');
    if ((callingRoute === null || callingRoute === undefined) || callingRoute == '') {
      this.route.navigate(['/reports/vp-orders']);
    }
    else {
      this.route.navigate([callingRoute]);
    }
  }
  ngOnDestroy(): void {

  }
  ngOnInit() {
    const id = this.router.snapshot.params['id'];
    this.PrintingInvoiceFuntion(id);
  }
  PrintingInvoiceFuntion(id : any) {
    const req = { ID: id };
    this.loadingData = true;
    this.apiService.getSaleById(req).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      this.loadingData = false;
      if (response1.ResponseCode === 0) {
        this.SaleDetails = response1.Sale;
        const saleDetails = [];
        this.SaleDetails.OrderByName = this.SaleDetails.Customer;
        this.customerDetail(this.SaleDetails.CustomerID, true);
        this.customerDetail(this.SaleDetails.DeliveredToID, false);
        // this.SaleDetails.txtSubTotal = response1.Sale.SaleDetails.reduce((sum, current) => sum + current.dTotalValue, 0)
        // this.SaleDetails.txtTotalDiscount = response1.Sale.SaleDetails.reduce((sum, current) => sum + current.dTotalDiscount, 0)
        // this.SaleDetails.txtTotal = (this.SaleDetails.txtSubTotal - this.SaleDetails.txtTotalDiscount +
        // response1.Sale.ShippingCost).toFixed();
        let subtotal = 0;
        let totalDiscount = 0;
        let grandTotal = 0;
        this.SaleDetails.DeliveredToName = this.SaleDetails.DeliveredTo;
        this.SaleDetails.DeliveryAddress = this.SaleDetails.DeliveryAddress;
        this.DeliverToDetails.Address = this.SaleDetails.DeliveryAddress;
        const shipment = this.SaleDetails.ShippingCost;
        this.SaleDetails.newSaleDetails = [...this.SaleDetails.SaleDetails];
        this.SaleDetails.SaleDetails.forEach((item : any) => {
          subtotal = subtotal + item.dTotalValue;
          totalDiscount = totalDiscount + item.dTotalDiscount;
          item.display = false;
        });
        grandTotal = subtotal - totalDiscount + shipment;
        const restAmount = grandTotal - this.SaleDetails.dTotalPaidValue;
        this.SaleDetails.dDiscountValue = totalDiscount;
        this.SaleDetails.subTotal = subtotal;
        this.SaleDetails.totalDiscount = totalDiscount;
        this.SaleDetails.shipment = shipment;
        this.SaleDetails.grandTotal = grandTotal;
        this.SaleDetails.restAmount = restAmount;
        // response1.PackingSlip.PackingSlipDetails = saleDetails;
        // this.Print();
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

      printContents = document.getElementById('printA4-sale-preview-1')?.innerHTML ?? "";
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
                "width: 67%;color: #000; float: left;text-align: left; margin: 0;font-size: 12px; font-weight: 600;padding-right: 10px;
              }
              </style>
            </head>
            <body onload="window.print();self.close();">${printContents}</body>
          </html>`);
        popupWin.document.close();
      }
    }, 500);
  }

  async openModalTrackable() {
    return await this.modalTrackableComponent.open();
  }

  onTrackable(product : any) {
    this.trackableProduct = product;
    this.openModalTrackable();
  }
    
  openImageGellary(imagePath: any) {
    this.imgSrc = imagePath;
    this.btn_open_multi_img_modal.nativeElement.click();
  }


}
