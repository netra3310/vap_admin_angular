import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
// //import { Table } from 'primeng/table';
// import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { UpdateStatus } from 'src/app/Helper/models/UpdateStatus';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { ActivatedRoute, Router } from '@angular/router';
// import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { ConfirmationService } from 'src/app/Service/confirmation.service';

import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
// 
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { SupplierOpenInvoicesModel } from 'src/app/Helper/models/SupplierOpenInvoicesModel';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from '../../shell/services/toast.service';

@Component({
  selector: 'app-supplier-openInvoices',
  templateUrl: './supplier-open-invoices.component.html',
  styleUrls: ['./supplier-open-invoices.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class SupplierOpenInvoicesComponent implements OnInit, OnDestroy {
  AllSupplierLedgerlist: any[] = [];

  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 25;
  // last = 25;
  totalRecords = 0;
  items: any[];
  cols: any[];
  exportColumns: any[];

  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');

  usermodel: UserModel;
  updateStatusModel: UpdateStatus;

  filterRequestModel: FilterRequestModel;
  routeID: any;
  routeName: any;

  EnteredBalance: number;
  txtAmount: number;
  Remarks = '';

  txtRemaining = 0;
  selectedPaymentModeID: any;
  PaymentModeDropdown: any[] = [];

  CashRegisterHistoryID = 0;
  // supplier intials
  SupplierOpenInvoicesList: SupplierOpenInvoicesModel[] = [];
  // ends here

  // calculation variables starts
  supplierSales: SupplierOpenInvoicesModel[] = [];
  AllSupplierOpenInvoices: SupplierOpenInvoicesModel[] = [];

  // calculation variables ends

  genericMenuItems: GenericMenuItems[] = [

  ];
  columns: Columns[] = [
    { field: 'sNarration', header: 'Description', sorting: 'sNarration', placeholder: '' },
    { field: 'ExchangeRate', header: 'Exchange Currency', sorting: 'ExchangeRate', placeholder: '' },
    { field: 'CurrentExchangeRate', header: 'Current Exchange Rate', sorting: 'CurrentExchangeRate', placeholder: '' },
    { field: 'dCredit', header: 'Credit', sorting: 'dCredit', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL },
    { field: 'dCreditFC', header: 'Credit (in EC)', sorting: 'dCreditFC', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL },
    // { field: 'dDebit', header: 'Debit', sorting: 'dDebit', placeholder: '',type: TableColumnEnum.CURRENCY_SYMBOL },
    // { field: 'dDebitFC', header: 'Debit (in EC)', sorting: 'dDebitFC', placeholder: '',type: TableColumnEnum.CURRENCY_SYMBOL},
    // tslint:disable-next-line: max-line-length
    { field: 'CurrentBalance', header: 'Current Balance', sorting: 'CurrentBalance', placeholder: '', type: TableColumnEnum.BALANCE_COLUMN },
    // tslint:disable-next-line: max-line-length
    { field: 'CurrentBalanceFC', header: 'Current Balance (in EC)', sorting: 'CurrentBalanceFC', placeholder: '', type: TableColumnEnum.BALANCE_COLUMN },
    { field: 'CreatedAt', header: 'Date', sorting: 'CreatedAt', placeholder: '', type: TableColumnEnum.DATE_FORMAT },

  ];

  globalFilterFields = ['CreatedAt', 'ExchangeRate', 'CurrentExchangeRate', 'dCredit', 'dCreditFC', 'sNarration', 'CurrentBalance', 'CurrentBalanceFC'];
  rowsPerPageOptions = [10, 20, 50, 100]
  isLoadingData : boolean = true;
  constructor(
    private apiService: vaplongapi, private datepipe: DatePipe, private route: ActivatedRoute,
    private router: Router, 
    // private toastService: ToastService, 
    private toastService : ToastService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef) {
    this.routeID = this.route.snapshot.params.id;
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Supplier Invoices Payment Report`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then((x : any) => { });
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.CashRegisterHistoryID = this.storageService.getItem('CashRegisterHistoryID');
    this.GetPaymentModeDDFunction(0);
    this.getAllSupplierLedgerList(this.routeID);
    this.GetSupplierPaymentsForClearance(this.routeID);
  }

  ngOnDestroy(): void { }
  emitAction(event : any) {

  }

  GetPaymentModeDDFunction(id : any) {
    this.apiService.GetPaymentModeDropDownData().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        if (id !== 0) { this.selectedPaymentModeID = id; }
        else { this.selectedPaymentModeID = response.DropDownData[0].ID; }
        for (const item of response.DropDownData) {
          this.PaymentModeDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
      }
      else {
        console.log('internal serve Error', response);
      }
    });
  }

  CloseThis() {
    this.router.navigate(['/supplier/supplier-payments']);
  }

  // supplier selection section and Data Fetecting ---------

  GetSupplierPaymentsForClearance(supplierID: any) {
    this.IsSpinner = true;
    const Params = { ID: supplierID };
    this.apiService.GetSupplierOpenInvoices(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        response.AllSupplierOpenInvoices.forEach((element : any) => {
          element.purchaseAmount = 0;
        });
        this.SupplierOpenInvoicesList = response.AllSupplierOpenInvoices;
        this.txtRemaining = response.dOpeningBalance - response.AllSupplierOpenInvoices.reduce((sum: any, current : any) =>
          sum + current.dRemainingAmount, 0);
        this.IsSpinner = false;
        this.cdr.detectChanges();
      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }
  getAllSupplierLedgerList(ID : any) {
    this.filterRequestModel = new FilterRequestModel();
    this.filterRequestModel.PageNo = 0;
    this.filterRequestModel.PageSize = 100000;
    this.filterRequestModel.ID = Number(ID);
    this.filterRequestModel.IsGetAll = true;
    this.filterRequestModel.FromDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    this.filterRequestModel.ToDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    this.isLoadingData = true;
    this.apiService.GetSupplierLeadgerByFilter(this.filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      
      this.isLoadingData = false;
      if (response.ResponseCode === 0) {
        this.AllSupplierLedgerlist = response.AllTransactionList.filter((x : any) => x.dCredit !== 0);
        this.IsSpinner = false;
        this.isLoadingData = false;
        this.cdr.detectChanges();
      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }
  // supplier selection section ends -----------------------------

  AddPaymentMain() {

    const paymentList: any[] = [];
    let paymentModel: any;
    this.SupplierOpenInvoicesList.filter((x : any) => x.purchaseAmount !== 0).forEach(item => {
      paymentModel =
      {
        dPaidAmount: item.purchaseAmount,
        PurchasePaymentID: item.PurchasePaymentID
      };
      paymentList.push(paymentModel);
    });

    const Params = {
      SupplierID: Number(this.routeID),
      PaymentModeID: this.selectedPaymentModeID,
      // CashRegisterHistoryID: this.CashRegisterHistoryID,
      CreatedByUserID: this.usermodel.ID,
      AllUpdatePurchasePaymentList: paymentList,
      Remarks: this.Remarks,
    }
    this.apiService.AddSupplierPayment(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('success', 'Payments added successfully');
        this.IsSpinner = false;
        this.GetSupplierPaymentsForClearance(this.routeID);
      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }


  RedirectToPurchaseDetail(event : any) {
    this.router.navigate([`/purchase/details/${event.PurchaseID}`]);
  }
  calculatePayment() {
    this.calculateSupplierPayments(this.EnteredBalance);
  }
  calculateSupplierPayments(totalAmountAdded: number) {
    this.AllSupplierOpenInvoices = [];
    this.supplierSales = [];
    if ((totalAmountAdded >= 0) || (totalAmountAdded <= 0)) {

      // this.SupplierOpenInvoicesList.forEach(val => this.AllSupplierOpenInvoices.push(Object.assign({}, val)));
      this.SupplierOpenInvoicesList.forEach(val => {
        this.AllSupplierOpenInvoices.push(val);
      });

      let totalpurchaseamount = Number(totalAmountAdded);
      // tslint:disable-next-line: max-line-length
      const allNegativeAmounts = this.AllSupplierOpenInvoices.filter((x : any) => x.dRemainingAmount < 0).reduce((sum: any, current : any) => sum + current.dRemainingAmount, 0) * -1;
      totalpurchaseamount += allNegativeAmounts;

      // for positive values
      this.AllSupplierOpenInvoices.filter((x : any) => x.dRemainingAmount > 0).forEach((item : any) => {
        if (totalpurchaseamount === 0) { item.purchaseAmount = 0; }
        else if (totalpurchaseamount > 0) {
          const checkAmount = (totalpurchaseamount - item.dRemainingAmount);
          if (checkAmount >= 0) {
            totalpurchaseamount = checkAmount;
            item.purchaseAmount = item.dRemainingAmount;
          }
          else {
            item.purchaseAmount = totalpurchaseamount;
            totalpurchaseamount = 0;
          }
        }
        this.supplierSales.push(item);
      });

      let allPositiveAmounts = this.supplierSales.filter((x : any) => x.purchaseAmount > 0).reduce((sum: any, current : any) =>
        sum + current.purchaseAmount, 0);
      allPositiveAmounts -= totalAmountAdded;
      let placeZeros = false;

      // for negative values
      this.AllSupplierOpenInvoices.filter((x : any) => x.dRemainingAmount < 0).forEach(item => {
        if (!placeZeros) {
          if (allPositiveAmounts === 0) { item.purchaseAmount = 0; }
          else if (allPositiveAmounts > 0) {
            const checkAmount = (allPositiveAmounts + item.dRemainingAmount);
            if (checkAmount >= 0) {
              allPositiveAmounts = checkAmount;
              item.purchaseAmount = item.dRemainingAmount;
            }
            else {
              item.purchaseAmount = allPositiveAmounts * -1;
              placeZeros = true;
            }
          }
        }
        this.supplierSales.push(item);
      });

      if (this.supplierSales.length > 0) {
        this.SupplierOpenInvoicesList = this.supplierSales;
      }
      else {
        this.toastService.showInfoToast('Info', 'All Payments are Clear');
        return;
      }

      this.SupplierOpenInvoicesList = this.supplierSales;

    }
    else {
      // this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Invalid Amount Added');
      this.toastService.showErrorToast('Error', 'Invalid Amount Added');
      return;
    }
  }
  onChangeFieldAmount(event: any, rowindex : any) {
    let totalAmount = 0;
    let payments;
    const paymentsList: any[] = [];

    this.SupplierOpenInvoicesList.forEach(item => {
      payments = { purchaseAmount: item.purchaseAmount };
      paymentsList.push(Number(payments));
    });
    totalAmount = this.SupplierOpenInvoicesList.reduce((sum: number, current : any) => sum + Number(current.purchaseAmount), 0);
    this.EnteredBalance = totalAmount;
    this.txtAmount = totalAmount;
    return;
    this.calculateSupplierPaymentsByField(paymentsList);

  }
  calculateSupplierPaymentsByField(paymentsList: any[]) {
    const supplierPayments = paymentsList;
    this.supplierSales = [];
    this.supplierSales = this.SupplierOpenInvoicesList;
    let count = 0;
    this.supplierSales.filter((x : any) => x.dRemainingAmount > 0).forEach((item : any) => {
      while (supplierPayments[count].purchaseAmount < 0) {
        count++;
      }
      if (item.dRemainingAmount >= supplierPayments[count].purchaseAmount) {
        item.purchaseAmount = supplierPayments[count].purchaseAmount;
      } else {
        item.purchaseAmount = item.dRemainingAmount;
      }
      count++;
    });
    count = 0;
    this.supplierSales.filter((x : any) => x.dRemainingAmount < 0).forEach((item : any) => {
      while (supplierPayments[count].purchaseAmount > 0) {
        count++;
      }

      if (item.dRemainingAmount >= supplierPayments[count].purchaseAmount) {
        item.purchaseAmount = supplierPayments[count].purchaseAmount;
      } else {
        item.purchaseAmount = item.dRemainingAmount;
      }

      count++;
    });

    this.SupplierOpenInvoicesList = this.supplierSales;
  }

}

