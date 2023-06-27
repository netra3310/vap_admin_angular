import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ConfirmationService } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { SalesPermissionEnum } from 'src/app/shared/constant/sales-permission';
// 
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { ToastService } from '../../shell/services/toast.service';
// import { ToastService } from '../../shell/services/toast.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: 'app-performainvoice-detail',
  templateUrl: './performainvoice-detail.component.html',
  styleUrls: ['./performainvoice-detail.component.scss']
})
export class PerformaInvoiceDetailComponent implements OnInit, OnDestroy {
  
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

  loadingData : boolean = true;
  trackableProduct : any;

  imgSrc: any;
  imageBasePath: any;
  @ViewChild('btn_open_multi_img_modal') btn_open_multi_img_modal: ElementRef;
  
  constructor(
    private apiService: vaplongapi, 
    // private toastService: ToastService,
    private toastService : ToastService,
    private cdr : ChangeDetectorRef,
    private router: Router, public route: ActivatedRoute) { 
      this.imageBasePath = this.apiService.imageBasePath;
    }
  ngOnDestroy(): void {

  }
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.PrintingInvoiceFuntion(id);
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
  PrintingInvoiceFuntion(id : any) {
    const req = { ID: id };
    this.loadingData = true;
    this.apiService.GetPerformaSalesByID(req).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.loadingData = false;
      if (response.ResponseCode === 0) {

        this.SaleDetails = response.PerfomaSale;
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
        this.SaleDetails.newSaleDetails = [...this.SaleDetails.PerfomaSaleDetails];
        this.SaleDetails.PerfomaSaleDetails.forEach((item : any) => {
          subtotal = subtotal + item.dTotalValue;
          totalDiscount = totalDiscount + item.dTotalDiscount;
          item.display = false;
        });
        grandTotal = subtotal - totalDiscount + shipment;
        const dTotalPaidValue = this.SaleDetails.dTotalPaidValue ? this.SaleDetails.dTotalPaidValue : 0;
        const restAmount = grandTotal - dTotalPaidValue;
        this.SaleDetails.dDiscountValue = totalDiscount;
        this.SaleDetails.subTotal = subtotal;
        this.SaleDetails.totalDiscount = totalDiscount;
        this.SaleDetails.shipment = shipment;
        this.SaleDetails.grandTotal = grandTotal;
        this.SaleDetails.restAmount = restAmount;
        // response1.PackingSlip.PackingSlipDetails = saleDetails;
        // this.Print();
      }
      else {
        // this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.message);
        this.toastService.showErrorToast('Error', response.message);
      }
    });
  }
  sale() {
    this.router.navigate([`/sale/add-receipt-new/${this.route.snapshot.params['id']}`]);
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
        } else {
          this.DeliverToDetails.Number = response.CustomerModel.PhoneNo;
          this.DeliverToDetails.Address = response.CustomerModel.Address;
          this.SaleDetails.DeliveredToCompanyName = response.CustomerModel.PhoneNo;
          this.SaleDetails.DeliveryAddress = response.CustomerModel.Address;

        }

        this.cdr.detectChanges();
      }
    });
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
