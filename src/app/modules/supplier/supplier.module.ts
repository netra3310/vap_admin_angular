import { SupplierRoutingModule } from './supplier.routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslationModule } from '../i18n';
import { NgxPermissionsModule } from 'ngx-permissions';


import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { SupplierIndexComponent } from './supplier-index/supplier-index.component';
import { SupplierLedgerComponent } from './supplier-ledger/supplier-ledger.component';
import { SupplierOpenInvoicesComponent } from './supplier-open-invoices/supplier-open-invoices.component';
import { SupplierPaymentNewComponent } from './supplier-payment-new/supplier-payment-new.component';
import { SupplierPaymentsComponent } from './supplier-payments/supplier-payments.component';

@NgModule({
  declarations: [
  
    AddSupplierComponent,
    SupplierIndexComponent,
    SupplierLedgerComponent,
    SupplierOpenInvoicesComponent,
    SupplierPaymentNewComponent,
    SupplierPaymentsComponent
  ],
  imports: [
    CommonModule,
    SupplierRoutingModule,
    InlineSVGModule,
    SharedModule,
    TranslationModule,
    NgxPermissionsModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class SupplierModule { }
