import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-non-printed-invoices-with-prices-report',
  templateUrl: './non-printed-invoices-with-prices-report.component.html',
  styleUrls: ['./non-printed-invoices-with-prices-report.component.scss']
})
export class NonPrintedInvoicesWithPricesReportComponent implements OnInit {
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
