import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesRoutingModule } from './sales-routing.module'; 
import { SalesComponent } from './sales.component';
import { SaleStatsComponent } from './sale-stats/sale-stats.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ModalsModule, WidgetsModule, CardsModule } from 'src/app/shared/partials';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxPermissionsModule } from 'ngx-permissions';

import { AnnualChartComponent } from './sale-stats/annual-chart/annual-chart.component';
import { YearDropdownComponent } from './sale-stats/year-dropdown/year-dropdown.component';
import { ProductTableComponent } from './sale-stats/product-table/product-table.component';
import { DateDropdownComponent } from './sale-stats/date-dropdown/date-dropdown.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslationModule } from '../i18n';
import { AddPerformaInvoiceComponent } from './add-performa-invoice/add-performa-invoice.component';
import { AddReceiptComponent } from './add-receipt/add-receipt.component';
import { AddReceiptNewComponent } from './add-receipt-new/add-receipt-new.component';
import { AddSaleRefundComponent } from './add-sale-refund/add-sale-refund.component';
import { HoldSaleDetailComponent } from './hold-sale-detail/hold-sale-detail.component';
import { OnlineOrderDetailComponent } from './online-order-detail/online-order-detail.component';
import { OpensalereportIndexComponent } from './opensalereport-index/opensalereport-index.component';
import { PerformaInvoiceDetailComponent } from './performainvoice-detail/performainvoice-detail.component';
import { PerformainvoiceIndexComponent } from './performainvoice-index/performainvoice-index.component';
import { RefundSaleDetailComponent } from './refundsale-detail/refundsale-detail.component';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { SaleIndexComponent } from './sale-index/sale-index.component';
import { SaleInvoiceoverviewComponent } from './sale-invoiceoverview/sale-invoiceoverview.component';
import { SalerefundreportIndexComponent } from './salerefundreport-index/salerefundreport-index.component';
import { SalereportByproductComponent } from './salereport-byproduct/salereport-byproduct.component';
import { SalereportBysubcategoryComponent } from './salereport-bysubcategory/salereport-bysubcategory.component';
import { SalereportByuserComponent } from './salereport-byuser/salereport-byuser.component';
import { UpdateReceiptByOrderComponent } from './update-receipt-by-order/update-receipt-by-order.component';
import { UpdateReceiptNewComponent } from './update-receipt-new/update-receipt-new.component';
import { UpdateSaleDetailComponent } from './update-sale-detail/update-sale-detail.component';
import { VpSaleDetailComponent } from './vp-sale-detail/vp-sale-detail.component';
import { SaleStatsDetailComponent } from './sale-stats-detail/sale-stats-detail.component';

@NgModule({
  declarations: [
    SalesComponent,
    SaleStatsComponent,
    AnnualChartComponent,
    YearDropdownComponent,
    ProductTableComponent,
    DateDropdownComponent,
    AddPerformaInvoiceComponent,
    AddReceiptComponent,
    AddReceiptNewComponent,
    AddSaleRefundComponent,
    HoldSaleDetailComponent,
    OnlineOrderDetailComponent,
    OpensalereportIndexComponent,
    PerformaInvoiceDetailComponent,
    PerformainvoiceIndexComponent,
    RefundSaleDetailComponent,
    SaleDetailComponent,
    SaleIndexComponent,
    SaleInvoiceoverviewComponent,
    SalerefundreportIndexComponent,
    SalereportByproductComponent,
    SalereportBysubcategoryComponent,
    SalereportByuserComponent,
    UpdateReceiptByOrderComponent,
    UpdateReceiptNewComponent,
    UpdateSaleDetailComponent,
    VpSaleDetailComponent,
    SaleStatsDetailComponent,
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    InlineSVGModule,
    WidgetsModule,
    ModalsModule,
    NgApexchartsModule,
    SharedModule,
    TranslationModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class SalesModule { }
