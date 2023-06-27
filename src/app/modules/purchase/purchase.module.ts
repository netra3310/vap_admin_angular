import { PurchaseRoutingModule } from './purchase.routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPermissionsModule } from 'ngx-permissions';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AddBackOrderComponent } from './add-back-order/add-back-order.component';
import { AddPreOrderComponent } from './add-pre-order/add-pre-order.component';
import { AddPurchaseComponent } from './add-purchase/add-purchase.component';
import { AddRefundComponent } from './add-refund/add-refund.component';
import { AddRefundOldComponent } from './add-refund-old/add-refund-old.component';
import { BackOrderReportComponent } from './back-order-report/back-order-report.component';
import { BackOrderDetailComponent } from './backorder-detail/backorder-detail.component';
import { HoldPurchaseDetailComponent } from './hold-purchase-detail/hold-purchase-detail.component';
import { HoldpurchasereportIndexComponent } from './holdpurchasereport-index/holdpurchasereport-index.component';
import { OpenPurchaseDetailCustomizedComponent } from './open-purchase-detail-customized/open-purchase-detail-customized.component';
import { PurchaseDetailComponent } from './purchase-detail/purchase-detail.component';
import { PurchaseDetailCustomizedComponent } from './purchase-detail-customized/purchase-detail-customized.component';
import { PurchaseOrderCustomizedReportComponent } from './purchase-order-customized-report/purchase-order-customized-report.component';
import { PurchaseOrderReportComponent } from './purchase-order-report/purchase-order-report.component';
import { ReturnPurchaseDetailComponent } from './return-purchase-detail/return-purchase-detail.component';
import { ReturnPurchaseReportComponent } from './return-purchase-report/return-purchase-report.component';
import { UpdateHoldPurchaseComponent } from './update-hold-purchase/update-hold-purchase.component';
import { UpdatePurchaseComponent } from './update-purchase/update-purchase.component';
import { OpenpurchasereportIndexComponent } from './openpurchasereport-index/openpurchasereport-index.component';
import { OpenpurchasereportIndexCustomizedComponent } from './openpurchasereport-index-customized/openpurchasereport-index-customized.component';
import { OpenPurchaseDetailComponent } from './open-purchase-detail/open-purchase-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslationModule } from '../i18n';
import { PurchaseComponent } from './purchase.component';

@NgModule({
  declarations: [
    PurchaseComponent,
    AddBackOrderComponent,
    AddPreOrderComponent,
    AddPurchaseComponent,
    AddRefundComponent,
    AddRefundOldComponent,
    BackOrderReportComponent,
    BackOrderDetailComponent,
    HoldPurchaseDetailComponent,
    UpdateHoldPurchaseComponent,
    UpdatePurchaseComponent,
    OpenpurchasereportIndexComponent,
    OpenpurchasereportIndexCustomizedComponent,
    OpenPurchaseDetailComponent,
    PurchaseOrderReportComponent,
    PurchaseDetailComponent,
    ReturnPurchaseReportComponent,
    ReturnPurchaseDetailComponent,
    HoldpurchasereportIndexComponent,
    OpenPurchaseDetailCustomizedComponent,
    PurchaseOrderCustomizedReportComponent,
    PurchaseDetailCustomizedComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    SharedModule,
    InlineSVGModule,
    TranslationModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class PurchaseModule { }
