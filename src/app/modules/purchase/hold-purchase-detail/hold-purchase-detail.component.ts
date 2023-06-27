import { Component, ElementRef, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import * as html2canvas from 'html2canvas';
// import { ToastService } from '../../shell/services/toast.service';
import { ToastService } from '../../shell/services/toast.service';

import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { StorageService } from 'src/app/shared/services/storage.service';
@Component({
  selector: 'app-hold-purchase-detail',
  templateUrl: './hold-purchase-detail.component.html',
  styleUrls: ['./hold-purchase-detail.component.scss']
})
export class HoldPurchaseDetailComponent implements OnInit, OnDestroy {
  date = new Date();
  products: any[] = [
    { Product: 'a', Quantity: 3, Price: 1, isRefund: false }
  ];
  purchaseDetail: any = {};
  @ViewChild('screen') screen: ElementRef;
  usermodel: any;
  loadingData : boolean = true;

  imgSrc: any;
  imageBasePath: any;
  @ViewChild('btn_open_multi_img_modal') btn_open_multi_img_modal: ElementRef;
  
  // api/Purchase/GetByPurchaseID
  constructor(private api: vaplongapi,private storageService: StorageService, 
    private activatedRoute: ActivatedRoute, 
    private toastService : ToastService,
    private cdr : ChangeDetectorRef) {

      this.imageBasePath = this.api.imageBasePath;
    this.usermodel = this.storageService.getItem('UserModel');

    const obj = {
      Action: 'View',
      Description: `View Details of Pre Order`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.api.SaveActivityLog(obj).toPromise().then((x: any) => { });
   }

  ngOnDestroy(): void {

  }
  
  ngOnInit() {
    this.loadingData = true;
    const snapshot = this.activatedRoute.snapshot;
    const Param = { ID: snapshot.params.id };
    this.api.GetOpenPurchaseById(Param).pipe(untilDestroyed(this)).subscribe((x: any) => {
      this.loadingData = false;
      if (x.ResponseCode === 0) {
        this.purchaseDetail = x.AllOpenPurchaseList[0];
        let productSubtotal = 0;
        let productSubtotalFC = 0;
        let subtotal = 0;
        let totalDiscount = 0;
        let grandTotal = 0;
        let discPerc = 0;
        let btntrackable;

        x.AllOpenPurchaseList[0].OpenPurchasesDetails.forEach((item : any) => {
          productSubtotal = (item.dTotalAmount + item.dTotalDiscount).toFixed(2);
          productSubtotalFC = item.dTotalAmountFC + item.dTotalDiscountFC;
          item.ProductUnitPrice = productSubtotal / item.Quantity;
          productSubtotalFC = productSubtotalFC / item.Quantity;
          discPerc = (item.dTotalDiscount * 100) / (productSubtotal);

          subtotal = subtotal + Number(productSubtotal);
          totalDiscount = totalDiscount + item.dTotalDiscount;
          grandTotal = grandTotal + item.dTotalAmount;
          item.discPerc = ((item.dTotalDiscount * 100) / (productSubtotal)).toFixed(2);
        });
        this.purchaseDetail.subTotal = subtotal.toFixed(2);
        this.purchaseDetail.totalDiscount = totalDiscount.toFixed(2);
        this.purchaseDetail.grandTotal = grandTotal.toFixed(2);
        const Params = { ID: this.purchaseDetail.SupplierID };
        this.loadingData = true;
        this.cdr.detectChanges();
        this.api.GetSupplierByID(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
          this.loadingData = false;
          if (response.ResponseCode === 0) {
            response.SupplierModel.FirstName = response.SupplierModel.FirstName != null ? response.SupplierModel.FirstName : '';
            response.SupplierModel.LastName = response.SupplierModel.LastName != null ? response.SupplierModel.LastName : '';
            response.SupplierModel.FullName = response.SupplierModel.FirstName + ' ' + response.SupplierModel.LastName;
            this.purchaseDetail.supplierDetail = response.SupplierModel;
            this.cdr.detectChanges();

          }
          else {
            this.toastService.showErrorToast('Error', "Internal Server Error");
            this.toastService.showErrorToast('Error', 'Internal Server Error');
          }

        }
        );
      }

    });
  }
  Print() {
    //  html2canvas(this.screen.nativeElement).then(canvas => {

    //    const canv = canvas.toDataURL();
    //    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    //    popupWin.document.open();
    //    popupWin.document.write(`
    //  <html>
    //      <head>
    //          <title>Purchase Report</title>
    //      </head>
    //      <body onload="window.print(); window.close()">
    //      <img src="${canv}" />
    //      </body>
    //  </html>
    //  `
    //    );
    //    popupWin.document.close();
    //  });
  }
  Print1() {
    //  html2canvas(this.screen.nativeElement).then(canvas => {

    //    const canv = canvas.toDataURL();
    //    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    //    popupWin.document.open();
    //    popupWin.document.write(`
    //  <html>
    //      <head>
    //          <title>Purchase Report</title>
    //      </head>
    //      <body onload="window.print(); window.close()">
    //      <img src="${canv}" />
    //      </body>
    //  </html>
    //  `
    //    );
    //    popupWin.document.close();
    //  });
  }
  
  openImageGellary(imagePath: any) {
    this.imgSrc = imagePath;
    this.btn_open_multi_img_modal.nativeElement.click();
  }

}
