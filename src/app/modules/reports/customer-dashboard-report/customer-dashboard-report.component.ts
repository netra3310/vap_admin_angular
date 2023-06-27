import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from "@angular/core";
import { WishlistModel } from "src/app/Helper/models/WishlistModel";
import { vaplongapi } from "src/app/Service/vaplongapi.service";
import { UserModel } from "src/app/Helper/models/UserModel";
import { FilterRequestModel } from "src/app/Helper/models/FilterRequestModel";

import { environment } from "src/environments/environment";
import { Columns } from "src/app/shared/model/columns.model";
import {
  GenericMenuItems,
  RowGroup,
} from "src/app/shared/model/genric-menu-items.model";
import { untilDestroyed } from "src/app/shared/services/until-destroy";
import { TableColumnEnum } from "src/app/shared/Enum/table-column.enum";
import { customSearchFn } from "src/app/shared/constant/product-search";
import { Router } from "@angular/router";
import { StorageService } from "src/app/shared/services/storage.service";
import { RowGroupTypeEnum } from "src/app/shared/Enum/row-group-type.enum ";
import { DatePipe } from "@angular/common";
import { datefilter } from "src/app/Helper/datefilter";
import { PermissionService } from "src/app/shared/services/permission.service";
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: "app-customer-dashboard-report",
  templateUrl: "./customer-dashboard-report.component.html",
  styleUrls: ["./customer-dashboard-report.component.scss"],
  providers: [DatePipe],
})
export class CustomerDashboardReportComponent implements OnInit, OnDestroy {
  
  
  dateModalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };

  @ViewChild('datepicker') private datepickerModalComponent: ModalComponent;

  dateProductModalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };

  @ViewChild('dateproductpicker') private datepickerProductModalComponent: ModalComponent;
  @ViewChild('btn_open_modal_customers') private btn_open_modal_customers: ElementRef;
  AllInternalOrderList: WishlistModel[] = [];
  selectedInternalOrder: WishlistModel;
  public internalOrder: WishlistModel;
  PaginationData: any = [];

  valCheck = "";
  ProductSearch = "";
  selectedProductID = "";
  Products: any[];
  filteredCustomer: any[];
  selectedProduct: any;
  Quantity: any;
  Remarks: any;
  items: any[];
  ProductDropdown: any[];
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 25;
  // last = 25;
  totalRecords = 0;
  openInvoicesTotalRecords = 0;
  TotalRecords = 0;
  filterModel = {
    PageNo: 0,
    PageSize: 25,
    Product: "",
  };
  usermodel: UserModel;
  displayDialog = false;
  DialogRemarks = "";

  customerColumns1: Columns[] = [
    // { field: 'IsActiveForCustomer', header: 'Status', sorting: '', placeholder: '',type: TableColumnEnum.TOGGLE_BUTTON },
    {
      field: "CustomerID",
      header: "ID",
      sorting: "CustomerID",
      placeholder: "",
      translateCol: "SSGENERIC.ID",
    },
    {
      field: "sCompanyName",
      header: "Company",
      sorting: "sCompanyName",
      placeholder: "",
      translateCol: "SSGENERIC.COMPANY",
    },
    {
      field: "FirstName",
      secondfield: "LastName",
      header: "Customer",
      sorting: "FirstName",
      placeholder: "",
      type: TableColumnEnum.COMBINED_COLUMN,
      translateCol: "SSGENERIC.CUSTOMER",
    },
    {
      field: "Address",
      secondfield: "City",
      header: "Address",
      sorting: "FirstName",
      placeholder: "",
      type: TableColumnEnum.COMBINED_COLUMN,
      translateCol: "SSGENERIC.ADDRESS",
    },
    {
      field: "EmailAddress",
      header: "Email",
      sorting: "EmailAddress",
      placeholder: "",
      translateCol: "SSGENERIC.EMAIL",
    },
    {
      field: "CurrentBalance",
      header: "Current Balance",
      sorting: "CurrentBalance",
      placeholder: "",
      type: TableColumnEnum.BALANCE_COLUMN,
      translateCol: "SSGENERIC.CURRENTB",
    },
  ];

  globalFilterFields1 = [
    "sCompanyName",
    "FirstName",
    "LastName",
    "Address",
    "City",
    "CurrentBalance",
  ];

  rowGroup: RowGroup = {
    property: "CreatedAt",
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE,
  };
  customerColumns: Columns[] = [
    {
      field: "CreatedAt",
      header: "Date",
      sorting: "CreatedAt",
      placeholder: "",
      type: TableColumnEnum.DATE_FORMAT,
    },
    {
      field: "Attachment",
      header: "Attachment",
      sorting: "Attachment",
      placeholder: "",
      type: TableColumnEnum.MULTIPLEATTACHMENT,
    },
  ];
  globalFilterFields = ["CreatedAt"];

  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];

  dataFunc: any = customSearchFn;
  ProductData: any = [];
  displayCustomerDialog = false;
  productHistory: any = {};
  Purchases: any = [];
  CustomerAttachment: any = [];
  loadingCustomerAttachment = false;
  customerDropdown: any[];
  AllCustomersList: any[] = [];
  selectedCustomer: { value: any; label: any };
  lifeLineCustomer: any = {};
  orderCount: any;
  bestOrder: any;
  openPayments: any[] = [];
  TopProducts: any[] = [];
  lastOrderOn: any;
  lastPaymentOn: any;
  selectedShippingMethod: any = {};
  isFirstTime = true;
  genericMenuItems: GenericMenuItems[] = [];

  lineSaleChartdata: any = {
    datasets: [],
    labels: [],
  };

  pieSaleChartData: any = {
    datasets: [],
    labels: [],
  };
  dateId = 0;
  filterRequestModel1: FilterRequestModel;
  fromDate = this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss");
  toDate = this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss");
  currentYear: number;
  filterRequestModel: FilterRequestModel;
  yearList: any = [];
  SearchByDateDropdown: any[];
  selectedSearchByDateID = "";
  isCustomDate = false;
  isAnnualLoading = false;
  isTopProductsLoading = false;
  constructor(
    private apiService: vaplongapi,
    public router: Router,
    private datepipe: DatePipe,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {
    this.storageService.setItem("SaleDetailRoute", this.router.url);
    this.usermodel = this.storageService.getItem("UserModel");
    const obj = {
      Action: "View",
      Description: `View Customer Dashboard Report`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID,
    };
    this.apiService
      .SaveActivityLog(obj)
      .toPromise()
      .then((x) => {});
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem("UserModel");
    this.GetCustomersDropDownLists(); // Get All ProductVariant List On Page Load for Dropdown
    this.filterRequestModel1 = new FilterRequestModel(
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
      1000,
      0,
      true,
      true,
      -1,
      -1,
      -1,
      true,
      true,
      true,
      "",
      "",
      true,
      true,
      -1,
      -1,
      true,
      true,
      "",
      "",
      "",
      0
    );
    this.GetSearchByDateDropDownList();
    this.currentYear = new Date().getFullYear();

    for (let index = this.currentYear + 1; index > 1990; index--) {
      this.yearList.push({ year: index });
    }
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
      1000,
      0,
      true,
      true,
      -1,
      -1,
      -1,
      true,
      true,
      true,
      "",
      "",
      true,
      true,
      -1,
      -1,
      true,
      true,
      "",
      "",
      "",
      0
    );
    // this.GetAnnualDashboardStatsForSale();
    // this.GetTopProductBySaleForDashboard();
  }

  GetCustomerDetailHistoryReport() {
    const obj = {
      ID: this.selectedCustomer.value,
    };
    this.IsSpinner = true;
    this.apiService
      .GetCustomerDetailHistoryReportDetailsOnly(obj)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.IsSpinner = false;
        if (response.ResponseCode === 0) {
          this.lifeLineCustomer = response.Customer;
          this.orderCount = response.OrderCount;
          this.bestOrder = response.BestOrder;
          this.lastOrderOn = response.LastOrderOn;
          this.lastPaymentOn = response.LastPaymentOn;
          this.TopProducts = response.TopProducts;
        }
        this.cdr.detectChanges();
      });
  }
  DisplayAttachment(event: any) {
    window.open(`${environment.CUSTOMER_DOCUMENT_PATH}${event}`, "blank");
  }
  GetAllCustomerAttachmentDataWithLazyLoadinFunction(filterRM: any) {
    if (this.isFirstTime) {
      return;
    }
    const filterRequestModel = new FilterRequestModel();
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.ID = this.selectedCustomer.value;
    filterRequestModel.IsGetAll = true;
    filterRequestModel.IsAppRequest = true;
    this.loadingCustomerAttachment = true;
    this.apiService
      .GetCustomerAttachmentsByFilter(filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response1: any) => {
        this.loadingCustomerAttachment = false;
        if (response1.ResponseCode === 0) {
          this.CustomerAttachment = response1.AllTransactionList;
          this.TotalRecords = Number(response1.PreviousBalance);
        } else {
          console.log("internal server error ! not getting api data");
        }
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {}

  GetCustomersDropDownLists() {
    this.customerDropdown = [];
    this.apiService
      .GetAllCustomer()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          for (const item of response.AllCustomerList) {
            this.customerDropdown.push({
              value: item.CustomerID,
              label: item.sCompanyName,
            });
          }
          this.filteredCustomer = this.customerDropdown;
          this.AllCustomersList = response.AllCustomerList;
          this.totalRecords = response.AllCustomerList.length;
        } else {
          console.log("internal serve Error", response);
        }
        this.cdr.detectChanges();
      });
  }

  OpenOrderByDialog() {
    this.displayCustomerDialog = true;
    this.btn_open_modal_customers.nativeElement.click();
  }
  selectValue(newValue: any) {
    if (newValue != null) {
      this.selectedCustomer = {
        value: newValue.value ? newValue.value : newValue.CustomerID,
        label: newValue.label ? newValue.label : newValue.sCompanyName,
      };
      this.GetCustomerDetailHistoryReport();

      this.isFirstTime = false;
      this.GetAllCustomerAttachmentDataWithLazyLoadinFunction(this.filterModel);
      this.GetAnnualDashboardStatsForSale();
      this.GetTopProductBySaleForDashboard();
      if(this.displayCustomerDialog)
        this.btn_open_modal_customers.nativeElement.click();
      this.displayCustomerDialog = false;
    }
  }
  GetSearchByDateDropDownList() {
    this.SearchByDateDropdown = [];
    this.SearchByDateDropdown.push({ value: "0", label: "Today" });
    this.SearchByDateDropdown.push({ value: "1", label: "Yesterday" });
    this.SearchByDateDropdown.push({ value: "2", label: "Last7Days" });
    this.SearchByDateDropdown.push({ value: "3", label: "Last30Days" });
    this.SearchByDateDropdown.push({ value: "4", label: "ThisMonth" });
    this.SearchByDateDropdown.push({ value: "5", label: "LastMonth" });
    this.SearchByDateDropdown.push({ value: "7", label: "Custom" });
    this.selectedSearchByDateID = "0";
  }
  onChangeDate(event: any) {
    if (event.value === "7") {
      this.isCustomDate = true;
    } else {
      // this.getAllSaleList(this.selectedSearchByDateID);
      this.dateId = Number(event);
      this.GetTopProductBySaleForDashboard();
    }
  }
  changeyear(event: any) {
    if (event) {

      this.currentYear = event;
      this.GetAnnualDashboardStatsForSale();
    }
  }
  GetAnnualDashboardStatsForSale() {
    // .setFullYear(this.currentYear, 0, 1)
    const FromDate = new Date(Date.UTC(this.currentYear, 0, 1, 0, 0, 0));
    const TODate = new Date(Date.UTC(this.currentYear, 11, 31, 23, 59, 59));
    this.filterRequestModel.FromDate = FromDate;
    this.filterRequestModel.ToDate = TODate;
    this.filterRequestModel.ID = this.selectedCustomer.value;
    this.isAnnualLoading = true;
    this.apiService
      .GetAnnualCustomerDashboardStatsForSale(this.filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.isAnnualLoading = false;
        if (response.ResponseCode === 0) {
          const months: any = [];
          const TotalOnlineOrders: any = [];
          const TotalRefunds: any = [];
          const TotalVaplongOrders: any = [];
          response.Stats.forEach((element: any, i: any) => {
            // if (i !== 0) {
            months.push(element.Month);
            TotalOnlineOrders.push(element.TotalOnlineOrders);
            TotalRefunds.push(element.TotalRefunds);
            TotalVaplongOrders.push(element.TotalVaplongOrders);
            // }
          });
          this.lineSaleChartdata = {
            labels: months,
            datasets: [
              {
                label: "Total Payment Amount",
                data: TotalOnlineOrders,
                fill: false,
                borderColor: "#4bc0c0",
              },
              // {
              //   label: 'Total Refunds',
              //   data: TotalRefunds,
              //   fill: false,
              //   borderColor: '#FFCE56'
              // },
              {
                label: "Total Orders Amount",
                data: TotalVaplongOrders,
                fill: false,
                borderColor: "#ff0018",
              },
            ],
          };
        }
        this.cdr.detectChanges();
      });
  }
  GetTopProductBySaleForDashboard() {
    if (this.dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(this.dateId);
      this.filterRequestModel1.IsGetAll = daterequest.IsGetAll;
      this.filterRequestModel1.ToDate = new Date(
        this.datepipe.transform(daterequest.ToDate, "yyyy-MM-ddTHH:mm:ss") ?? "" + "Z"
      );
      this.filterRequestModel1.FromDate = new Date(
        this.datepipe.transform(daterequest.FromDate, "yyyy-MM-ddTHH:mm:ss") ?? "" + "Z"
      );
    } else {
      this.filterRequestModel1.IsGetAll = false;
      this.filterRequestModel1.ToDate = new Date(
        this.datepipe.transform(this.toDate, "yyyy-MM-ddTHH:mm:ss") ?? "" + "Z"
      );
      this.filterRequestModel1.FromDate = new Date(
        this.datepipe.transform(this.fromDate, "yyyy-MM-ddTHH:mm:ss") ?? "" + "Z"
      );
    }
    this.filterRequestModel1.ID = this.selectedCustomer.value;
    this.isTopProductsLoading = true;
    this.apiService
      .GetTopProductBySaleForCustomerDashboard(this.filterRequestModel1)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.isTopProductsLoading = false;
        if (response.ResponseCode === 0) {
          const topSaleProducts: any = [];
          const topSaleQuantity: any = [];
          const topSaleImages: any = [];
          const topSalePrice: any = [];
          response.TopProducts.forEach((element: any) => {
            topSaleProducts.push(element.Product);
            topSaleQuantity.push(element.Quantity);
            topSaleImages.push(element.Image);
            topSalePrice.push(element.SalePrice);
          });
          console.log("top sales response are ", response);
          this.pieSaleChartData = {
            labels: topSaleProducts,
            datasets: [
              {
                data: topSaleQuantity,
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#73D6B1",
                  "#7FEBC3",
                  "#06D6A0",
                  "#1B9AAA",
                  "#ff0018",
                  "#F78656",
                  "#AA8C49",
                  "#545454",
                ],
                hoverBackgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#73D6B1",
                  "#7FEBC3",
                  "#06D6A0",
                  "#1B9AAA",
                  "#ff0018",
                  "#F78656",
                  "#AA8C49",
                  "#545454",
                ],
              },
            ],
            images: topSaleImages,
            prices: topSalePrice
          };
        }
        this.cdr.detectChanges();
      });
  }

  async openDatePickerModal() {
    return await this.datepickerModalComponent.open();
  }

  async openDateProductPickerModal() {
    return await this.datepickerProductModalComponent.open();
  }

  selectValueProduct(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;

    this.dateId = 7;
    this.datepickerProductModalComponent.close();
    this.GetTopProductBySaleForDashboard();
  }
}
