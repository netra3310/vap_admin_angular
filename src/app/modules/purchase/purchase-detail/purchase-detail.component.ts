import { Component, ElementRef, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import * as html2canvas from 'html2canvas';
// import { ToastService } from '../../shell/services/toast.service';

import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { StorageService } from 'src/app/shared/services/storage.service';
import * as FileSaver from "file-saver";
import { ToastService } from '../../shell/services/toast.service';
// 
@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.scss']
})
export class PurchaseDetailComponent implements OnInit, OnDestroy {
  date = new Date();
  products: any[] = [
    { Product: 'a', Quantity: 3, Price: 1, isRefund: false }
  ];
  purchaseId: number;
  purchaseDetail: any = {};
  usermodel: any;
  loadingData : boolean = true;

  imgSrc: any;
  imageBasePath: any;
  @ViewChild('btn_open_multi_img_modal') btn_open_multi_img_modal: ElementRef;
  
  @ViewChild('screen') screen: ElementRef;

  constructor(private api: vaplongapi, private activatedRoute: ActivatedRoute,  public route: Router,
    private toastService : ToastService, 
    private cdr : ChangeDetectorRef,
    private storageService: StorageService) {
    this.usermodel = this.storageService.getItem('UserModel');
    this.imageBasePath = this.api.imageBasePath;
    const obj = {
      Action: 'View',
      Description: `View Purchase Details`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
    }
    this.api.SaveActivityLog(obj).toPromise().then((x: any) => { this.loadingData = false; });
  }

  ngOnDestroy(): void {

  }
  ngOnInit() {
    this.loadingData = true;
    const snapshot = this.activatedRoute.snapshot;
    const Param = { ID: snapshot.params.id };
    this.purchaseId = (Param.ID);
    this.api.GetPurchaseById(Param).pipe(untilDestroyed(this)).subscribe((x: any) => {
      this.loadingData = false;
      if (x.ResponseCode === 0) {

        this.purchaseDetail = x.AllPurchaseList[0];
        let productSubtotal = 0;
        let productSubtotalFC = 0;
        let subtotal = 0;
        let totalDiscount = 0;
        let grandTotal = 0;
        let discPerc = 0;
        let btntrackable;

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
            alert("Internal Server Error");
          }

        }
        );
        console.log(this.purchaseDetail.PurchasesDetails)
      }

    });
  }
  Close() {
    let callingRoute = this.storageService.getItem('PurchaseDetailRoute');
    if ((callingRoute === null || callingRoute === undefined) || callingRoute == '') {
      this.route.navigate(['/purchase/purchase-order-report']);
    }
    else {
      this.route.navigate([callingRoute]);
    }
    this.storageService.setItem("PurchaseDetailRoute", "/purchase/purchase-order-report")
  }
  GenerateExcel(){
    this.exportExcel(this.purchaseId,this.purchaseDetail.PurchasesDetails);
  } 

  exportExcel(orderId : any, data : any) {
    import("xlsx").then((xlsx) => {
      let exportData: any[] = [];
      
      let selectedColumns = ["Product","Model No","Quantity","Unit Price","Discount%","Discount","Total"];

      
      data.forEach((item : any) => {
        let productSubtotal = item.dTotalAmount + item.dTotalDiscount;
        item.ProductUnitPrice = productSubtotal / item.Quantity;
        item.discPerc = ((item.dTotalDiscount * 100) / (productSubtotal)).toFixed(2);

        let obj = {
          "Product":item.Product,
          "Model No":item.BLabel,
          "Quantity":item.Quantity,
          "Unit Price":item.ProductUnitPrice,
          "Discount%":item.discPerc,
          "Discount":item.dTotalDiscount,
          "Total":item.dTotalAmount, 
        }
        exportData.push(obj);
      });
      const ad = selectedColumns.map((x) => x);

      const worksheet = xlsx.utils.json_to_sheet(exportData, { header: ad });
      //xlsx.utils.sheet_add_json(worksheet, data, { skipHeader: true, origin: "A" + (exportData.length + 3) });
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      this.saveAsExcelFile(excelBuffer, "PurchaseOrder_"+orderId);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    // import("file-saver").then((FileSaver) => {
      const EXCELTYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const EXCELEXTENSION = ".xlsx";
      const data: Blob = new Blob([buffer], {
        type: EXCELTYPE,
      });
      FileSaver.saveAs(data, fileName+ EXCELEXTENSION);
    // });
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
