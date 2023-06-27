import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ConfirmationService } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';

import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
// 
// import { ToastService } from '../../shell/services/toast.service';
import { SalesPermissionEnum } from 'src/app/shared/constant/sales-permission';
import { ToastService } from '../../shell/services/toast.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.scss']
})
export class SaleDetailComponent implements OnInit, OnDestroy {

  modalTrackableConfig: ModalConfig = {
    modalTitle: 'Trackable Codes',
    modalContent: "",
    modalSize: 'xl',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };
  @ViewChild('modalTrackable') private modalTrackableComponent: ModalComponent;

  trackableProduct : any;
  SalePermission = SalesPermissionEnum;
  printingData: any;
  SaleDetails: any;
  TotalQuantity=0
  customerDetails = {
    Number: '',
    Address: '',
    CurrentBalance: ''
  };
  DeliverToDetails = {
    Number: '',
    Address: ''
  };
  IsPrinted= false;
  IsNotPermitted = false;
  id=0;
  usermodel: any;

  loadingData : boolean = true;

  imgSrc: any;
  imageBasePath: any;
  @ViewChild('btn_open_multi_img_modal') btn_open_multi_img_modal: ElementRef;
  
  constructor(
    private apiService: vaplongapi, 
    private toastService : ToastService, 
    public route: Router,
    public router: ActivatedRoute, private storageService: StorageService,
    private cdr : ChangeDetectorRef)
  {
    this.imageBasePath = this.apiService.imageBasePath;
    this.usermodel = this.storageService.getItem('UserModel');
    let callingRoute = this.storageService.getItem('SaleDetailRoute');
      if(callingRoute=="/orders/manage-incoming-order")
      {
        this.IsNotPermitted=true;
      }
      const obj = {
        Action: 'View',
        Description: `View Sale Details`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { });
  }
  ngOnDestroy(): void {

  }
  ngOnInit() {
    this.id = this.router.snapshot.params['id'];
    this.PrintingInvoiceFuntion(this.id);
    this.PrintingPackingSlipFuntion(this.id);
  }
  Close() {
    let callingRoute = this.storageService.getItem('SaleDetailRoute');
    if ((callingRoute === null || callingRoute === undefined) || callingRoute == '') {
      this.route.navigate(['/sale/sale-index']);
    }
    else {
      console.log(callingRoute);
      this.route.navigate([callingRoute]);
    }
  }
  PrintingInvoiceFuntion(id : any) {
    const req = { ID: id };
    this.loadingData = true;
    this.apiService.getSaleById(req).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      this.loadingData = false;
      if (response1.ResponseCode === 0) {
        this.SaleDetails = response1.Sale;
        const saleDetails = [];
        this.IsPrinted = this.SaleDetails.IsPrinted;
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
        
        this.SaleDetails.InvoiceAddress = this.SaleDetails.InvoiceAddress?.split("  ").join(" ").toLowerCase();
        let countryName = this.SaleDetails.InvoiceAddress?.split(",")[1];
        let fullAddress = this.SaleDetails.InvoiceAddress?.split(",")[0].replace(countryName, "");
        this.SaleDetails.InvoiceAddress = fullAddress.trim()+","+countryName;

        this.SaleDetails.DeliveryAddress = this.SaleDetails.DeliveryAddress?.split("  ").join(" ").toLowerCase();
        let countryName1 = this.SaleDetails.DeliveryAddress?.split(",")[1];
        let fullAddress1 = this.SaleDetails.DeliveryAddress?.split(",")[0].replace(countryName1, "");
        this.SaleDetails.DeliveryAddress = fullAddress1.trim()+","+countryName1;



        // this.DeliverToDetails.Address = this.SaleDetails.DeliveryAddress;
        const shipment = Number(this.SaleDetails.ShippingCost);
        this.SaleDetails.SaleDetails.forEach((item : any) => {
          let location ='';
          item.SaleDetailNonTrackableLocations.forEach((element : any) => {
            location += element.Location +' '+element.Quantity+' Qty, ';
          });
          item.Location = location;
          subtotal = subtotal + Number(item.dTotalValue);
          totalDiscount = totalDiscount + Number(item.dTotalDiscount);
          item.display = false;
        });
        this.SaleDetails.newSaleDetails = [...this.SaleDetails.SaleDetails];
        grandTotal = subtotal - totalDiscount + shipment;
        const restAmount = grandTotal - Number(this.SaleDetails.dTotalPaidValue);
        this.SaleDetails.dDiscountValue = totalDiscount.toFixed(2);
        this.SaleDetails.subTotal = subtotal.toFixed(2);
        this.SaleDetails.totalDiscount = totalDiscount.toFixed(2);
        this.SaleDetails.shipment = shipment.toFixed(2);
        this.SaleDetails.grandTotal = grandTotal.toFixed(2);
        this.SaleDetails.restAmount = restAmount.toFixed(2);
        this.TotalQuantity = this.SaleDetails.newSaleDetails.reduce((accumulator : any, value : any) => { return accumulator + value.Quantity; }, 0); 

        this.sortOn(this.SaleDetails.newSaleDetails,'Location');
        // response1.PackingSlip.PackingSlipDetails = saleDetails;
        // this.Print();

      }
      else {
        this.toastService.showErrorToast('Error', response1.message);
      }
    });
  }

  customerDetail(customerId : any, isCustomer: boolean = true) {
    const req = {
      ID: customerId,
    };
    this.loadingData = true;
    this.apiService.GetCustomerbyID(req).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.loadingData = false;
      if (response.ResponseCode === 0) {
        if (isCustomer) {
          this.customerDetails.Number = response.CustomerModel.PhoneNo;
          this.customerDetails.Address = response.CustomerModel.Address;
          this.customerDetails.CurrentBalance = response.CustomerModel.CurrentBalance;
          this.SaleDetails.OrderByCompany = response.CustomerModel.PhoneNo;
          //this.SaleDetails.InvoiceAddress = response.CustomerModel.Address;
        } else {
          this.DeliverToDetails.Number = response.CustomerModel.PhoneNo;
          this.DeliverToDetails.Address = response.CustomerModel.Address;
          this.SaleDetails.DeliveredToCompanyName = response.CustomerModel.PhoneNo;
        }

        this.cdr.detectChanges();
      }
    });
  }
  Print() {
    const request = {
      ID: this.id,
      Status:true,
      UpdatedByUserID:1,
    };
    this.apiService.UpdatePrintingStatus(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
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
    });
   
  }

  PrintingPackingSlipFuntion(id :any) {
    
    const req = { ID: id };
    this.apiService.GetPackingSlipByID(req).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        response1.PackingSlip.InvoiceAddress = response1.PackingSlip.InvoiceAddress?.split("  ").join(" ").toLowerCase();
        response1.PackingSlip.ShippingAddress = response1.PackingSlip.ShippingAddress?.split("  ").join(" ").toLowerCase();

        let countryName = response1.PackingSlip.InvoiceAddress?.split(",")[1];
        let fullAddress = response1.PackingSlip.InvoiceAddress?.split(",")[0].replace(countryName, "");
        response1.PackingSlip.InvoiceAddress = fullAddress.trim()+","+countryName;

        let countryName1 = response1.PackingSlip.ShippingAddress?.split(",")[1];
        let fullAddress1 = response1.PackingSlip.ShippingAddress?.split(",")[0].replace(countryName1, "");
        response1.PackingSlip.ShippingAddress = fullAddress1.trim()+","+countryName1;
        
        this.IsPrinted = response1.PackingSlip.IsPrinted;
        const saleDetails : any = [];
        response1.PackingSlip.PackingSlipDetails.forEach((item : any) => {
          const locs = item.Location.split(',');
          if (locs > 1) {
            let i = 0;
            locs.forEach((item1 : any) => {
              if (i === 0) {
                const row = {
                  ProductVariantID: item.ProductVariantID,
                  ArticalNumber: item.ArticalNumber,
                  ProductQRCode:item.ProductQRCode,
                  BLabel : item.BLabel,
                  ProductName: item.ProductName,
                  Location: item1.trim(),
                  Quantity: item.Quantity,
                  dTotalDiscount: item.dTotalDiscount,
                  dTotalUnitValue: item.dTotalUnitValue,
                  dTotalValue: (item.dTotalValue - item.dTotalDiscount).toFixed(2)
                };
                saleDetails.push(row);
              }
              else {
                const row1 = {
                  ProductVariantID: '-',
                  ArticalNumber: '-',
                  ProductQRCode: '-',
                  BLabel : '-',
                  ProductName: '-',
                  Location: item1.trim(),
                  Quantity: '-',
                  dTotalDiscount: '-',
                  dTotalUnitValue: '-',
                  dTotalValue: '-',
                };
                saleDetails.push(row1);
              }
              i++;
            });
          }
          else {

            const row2 = {
              ProductVariantID: item.ProductVariantID,
              ArticalNumber: item.ArticalNumber,
              ProductQRCode:item.ProductQRCode,
              ProductName: item.ProductName,
              BLabel : item.BLabel,
              Location: item.Location.trim(),
              Quantity: item.Quantity,
              dTotalDiscount: item.dTotalDiscount,
              dTotalUnitValue: item.dTotalUnitValue,
              dTotalValue: (item.dTotalValue - item.dTotalDiscount).toFixed(2)
            };
            saleDetails.push(row2);
          }
        });

        this.sortOn(saleDetails,'Location');
        response1.PackingSlip.PackingSlipDetails = saleDetails;   
        this.TotalQuantity = response1.PackingSlip.PackingSlipDetails.reduce((accumulator : any, value : any) => { return accumulator + value.Quantity; }, 0); 

        this.printingData = response1.PackingSlip;
        this.cdr.detectChanges();
      }
      else {
        this.toastService.showErrorToast('Error', response1.message);
      }
    });
  }

  Print1() {
    const request = {
      ID: this.id,
      Status:true,
      UpdatedByUserID:1,
    };
    this.apiService.UpdatePrintingStatus(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        setTimeout(() => {
          let printContents;
          let popupWin;
    
          printContents = document.getElementById('printA4-sale-packing-1')?.innerHTML ?? "";
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
    });
   
  }
  sortOn (arr : any, prop : any) {
    arr.sort (
        function (a : any, b : any) {
            if (a[prop] < b[prop]){
                return -1;
            } else if (a[prop] > b[prop]){
                return 1;
            } else {
                return 0;   
            }
        }
    );
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
