import { CustomerRoutingModule } from './customer.routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPermissionsModule } from 'ngx-permissions';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { SharedModule } from 'src/app/shared/shared.module';
import { TranslationModule } from '../i18n';
import { CustomerComponent } from './customer.component';
import { CustomerIndexComponent } from './customer-index/customer-index.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CustomerPaymentsComponent } from './customer-payments/customer-payments.component';
import { ReportbyaddressComponent } from './reportbyaddress/reportbyaddress.component';
import { CustomerLedgerComponent } from './customer-ledger/customer-ledger.component';
import { CustomerBalancePaymentComponent } from './customer-balancePayment/customer-balancePayment.component';
import { CustomerDirectPaymentComponent } from './customer-directPayment/customer-directPayment.component';
import { CustomerClearDirectPaymentComponent } from './customer-clearDirectPayment/customer-clearDirectPayment.component';
import { CustomerOpenInvoicesComponent } from './customer-openInvoices/customer-openInvoices.component';
import { CustomerProductDiscountComponent } from './customer-productdiscount/customer-productdiscount.component';
import { CustomerBlacklistedComponent } from './customer-blacklisted/customer-blacklisted.component';
import { CustomerPaymentDetailComponent } from './customer-payment-details/customer-payment-details.component';
import { CustomerPaymentNewComponent } from './customer-payment-new/customer-payment-new.component';

@NgModule({
  declarations: [
    CustomerComponent,
    CustomerIndexComponent,
    AddCustomerComponent,
    CustomerPaymentsComponent,
    ReportbyaddressComponent,
    CustomerLedgerComponent,
    CustomerBalancePaymentComponent,
    CustomerDirectPaymentComponent,
    CustomerClearDirectPaymentComponent,
    CustomerOpenInvoicesComponent,
    CustomerProductDiscountComponent,
    CustomerBlacklistedComponent,
    CustomerPaymentDetailComponent,
    CustomerPaymentNewComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule,
    InlineSVGModule,
    TranslationModule,
    // ModalsModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class CustomerModule {}
