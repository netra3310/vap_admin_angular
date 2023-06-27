import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-non-printed-invoices-report',
  templateUrl: './non-printed-invoices-report.component.html',
  styleUrls: ['./non-printed-invoices-report.component.scss']
})
export class NonPrintedInvoicesReportComponent implements OnInit {
  environmentData: any;
  imageBasePath:string;
  // @Input() SaleDetails: any = null;
  @Input() isHidden: boolean = true;
  // @Input() TotalQuantity : number= 0;
  @Input() invoicesData: any;
  constructor() {
    this.environmentData = environment;
    this.imageBasePath = this.environmentData.imageBasePath;
    
  }

  ngOnInit() {
    //this.TotalQuantity = this.SaleDetails.newSaleDetails.reduce((accumulator, value) => { return accumulator + value.Quantity; }, 0); 
  }


}
