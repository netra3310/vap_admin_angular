import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SsGenericTableComponent } from './components/ss-generic-table/ss-generic-table.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SelDateDropComponent } from './components/sel-date-drop/sel-date-drop.component';
import { SelColDropComponent } from './components/sel-col-drop/sel-col-drop.component';
import { TranslationModule } from 'src/app/modules/i18n';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SearchPipe } from './pipes/search-pipe';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { GenericModalComponent } from './components/generic-modal/generic-modal.component';
import { ContextDropComponent } from './components/context-drop/context-drop.component';
import { DatepickerpopupComponent } from '../EntryComponents/datepickerpopup/datepickerpopup.component';
import { SelDateBtnComponent } from './components/sel-date-btn/sel-date-btn.component';
import { SessionTimeCounterComponent } from '../EntryComponents/session-time-counter/session-time-counter.component';
import { CustomSelectComponent } from './components/custom-select/custom-select.component';
import { CustomSelectOptionComponent } from './components/custom-select/custom-select-option/custom-select-option.component';
import { CustomRadioComponent } from './components/custom-radio/custom-radio.component';
import { CustomDropdownComponent } from './components/custom-dropdown/custom-dropdown.component';
import { CustomDropdownOptionComponent } from './components/custom-dropdown/custom-dropdown-option/custom-dropdown-option.component';
import { CustomDateRangeComponent } from './components/custom-date-range/custom-date-range.component';
import { CustomDatePickerComponent } from './components/custom-date-picker/custom-date-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GenricTableComponent } from './components/genric-table/genric-table.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { CustomSpinnerComponent } from './components/custom-spinner/custom-spinner.component';

import { PurchaseDetailReportComponent } from './print-reports/purchase-detail-report/purchase-detail-report.component';
import { PurchaseDetailPackingListCustomizedReportComponent } from './print-reports/purchase-detail-packinglist-customized-report/purchase-detail-packinglist-customized-report.component';
import { PurchaseDetailPackingListReportComponent } from './print-reports/purchase-detail-packinglist-report/purchase-detail-packinglist-report.component';
import { CustomConfirmDialogComponent } from './components/custom-confirm-dialog/custom-confirm-dialog.component';
import { PurchaseDetailCustomizedReportComponent } from './print-reports/purchase-detail-customized-report/purchase-detail-customized-report.component';
import { ReturnPurchaseDetailReportComponent } from './print-reports/return-purchase-detail-report/return-purchase-detail-report.component';
import { BackOrderDetailReportComponent } from './print-reports/backorder-detail-report/backorder-detail-report.component';
import { OpenPurchaseDetailReportComponent } from './print-reports/open-purchase-detail-report/open-purchase-detail-report.component';
import { CustomNotificationComponent } from './components/custom-notification/custom-notification.component';
import { ToasterComponent } from './components/toaster/toaster.component';
import { ToastComponent } from './components/toaster/toast/toast.component';
import { VpSalePackingReportComponent } from './print-reports/vp-sale-packing-report/vp-sale-packing-report.component';
import { VpSalePreviewReportComponent } from './print-reports/vp-sale-preview-report/vp-sale-preview-report.component';
import { SaleInvoiceReportComponent } from './print-reports/sale-invoice-report/sale-invoice-report.component';
import { SalePreviewReportComponent } from './print-reports/sale-preview-report/sale-preview-report.component';
// import { ShippingTransferDetailsReportComponent } from './print-reports/shipping-transfer-details-report/shipping-transfer-details-report.component';
import { CustomerPreviousInvoiceComponent } from 'src/app/EntryComponents/customer-previous-invoice/customer-previous-invoice.component';
import { PaymentConditionComponent } from '../EntryComponents/payment-condition/payment-condition.component';
import { ProductLastAveragePriceDialogComponent } from 'src/app/EntryComponents/product-last-average-price-dialog/product-last-average-price-dialog.component';
import { AddwishlistDialogComponent } from 'src/app/EntryComponents/addwishlist-dialog/addwishlist-dialog.component';
import { SaleRefundReportComponent } from './print-reports/sale-refund-report/sale-refund-report.component';
import { HoldSaleDetailReportComponent } from './print-reports/hold-sale-detail-report/hold-sale-detail-report.component';
import { OnlineOrderPreviewReportComponent } from './print-reports/online-order-preview-report/online-order-preview-report.component';
import { CustomFileUploaderComponent } from './components/custom-file-uploader/custom-file-uploader.component';
import { CustomImageUploaderComponent } from './components/custom-img-uploader/custom-image-uploader.component';
import { CustomAutoCompleteComponent } from './components/custom-auto-complete/custom-auto-complete.component';
import { ModalComponent } from './components/custom-modal/modal.component';
import { AddIncomingQuantityDialogComponent } from '../EntryComponents/addincomingquantity-dialog/addincomingquantity-dialog.component';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { CustomImageGalleryComponent } from './components/custom-image-gallery/custom-image-gallery.component';
import { CustomBrandComponent } from './components/custom-brand/custom-brand.component';
import { CustomPicklistComponent } from './components/custom-picklist/custom-picklist.component';
import { LoadingComponent } from './components/loading/loading.component';
import { QRPrintComponent } from './print-reports/qr-print/qr-print.component';
import { ExportProductSelectionComponent } from './components/export-product-selection/export-product-selection.component';
import { MultiProductSelectionComponent } from './components/multi-product-selection/multi-product-selection.component';
import { CaptchaDialogComponent } from 'src/app/EntryComponents/captcha-dialog/captcha-dialog.component';
import { NonPrintedInvoicesReportComponent } from './print-reports/non-printed-invoices-report/non-printed-invoices-report.component';
import { NonPrintedInvoicesWithPricesReportComponent } from './print-reports/non-printed-invoices-with-prices-report/non-printed-invoices-with-prices-report.component';
import { CustomImageListComponent } from './components/custom-image-list/custom-image-list.component';
import { ShippingTransferDetailsReportComponent } from './print-reports/shipping-transfer-details-report/shipping-transfer-details-report.component';
import { DeliveryMethodComponent } from '../EntryComponents/delivery-method/delivery-method.component';

