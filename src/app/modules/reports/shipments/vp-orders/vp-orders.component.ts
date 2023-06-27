import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
// //import { Table } from "primeng/table";
// import {
//   LazyLoadEvent,
//   MenuItem,
//   SelectItem,
//   ConfirmationService,
// } from "primeng/api";
/* import { BreadcrumbService } from '../../../../app.breadcrumb.service'; */
import { vaplongapi } from "src/app/Service/vaplongapi.service";
import { datefilter } from "src/app/Helper/datefilter";
import { FilterRequestModel } from "src/app/Helper/models/FilterRequestModel";
import { DatePipe } from "@angular/common";

import { Columns } from "src/app/shared/model/columns.model";
import { RowGroupTypeEnum } from "src/app/shared/Enum/row-group-type.enum ";
import {
  GenericMenuItems,
  RowGroup,
} from "src/app/shared/model/genric-menu-items.model";
import { untilDestroyed } from "src/app/shared/services/until-destroy";
// 
import { TableColumnEnum } from "src/app/shared/Enum/table-column.enum";
import { Router } from "@angular/router";
// import { NotificationService } from "src/app/modules/shell/services/notification.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { ConfirmationService } from "src/app/Service/confirmation.service";
import { ToastService } from "src/app/modules/shell/services/toast.service";
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: "app-vp-orders",
  templateUrl: "./vp-orders.component.html",
  // styleUrls: ["./vp-orders.component.scss"],
  providers: [DatePipe, ConfirmationService],
})
export class VpOrdersComponent implements OnInit, OnDestroy {
  
  dateModalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };

  @ViewChild('datepicker') private datepickerModalComponent: ModalComponent;

  AllOrderList: any[] = [];
  printingData: any;
  selectedOrder : any;
  SaleDetails: any;
  customerDetails = {
    Number: "",
    Address: "",
    CurrentBalance: "",
  };
  DeliverToDetails = {
    Number: "",
    Address: "",
  };
  SearchByDateDropdown: any[];
  selectedSearchByDateID = "";
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 10;
  // last = 25;
  dateId = 6;
  totalRecords = 0;
  isCustomDate = false;
  fromDate : any = this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss");
  toDate : any = this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss");
  items: any[];

  genericMenuItems: GenericMenuItems[] = [
    { label: "View Order", icon: "fas fa-info", dependedProperty: "ID" },
    { label: "PDF Invoice", icon: "fas fa-print", dependedProperty: "ID" },
    { label: "Packing Slip", icon: "fas fa-download", dependedProperty: "ID" },
  ];

  rowGroup: RowGroup = {
    property: "CreatedAt",
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE,
  };

  columns: Columns[] = [
    // { field: 'ProductImage', header: 'Product', sorting: '', placeholder: '',type: TableColumnEnum.IMAGE },
    {
      field: "ID",
      header: "Order Nr.",
      sorting: "ID",
      placeholder: "",
      type: TableColumnEnum.REDIRECTION_COLUMN,
    },
    {
      field: "CustomerID",
      header: "Customer ID",
      sorting: "CustomerID",
      placeholder: "",
    },
    {
      field: "Customer",
      header: "Company Name",
      sorting: "Customer",
      placeholder: "",
    },
    {
      field: "dTotalSaleValue",
      header: "Invoice Amount",
      sorting: "dTotalSaleValue",
      placeholder: "",
      type: TableColumnEnum.CURRENCY_SYMBOL,
    },
    {
      field: "CreatedAt",
      header: "Date Added",
      sorting: "CreatedAt",
      placeholder: "",
      type: TableColumnEnum.DATE_FORMAT,
    },
    { field: "Outlet", header: "Outlet", sorting: "Outlet", placeholder: "" },
  ];

  globalFilterFields = [
    "Customer",
    "Outlet",
    "CreatedAt",
    "ID",
    "CustomerID",
    "dTotalSaleValue",
  ];
  rowsPerPageOptions = [10, 20, 50, 100];

  filterModel = {
    PageNo: 0,
    PageSize: 10,
    Product: "",
  };
  filterRequestModel: FilterRequestModel;
  usermodel: any;
  isLoading : boolean = true;
  initPageNo = 0;
  constructor(
    private apiService: vaplongapi,
    private storageService: StorageService,
    private datepipe: DatePipe,
    private router: Router,
    // private toastService: ToastService
    private toastService : ToastService,
    private cdr : ChangeDetectorRef
  ) {
    this.usermodel = this.storageService.getItem("UserModel");
    this.storageService.setItem("VPSaleDetailRoute", this.router.url);

    const obj = {
      Action: "View",
      Description: `View VP Orders`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID,
    };
    this.apiService
      .SaveActivityLog(obj)
      .toPromise()
      .then((x) => {});
  }

  ngOnInit(): void {
    this.FilterRequestModelInilizationFunction();

    const initPageNo = this.storageService.getItem('vp_orders_page_no');
    if(initPageNo > 0) {
      this.initPageNo = initPageNo;
      this.filterModel.PageNo = this.initPageNo;
      this.storageService.removeItem('vp_orders_page_no');
    }
    this.GetSearchByDateDropDownList();

    // this.GetAllVPOrderByFilter(this.selectedSearchByDateID);
    this.GetAllSaleDataWithLazyLoadinFunction(this.filterModel);
  }
  ngOnDestroy(): void {}
  emitAction(event : any) {
    if (event.forLabel === "View Order") {
      this.storageService.setItem('vp_orders_page_no', (event.curPageNo - 1));
      this.Details(event.selectedRowData);
    } else if (event.forLabel === "PDF Invoice") {
      this.PrintPDF(event.selectedRowData.ID);
    } else if (event.forLabel === "Packing Slip") {
      this.PrintPackingSlip(event.selectedRowData.ID);
    }
  }
  Details(event : any) {
    this.router.navigate(["/sale/vp-sale-detail/" + event.ID]);
  }
  PrintPDF(id : any) {
    this.PrintingInvoiceFuntion(id);
  }
  PrintPackingSlip(id : any) {
    this.PrintingPackingSlipFuntion(id);
  }
  PrintingPackingSlipFuntion(id : any) {
    const req = { ID: id };
    this.apiService
      .GetPackingSlipByID(req)
      .pipe(untilDestroyed(this))
      .subscribe((response1: any) => {
        if (response1.ResponseCode === 0) {
          const saleDetails : any = [];
          response1.PackingSlip.PackingSlipDetails.forEach((item : any) => {
            const locs = item.Location.split(",");
            if (locs > 1) {
              let i = 0;
              locs.forEach((item1 : any) => {
                if (i === 0) {
                  const row = {
                    ProductVariantID: item.ProductVariantID,
                    ArticalNumber: item.ArticalNumber,
                    BLabel: item.BLabel,
                    ProductName: item.ProductName,
                    Location: item1.trim(),
                    Quantity: item.Quantity,
                    dTotalDiscount: item.dTotalDiscount,
                    dTotalUnitValue: item.dTotalUnitValue,
                    dTotalValue: (
                      item.dTotalValue - item.dTotalDiscount
                    ).toFixed(2),
                  };
                  saleDetails.push(row);
                } else {
                  const row1 = {
                    ProductVariantID: "-",
                    ArticalNumber: "-",
                    BLabel: "-",

                    ProductName: "-",
                    Location: item1.trim(),
                    Quantity: "-",
                    dTotalDiscount: "-",
                    dTotalUnitValue: "-",
                    dTotalValue: "-",
                  };
                  saleDetails.push(row1);
                }
                i++;
              });
            } else {
              const row2 = {
                ProductVariantID: item.ProductVariantID,
                ArticalNumber: item.ArticalNumber,
                BLabel: item.BLabel,

                ProductName: item.ProductName,
                Location: item.Location.trim(),
                Quantity: item.Quantity,
                dTotalDiscount: item.dTotalDiscount,
                dTotalUnitValue: item.dTotalUnitValue,
                dTotalValue: (item.dTotalValue - item.dTotalDiscount).toFixed(
                  2
                ),
              };
              saleDetails.push(row2);
            }
          });

          response1.PackingSlip.PackingSlipDetails = saleDetails;
          this.printingData = response1.PackingSlip;

          this.Print1();
        } else {
          // this.notificationService.notify(
          //   NotificationEnum.ERROR,
          //   "Error",
          //   response1.message
          // );
          this.toastService.showErrorToast('Error', response1.message);
        }
      });
  }
  Print1() {
    setTimeout(() => {
      let printContents;
      let popupWin;

      printContents = document.getElementById(
        "printA4-sale-packing-1"
      )?.innerHTML ?? "";
      popupWin = window.open(
        "",
        "_blank",
        "top=0,left=0,height=100%,width=auto"
      );
      if(popupWin) {
        
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>Report</title>
              <style>
              //........Customized style.......
              .sty{
                'width: 67%;color: #000; float: left;text-align: left; margin: 0;font-size: 12px; font-weight: 600;padding-right: 10px;
              }
              </style>
            </head>
            <body onload='window.print();self.close();'>${printContents}</body>
          </html>`);
        popupWin.document.close(); 
      }
    }, 500);
  }
  PrintingInvoiceFuntion(id : any, isPdf = true) {
    const req = { ID: id };
    this.apiService
      .getSaleById(req)
      .pipe(untilDestroyed(this))
      .subscribe((response1: any) => {
        if (response1.ResponseCode === 0) {
          this.SaleDetails = response1.Sale;
          const saleDetails = [];
          this.SaleDetails.OrderByName = this.SaleDetails.Customer;
          this.customerDetail(this.SaleDetails.CustomerID, true);
          this.customerDetail(this.SaleDetails.DeliveredToID, false);
          // this.SaleDetails.txtSubTotal = response1.Sale.SaleDetails.reduce((sum, current) => sum + current.dTotalValue, 0)
          // this.SaleDetails.txtTotalDiscount = response1.Sale.SaleDetails.reduce((sum, current) => sum + current.dTotalDiscount, 0)
          // this.SaleDetails.txtTotal = (this.SaleDetails.txtSubTotal - this.SaleDetails.txtTotalDiscount +
          // response1.Sale.ShippingCost).toFixed();
          let subtotal = 0;
          let totalDiscount = 0;
          let grandTotal = 0;
          this.SaleDetails.DeliveredToName = this.SaleDetails.DeliveredTo;
          this.SaleDetails.DeliveryAddress = this.SaleDetails.DeliveryAddress;
          // this.DeliverToDetails.Address = this.SaleDetails.DeliveryAddress;
          const shipment = this.SaleDetails.ShippingCost;
          this.SaleDetails.newSaleDetails = [...this.SaleDetails.SaleDetails];
          this.SaleDetails.SaleDetails.forEach((item : any) => {
            subtotal = subtotal + item.dTotalValue;
            totalDiscount = totalDiscount + item.dTotalDiscount;
            item.display = false;
          });
          grandTotal = subtotal - totalDiscount + shipment;
          const restAmount = grandTotal - this.SaleDetails.dTotalPaidValue;
          this.SaleDetails.dDiscountValue = totalDiscount;
          this.SaleDetails.subTotal = subtotal;
          this.SaleDetails.totalDiscount = totalDiscount;
          this.SaleDetails.shipment = shipment;
          this.SaleDetails.grandTotal = grandTotal;
          this.SaleDetails.restAmount = restAmount;

          // response1.PackingSlip.PackingSlipDetails = saleDetails;
          if (isPdf) {
            this.Print();
          }
        } else {
          // this.notificationService.notify(
          //   NotificationEnum.ERROR,
          //   "Error",
          //   response1.message
          // );
          this.toastService.showErrorToast('Error', response1.message);
        }
        this.cdr.detectChanges();
      });
  }

  customerDetail(customerId : any, isCustomer: boolean = true) {
    const id = {
      ID: customerId,
    };
    this.apiService
      .GetCustomerbyID(id)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          if (isCustomer) {
            this.customerDetails.Number = response.CustomerModel.PhoneNo;
            this.customerDetails.Address = response.CustomerModel.Address;
            this.customerDetails.CurrentBalance =
              response.CustomerModel.CurrentBalance;
            this.SaleDetails.OrderByCompany = response.CustomerModel.PhoneNo;
            this.SaleDetails.InvoiceAddress = response.CustomerModel.Address;
          } else {
            this.DeliverToDetails.Number = response.CustomerModel.PhoneNo;
            this.DeliverToDetails.Address = response.CustomerModel.Address;
            this.SaleDetails.DeliveredToCompanyName =
              response.CustomerModel.PhoneNo;
          }
          this.cdr.detectChanges();
        }
      });
  }

  GetSearchByDateDropDownList() {
    this.SearchByDateDropdown = [];

    this.SearchByDateDropdown.push({ value: "0", label: "Today" });
    this.SearchByDateDropdown.push({ value: "1", label: "Yesterday" });
    this.SearchByDateDropdown.push({ value: "2", label: "Last7Days" });
    this.SearchByDateDropdown.push({ value: "3", label: "Last30Days" });
    this.SearchByDateDropdown.push({ value: "4", label: "ThisMonth" });
    this.SearchByDateDropdown.push({ value: "5", label: "LastMonth" });
    this.SearchByDateDropdown.push({ value: "6", label: "All" });
    this.SearchByDateDropdown.push({ value: "7", label: "Custom" });
    this.selectedSearchByDateID = "6";
  }
  SearchByDate(event: any) {
    if (event == "7") {
      this.isCustomDate = true;
      this.openDatePickerModal();
    } else {
      this.dateId = Number(this.selectedSearchByDateID);
      // this.GetAllVPOrderByFilter(this.selectedSearchByDateID);
      this.GetAllSaleDataWithLazyLoadinFunction(this.filterModel);

    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;

    // this.getAllSaleList(7);
    this.dateId = 7;
    this.datepickerModalComponent.close();
    this.GetAllSaleDataWithLazyLoadinFunction(this.filterModel);
    // this.GetAllVPOrderByFilter(7);
  }
  FilterRequestModelInilizationFunction(): void {
    this.filterRequestModel = new FilterRequestModel(
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      new Date(),
      new Date(),
      25,
      0,
      false,
      false,
      -1,
      -1,
      -1,
      false,
      false,
      false,
      "",
      "",
      false,
      false,
      -1,
      -1,
      false,
      false,
      "",
      "",
      "",
      0
    );
  }
  GetAllVPOrderByFilter(dateId : any) {
    const request = new FilterRequestModel();
    request.FromDate = new Date(
      this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss") ?? ""
    );
    request.ToDate = new Date(
      this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss") ?? ""
    );
    (request.PageNo = 0), (request.PageSize = 10000);
    request.IsIncomingOrder = false; // this set false for showing only system orders not online orders

    dateId = Number(dateId);
    if (dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(dateId);
      request.IsGetAll = daterequest.IsGetAll;
      request.ToDate = new Date(
        this.datepipe.transform(daterequest.ToDate, "yyyy-MM-ddTHH:mm:ss") ?? ""
      );
      request.FromDate = new Date(
        this.datepipe.transform(daterequest.FromDate, "yyyy-MM-ddTHH:mm:ss") ?? ""
      );
    } else {
      request.IsGetAll = false;
      request.ToDate = new Date(this.toDate);
      request.FromDate = new Date(this.fromDate);
    }
    this.IsSpinner = true;

    this.apiService
      .GetAllSalesByFilters(request)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          response.AllSaleList.forEach((element : any) => {
            element.SaleDetails.forEach((element1 : any) => {
              element1.OriginalQuantity = element1.Quantity;
              element1.Quantity = element1.Quantity - element1.ReturnedQuantity;
            });
            element.CreatedAtString = element.CreatedAt;
          });
          //response.AllSaleList = response.AllSaleList.filter((x: any) => x.IsOnlineOrder === false);

          this.AllOrderList = response.AllSaleList;
          this.totalRecords = response.AllSaleList.length;
          this.IsSpinner = false;
        } else {
          this.IsSpinner = false;
          // this.notificationService.notify(
          //   NotificationEnum.ERROR,
          //   "error",
          //   "Internal Server Error! not getting api data"
          // );
          this.toastService.showErrorToast("error", "Internal Server Error! not getting api data");
        }
      });
  }

  GetAllSaleDataWithLazyLoadinFunction(filterRM : any) {
    // this.stockRequestModel.Search = filterRM.Product;
    const Type = 1;

    this.filterRequestModel.FromDate = new Date(
      this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss") ?? ""
    );
    this.filterRequestModel.ToDate = new Date(
      this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss") ?? ""
    );
    this.filterRequestModel.SubCategoryID = 0;
    this.filterRequestModel.PageNo = filterRM.PageNo;
    this.filterRequestModel.PageSize = filterRM.PageSize;
    this.filterRequestModel.IsGetAll = false;
    this.filterRequestModel.IsReceived = true;
    this.filterRequestModel.IsIncomingOrder = false; // this set false for showing only system orders not online orders
    this.filterRequestModel.Product = filterRM.Product;
    if (this.dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(this.dateId);
      this.filterRequestModel.IsGetAll = daterequest.IsGetAll;
      this.filterRequestModel.ToDate = new Date(
        this.datepipe.transform(daterequest.ToDate, "yyyy-MM-ddTHH:mm:ss") ?? ""
      );
      this.filterRequestModel.FromDate = new Date(
        this.datepipe.transform(daterequest.FromDate, "yyyy-MM-ddTHH:mm:ss") ?? ""
      );
    } else {
      this.filterRequestModel.IsGetAll = false;
      this.filterRequestModel.ToDate = new Date(this.toDate);
      this.filterRequestModel.FromDate = new Date(this.fromDate);
    }

    this.apiService
      .GetAllSalesByFiltersTotalCount(this.filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          this.totalRecords = response.TotalRowCount;
          this.cdr.detectChanges();

        } else {
          // this.notificationService.notify(
          //   NotificationEnum.ERROR,
          //   "error",
          //   "Internal Server Error! not getting api data"
          // );
          this.toastService.showErrorToast("Error", "Internal Server Error! not getting api data");
        }
      });
    this.isLoading = true;
    this.apiService
      .GetAllSalesByFilters(this.filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response1: any) => {
        this.isLoading = false;

        if (response1.ResponseCode === 0) {
          response1.AllSaleList.forEach((element : any) => {
            element.showUpdate =
              element.dTotalPaidValue > 0 || element.ReturnedTyped === 2
                ? false
                : true;
            element.showRefund = element.ReturnedTyped === 1 ? false : true;
          });
          //this.AllOrderList = response1.AllSaleList.filter((x: any) => x.IsOnlineOrder === false);
          this.AllOrderList = response1.AllSaleList;
          this.cdr.detectChanges();
        } else {
          // this.notificationService.notify(
          //   NotificationEnum.ERROR,
          //   "error",
          //   "Internal Server Error! not getting api data"
          // );
          this.toastService.showErrorToast('Error', "Internal Server Error! not getting api data");
        }
      });
  }

  Print() {
    setTimeout(() => {
      let printContents;
      let popupWin;

      printContents = document.getElementById("printA4-sale-preview-1")?.innerHTML ?? "";
      popupWin = window.open(
        "",
        "_blank",
        "top=0,left=0,height=100%,width=auto"
      );
      if(popupWin){
          popupWin.document.open();
          popupWin.document.write(`
            <html>
              <head>
                <title>Report</title>
                <style>
                //........Customized style.......
                .sty{
                  'width: 67%;color: #000; float: left;text-align: left; margin: 0;font-size: 12px; font-weight: 600;padding-right: 10px;
                }
                </style>
              </head>
              <body onload='window.print();self.close();'>${printContents}</body>
            </html>`);
          popupWin.document.close();
        }
    }, 500);
  }
    
  async openDatePickerModal() {
    return await this.datepickerModalComponent.open();
  }
}
