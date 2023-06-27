import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PurchasePermissionEnum } from '../../constant/purchase-permission';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-purchase-detail-report',
  templateUrl: './purchase-detail-report.component.html',
  styleUrls: ['./purchase-detail-report.component.scss']
})
export class PurchaseDetailReportComponent implements OnInit {
  environmentData: any;
  PurchasePermission = PurchasePermissionEnum;

  @Input() purchaseDetail: any = null;
  constructor(private permission: PermissionService) {
    this.environmentData = environment;
  }

  ngOnInit() {
  }

  
//***** origin code start *****

  // Print() {
  //   setTimeout(() => {
  //     let printContents, popupWin;

  //     printContents = document.getElementById('printA4').innerHTML;
  //     popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  //     popupWin.document.open();
  //     popupWin.document.write(`
  //               <html>
  //                 <head>
  //                   <title>Report</title>
  //                   <style>
  //                   //........Customized style.......
  //                   .sty{
  //                     "width: 67%;color: #000; float: left;text-align: left; margin: 0;font-size: 12px; font-weight: 600;padding-right: 10px;
  //                   }
  //                   </style>
  //                 </head>
  //                 <body onload="window.print();self.close();">${printContents}</body>
  //               </html>`);
  //     popupWin.document.close();
  //   }, 500);
  // }

//***** origin code end *****


  Print() {
    setTimeout(() => {
  
      let printContents: string, popupWin: Window | null;
  
      printContents = document?.getElementById('printA4')?.innerHTML ?? '';
      popupWin = window?.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  
      if (popupWin) {
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
      } else {
        console.log('Failed to open popup window');
      }
    }, 500);
  }
}
