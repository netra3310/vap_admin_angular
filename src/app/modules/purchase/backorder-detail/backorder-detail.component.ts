import { Component, ElementRef, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import * as html2canvas from 'html2canvas';
import { ToastService } from '../../shell/services/toast.service';

import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { StorageService } from 'src/app/shared/services/storage.service';
@Component({
  selector: 'app-backorder-detail',
  templateUrl: './backorder-detail.component.html',
  styleUrls: ['./backorder-detail.component.scss']
})
export class BackOrderDetailComponent implements OnInit, OnDestroy {
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
    private cdr : ChangeDetectorRef,
    private toastService : ToastService
    )
  {
    this.imageBasePath = this.api.imageBasePath;
    this.usermodel = this.storageService.getItem('UserModel');

    const obj = {
      Action: 'View',
      Description: `View Back Order Details`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
    }
    this.loadingData = true;
    this.api.SaveActivityLog(obj).toPromise().then((x: any) => { this.loadingData = false; });
  }

  ngOnDestroy(): void {

  }
  ngOnInit() {
    const snapshot = this.activatedRoute.snapshot;
    const id = {
      ID: snapshot.params.id
    };
    this.loadingData = true;
    this.api.GetPurchaseById(id).pipe(untilDestroyed(this)).subscribe((x: any) => {
      this.loadingData = false;
      if (x.ResponseCode === 0) {

        this.purchaseDetail = x.AllPurchaseList[0];
        let productSubtotal = 0;
        let productSubtotalFC = 0;
        let subtotal = 0;
        let totalDiscount = 0;
        let grandTotal = 0;
        let discPerc = 0;

        x.AllPurchaseList[0].PurchasesDetails.forEach((item : any) => {
          productSubtotal = item.dTotalAmount + item.dTotalDiscount;
          productSubtotalFC = item.dTotalAmountFC + item.dTotalDiscountFC;
          item.ProductUnitPrice = productSubtotal / item.Quantity;
          productSubtotalFC = productSubtotalFC / item.Quantity;
          discPerc = (item.dTotalDiscount * 100) / (productSubtotal);

          subtotal = subtotal + productSubtotal;
          totalDiscount = totalDiscount + item.dTotalDiscount;
          grandTotal = grandTotal + item.dTotalAmount;
          item.discPerc = ((item.dTotalDiscount * 100) / (productSubtotal)).toFixed(2);
        });
        this.purchaseDetail.subTotal = subtotal.toFixed(2);
        this.purchaseDetail.totalDiscount = totalDiscount.toFixed(2);
        this.purchaseDetail.grandTotal = grandTotal.toFixed(2);
        this.loadingData = true;
        this.api.GetAllSupplier().subscribe((response: any) => {
          this.loadingData = false;
          if (response.ResponseText === 'success') {

            for (let i = 0; i < response.AllSupplierList.length; i++) {
              response.AllSupplierList[i].FirstName = response.AllSupplierList[i].FirstName != null ?
                response.AllSupplierList[i].FirstName : '';
              response.AllSupplierList[i].LastName = response.AllSupplierList[i].LastName != null ? response.AllSupplierList[i].LastName : '';
              response.AllSupplierList[i].FullName = response.AllSupplierList[i].FirstName + ' ' + response.AllSupplierList[i].LastName;
            }
            this.purchaseDetail.supplierDetail = response.AllSupplierList.filter((x : any) =>
              x.SupplierID == this.purchaseDetail.SupplierID).shift();
            this.cdr.detectChanges();
          }
          else {
            this.toastService.showErrorToast('Error', "Internal Server Error");
            
            
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
  
  openImageGellary(imagePath: any) {
    this.imgSrc = imagePath;
    this.btn_open_multi_img_modal.nativeElement.click();
  }


}
