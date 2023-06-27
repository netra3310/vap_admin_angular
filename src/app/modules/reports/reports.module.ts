import { ReportsRoutingModule } from './reports.routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslationModule } from '../i18n';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxPermissionsModule } from 'ngx-permissions';

import { CustomerDashboardReportComponent } from './customer-dashboard-report/customer-dashboard-report.component';
import { CashInOutComponent } from './cash-in-out/cash-in-out.component';
import { CustomerLifeLineReportComponent } from './customer-life-line-report/customer-life-line-report.component';
import { InventoryWorthReportComponent } from './inventory-worth-report/inventory-worth-report.component';
import { OpencartComponent } from './opencart/opencart.component';
import { PreOrderHistoryReportComponent } from './pre-order-history-report/pre-order-history-report.component';
import { ShipmentsComponent } from './shipments/shipments.component';
import { SingleProductLifeLineComponent } from './single-product-life-line/single-product-life-line.component';
import { StockComponent } from './stock/stock.component';
import { SupplierComponent } from './supplier/supplier.component';
import { SupplierLifeLineReportComponent } from './supplier-life-line-report/supplier-life-line-report.component';
import { VpOrdersComponent } from './shipments/vp-orders/vp-orders.component';
import { OnlineOrdersComponent } from './shipments/online-orders/online-orders.component';
import { SupplierinvoicesComponent } from './supplier/supplierinvoices/supplierinvoices.component';
import { AvailableStockComponent } from './stock/available-stock/available-stock.component';
import { StockIndexPricesComponent } from './stock/stock-index-prices/stock-index-prices.component';
import { StockIndexPricesDetailComponent } from './stock/stock-index-prices-detail/stock-index-prices-detail.component';
import { StockLocationDetailsComponent } from './stock/stock-location-details/stock-location-details.component';
import { StockModelComponent } from './stock/stock-model/stock-model.component';
import { StockAlertReportComponent } from './stock/stock-alert-report/stock-alert-report.component';
import { OpencartLogComponent } from './opencart/log/opencartlog.component';
import { AnnualChartComponent } from './customer-dashboard-report/annual-chart/annual-chart.component';
import { YearDropdownComponent } from './customer-dashboard-report/year-dropdown/year-dropdown.component';
import { ProductTableComponent } from './customer-dashboard-report/product-table/product-table.component';
import { DateDropdownComponent } from './customer-dashboard-report/date-dropdown/date-dropdown.component';
import { StockShopCategoriesComponent } from './stock/stock-shop-categories/stock-shop-categories.component';
@NgModule({
  declarations: [
    AnnualChartComponent,
    YearDropdownComponent,
    ProductTableComponent,
    DateDropdownComponent,
    CustomerDashboardReportComponent,
    CashInOutComponent,
    CustomerLifeLineReportComponent,
    InventoryWorthReportComponent,
    OpencartComponent,
    PreOrderHistoryReportComponent,
    ShipmentsComponent,
    SingleProductLifeLineComponent,
    StockComponent,
    SupplierComponent,
    SupplierLifeLineReportComponent,
    VpOrdersComponent,
    OnlineOrdersComponent,
    SupplierinvoicesComponent,
    AvailableStockComponent,
    StockIndexPricesComponent,
    StockIndexPricesDetailComponent,
    StockLocationDetailsComponent,
    StockModelComponent,
    StockAlertReportComponent,
    OpencartLogComponent,
    StockShopCategoriesComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    SharedModule,
    TranslationModule,
    ReportsRoutingModule,
    NgApexchartsModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class ReportsModule { }