@NgModule({
  declarations: [
    DatepickerpopupComponent,
    SsGenericTableComponent,
    SelDateDropComponent,
    SelColDropComponent,
    PaginationComponent,
    SearchPipe,
    ContextMenuComponent,
    GenericModalComponent,
    ContextDropComponent,
    SelDateBtnComponent,
    SessionTimeCounterComponent,
    CustomSelectComponent,
    CustomSelectOptionComponent,
    CustomRadioComponent,
    CustomDropdownComponent,
    CustomDropdownOptionComponent,
    CustomDateRangeComponent,
    CustomDatePickerComponent,
    GenricTableComponent,
    CustomInputComponent,
    CustomSpinnerComponent,
    PurchaseDetailReportComponent,
    PurchaseDetailPackingListCustomizedReportComponent,
    PurchaseDetailPackingListReportComponent,
    CustomConfirmDialogComponent,
    PurchaseDetailCustomizedReportComponent,
    ReturnPurchaseDetailReportComponent,
    BackOrderDetailReportComponent,
    OpenPurchaseDetailReportComponent,
    CustomNotificationComponent,
    ToasterComponent,
    ToastComponent,
    VpSalePackingReportComponent,
    VpSalePreviewReportComponent,
    SaleInvoiceReportComponent,
    SalePreviewReportComponent,
    CustomerPreviousInvoiceComponent,
    PaymentConditionComponent,
    ProductLastAveragePriceDialogComponent,
    AddwishlistDialogComponent,
    SaleRefundReportComponent,
    HoldSaleDetailReportComponent,
    OnlineOrderPreviewReportComponent,
    CustomFileUploaderComponent,
    CustomImageUploaderComponent,
    CustomAutoCompleteComponent,
    ModalComponent,
    AddIncomingQuantityDialogComponent,
    InputNumberComponent,
    CustomImageGalleryComponent,
    CustomBrandComponent,
    CustomPicklistComponent,
    LoadingComponent,
    QRPrintComponent,
    ExportProductSelectionComponent,
    MultiProductSelectionComponent,
    CaptchaDialogComponent,
    NonPrintedInvoicesReportComponent,
    NonPrintedInvoicesWithPricesReportComponent,
    CustomImageListComponent,
    ShippingTransferDetailsReportComponent,
    DeliveryMethodComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    TranslationModule,
    FormsModule,
    NgbModule,
    ScrollingModule
  ],
  exports: [
    SsGenericTableComponent,
    SelDateDropComponent,
    SearchPipe,
    GenericModalComponent,
    ContextDropComponent,
    DatepickerpopupComponent,
    SelDateBtnComponent,
    SessionTimeCounterComponent,
    CustomSelectComponent,
    CustomRadioComponent,
    CustomDropdownComponent,
    CustomDatePickerComponent,
    GenricTableComponent,
    CustomInputComponent,
    CustomSpinnerComponent,
    PurchaseDetailReportComponent,
    PurchaseDetailPackingListCustomizedReportComponent,
    PurchaseDetailPackingListReportComponent,
    FormsModule,
    PurchaseDetailCustomizedReportComponent,
    ReturnPurchaseDetailReportComponent,
    BackOrderDetailReportComponent,
    OpenPurchaseDetailReportComponent,
    CustomNotificationComponent,
    ToasterComponent,
    VpSalePackingReportComponent,
    VpSalePreviewReportComponent,
    SaleInvoiceReportComponent,
    SalePreviewReportComponent,
    CustomerPreviousInvoiceComponent,
    PaymentConditionComponent,
    ProductLastAveragePriceDialogComponent,
    AddwishlistDialogComponent,
    SaleRefundReportComponent,
    HoldSaleDetailReportComponent,
    OnlineOrderPreviewReportComponent,
    CustomFileUploaderComponent,
    CustomImageUploaderComponent,
    CustomAutoCompleteComponent,
    ModalComponent,
    AddIncomingQuantityDialogComponent,
    InputNumberComponent,
    CustomImageGalleryComponent,
    CustomBrandComponent,
    CustomPicklistComponent,
    LoadingComponent,
    QRPrintComponent,
    CaptchaDialogComponent,
    NonPrintedInvoicesReportComponent,
    NonPrintedInvoicesWithPricesReportComponent,
    CustomImageListComponent,
    ShippingTransferDetailsReportComponent,
    DeliveryMethodComponent
  ],
  providers: [],
  bootstrap: [
    CustomDatePickerComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SharedModule { }
