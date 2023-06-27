import { Component, ViewChild, Output, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe } from "@angular/common";
import { forkJoin } from 'rxjs';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';
import { datefilter } from "src/app/Helper/datefilter";
// import { TranslateService } from '@ngx-translate/core';
import { FilterRequestModel } from "src/app/Helper/models/FilterRequestModel";
import { vaplongapi } from "src/app/Service/vaplongapi.service";
import { CustomerPermissionEnum } from "src/app/shared/constant/customer-permission";
import { ExtrasPermissionEnum } from "src/app/shared/constant/extras-permission";
import { PurchasePermissionEnum } from "src/app/shared/constant/purchase-permission";
import { SalesPermissionEnum } from "src/app/shared/constant/sales-permission";
import { ShellPermissionEnum } from "src/app/shared/constant/shell-permission";

import { RowGroupTypeEnum } from "src/app/shared/Enum/row-group-type.enum ";
import { TableColumnEnum } from "src/app/shared/Enum/table-column.enum";
import { Columns } from "src/app/shared/model/columns.model";
import {
  GenericMenuItems,
  RowGroup,
} from "src/app/shared/model/genric-menu-items.model";
import { PermissionService } from "src/app/shared/services/permission.service";
import { StorageService } from "src/app/shared/services/storage.service";
// import { EventProvider } from 'src/app/shared/services/event-provider.service';
import { untilDestroyed } from "src/app/shared/services/until-destroy";
// import { NotificationService } from "../../services/notification.service";

import * as ApexCharts from 'apexcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe],
})
export class DashboardComponent {
  @Output() selectEvent = new EventEmitter();

  dateModalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };

  @ViewChild('datepicker') private datepickerModalComponent: ModalComponent;

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    modalContent: 'Modal content',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  
  tab: 'sale' | 'purchase' = 'sale';

  salesPermission = SalesPermissionEnum;
  filterRequestModel: FilterRequestModel;
  PurchasePermission = PurchasePermissionEnum;
  SalesPermission = SalesPermissionEnum;
  ExtrasPermission = ExtrasPermissionEnum;
  CustomerPermissionEnum = CustomerPermissionEnum;
  ShellPermission = ShellPermissionEnum;
  allLogs: any = [];
  // SalesPermission = SalesPermissionEnum;
  TodayExpenses: any;
  TodayProfit: any;
  TodayPurchases: any;
  TodaySales: any;
  TotalCustomerBalance: any;
  TotalSupplierBalance: any;
  TotalVaplongOrder: any;
  TotalOnlineOrder: any;
  TotalOnlineOrderAmount: any;
  TotalVaplongOrderAmount: any;
  TotalExternalIncomingOrders: any;
  lineSaleChartdata: any = {
    datasets: [],
    labels: [],
  };
  linePurchaseChartdata: any = {
    datasets: [],
    labels: [],
  };
  pieSaleChartData: any = {
    datasets: [],
    labels: [],
  };
  piePurchaseChartData: any = {
    datasets: [],
    labels: [],
  };
  months: any = [];
  SearchByYearsDropdown: any[] = [];
  lineFromDate: Date;
  lineToDate: Date;
  yearList: any = [];
  currentYear: number = new Date().getFullYear();
  showDashboard = true;
  fromDate = this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss");
  toDate = this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss");
  filterRequestModel1: FilterRequestModel;
  selectedSearchByDateID = "";
  isCustomDate = false;
  dateId = 0;
  usermodel: any;
  totalRecords = 0;
  totalRecordsCount = 0;
  filterModel = {
    PageNo: 0,
    PageSize: 25,
    Product: "",
  };
  isFirstTime = true;
  rowGroup: RowGroup = {
    property: "CreatedAt",
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE,
  };
  // genericMenuItems: GenericMenuItems[] = [
  //   {
  //     label: "RePost",
  //     icon: "fas fa-undo",
  //     dependedProperty: "ID",
  //     permission: ReportPermissionEnum.OpencartReposting,
  //     permissionDisplayProperty: "showPostable",
  //   },
  // ];
  columns: Columns[] = [
    {
      field: "ActionName",
      header: "Action",
      sorting: "ActionName",
      placeholder: "",
      translateCol: "SSGENERIC.ACTION",
    },
    {
      field: "ActionID",
      header: "ActionID",
      sorting: "ActionID",
      placeholder: "",
      type: TableColumnEnum.REDIRECTION_COLUMN,
      translateCol: "SSGENERIC.ACTIONID",
    },
    {
      field: "CreatedAt",
      header: "Date",
      sorting: "CreatedAt",
      placeholder: "",
      type: TableColumnEnum.DATE_FORMAT,
      translateCol: "SSGENERIC.DATE",
    },
    {
      field: "Status",
      header: "Status",
      sorting: "Status",
      placeholder: "",
      translateCol: "SSGENERIC.STATUS",
    },
  ];
  globalFilterFields = ["ActionName", "ActionID", "Status", "CreatedAt"];
  rowsPerPageOptions = [10, 20, 50, 100];

  isTopProductsLoading : boolean = false;
  isAnnualLoading : boolean = false;
  isHeadQuarterLoading: boolean = false;


  @ViewChild('modal') private modalComponent: ModalComponent;
  constructor(
    private apiService: vaplongapi,
    private datepipe: DatePipe,
    private permission: PermissionService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
    ) {
      this.usermodel = this.storageService.getItem("UserModel");
      this.lineFromDate = new Date();
      this.lineToDate = new Date();
    }

  async openModal() {
    return await this.modalComponent.open();
  }

  ngOnDestroy(): void {}
  
  setTab(_tab: 'sale' | 'purchase') {
    if(this.tab == _tab) {
      return;
    }
    this.tab = _tab;
    if (_tab === 'sale') {
      

    }

    if (_tab === 'purchase') {
    
    }

  }

  ngOnInit() {
    
    if (
      this.permission.getPermissionAccess(this.ShellPermission.ShowDashboard)
    ) {
      this.showDashboard = true;
    } else {
      this.showDashboard = false;
    }
    if (this.showDashboard) {
      this.currentYear = new Date().getFullYear();

      for (let index = this.currentYear + 1; index > 2019; index--) {
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
        ""
      );
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
        ""
      );
      // this.GetAllDataWithFunction(this.filterModel);
      this.GetTodayHeadQuarterDashBoardStatsCount();
      this.GetAnnualDashboardStatsForSale();
      this.GetAnnualDashboardStatsForPurchase();
      this.GetTopProductBySaleForDashboard();
      this.GetTopProductByPurchaseForDashboard();
    }
  }

  emitAction(event : any) {
    if (event.forLabel === "RePost") {
      this.RepostingOpenCart(event.selectedRowData);
    }
  }

  RepostingOpenCart(data : any) {
    // this.confirmationService.confirm({
    //   message: "Are you sure, you want to repost on opencart",
    //   icon: "pi pi-exclamation-triangle",
    //   accept: () => {
    //     this.RepostDataToOpenCart(data.ID);
    //   },
    // });
    console.log('RepostingOpenCart function emitted', data);
  }

  onChangeDate(event: any) {
    if (event == 7) {
      this.isCustomDate = true;
      this.openDatePickerModal();
    } else {
      // this.getAllSaleList(this.selectedSearchByDateID);
      this.dateId = Number(event);
      this.GetTopProductBySaleForDashboard();
      this.GetTopProductByPurchaseForDashboard();
      this.cdr.detectChanges();
    }
  }
  
  async openDatePickerModal() {
    return await this.datepickerModalComponent.open();
  }

  changeyear(event : any) {
    if (event) {
      this.currentYear = event;
      this.GetAnnualDashboardStatsForSale();
      this.GetAnnualDashboardStatsForPurchase();
    }
  }
  
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;

    this.dateId = 7;
    this.GetTopProductBySaleForDashboard();
    this.GetTopProductByPurchaseForDashboard();
    this.datepickerModalComponent.close();
  }

  GetAllDataWithFunction(filterRM : any) {
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(
      this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss") ?? ""
    );
    filterRequestModel.ToDate = new Date(
      this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss") ?? ""
    );

    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = 99999;
    filterRequestModel.IsGetAll = true;
    filterRequestModel.UserID = 0;
    filterRequestModel.Type = 0;
    filterRequestModel.PermissionLevel = 2;
    filterRequestModel.Product = "";
    
    this.apiService
      .GetAllOpenCartLogs(filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response1: any) => {
        if (response1.ResponseCode === 0) {
          var logsList = response1.OpenCartLogModelList.filter(
            (x : any) => x.IsFailed == true && x.IsPosted == true
          );
          let repostedRequest = 0;

          if (logsList.length > 0) {
            repostedRequest = logsList.length;
          }
          this.totalRecordsCount = response1.TotalCount - repostedRequest;
          this.cdr.detectChanges();
        } else {
          console.log("internal server error ! not getting api data");
        }
      });
  }

  GetTodayHeadQuarterDashBoardStatsCount() {
    this.isHeadQuarterLoading = true;
    this.apiService
      .GetTodayHeadQuarterDashBoardStatsCount(this.filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          this.TodayExpenses = response.TodayExpenses;
          this.TodayProfit = response.TodayProfit;
          this.TodayPurchases = response.TodayPurchases;
          this.TodaySales = response.TodaySales;
          this.TotalCustomerBalance = response.TotalCustomerBalance;
          this.TotalSupplierBalance = response.TotalSupplierBalance;
          this.TotalOnlineOrder = response.TotalOnlineOrder;
          this.TotalVaplongOrder = response.TotalVaplongOrder;
          this.TotalOnlineOrderAmount = response.TotalOnlineOrderAmount;
          this.TotalVaplongOrderAmount = response.TotalVaplongOrderAmount;
          this.TotalExternalIncomingOrders = response.TotalExternalIncomingOrders;
          this.isHeadQuarterLoading = false;
          
          this.cdr.detectChanges();
        }
      });
  }

  GetAnnualDashboardStatsForSale() {
    this.isAnnualLoading = true;
    // .setFullYear(this.currentYear, 0, 1)
    const FromDate = new Date(this.currentYear, 0, 1, 0, 0, 0);
    const TODate = new Date(this.currentYear, 11, 31, 23, 59, 59);
    this.filterRequestModel.FromDate = FromDate;
    this.filterRequestModel.ToDate = TODate;

    this.apiService
      .GetAnnualDashboardStatsForSale(this.filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          const months: any = [];
          const TotalOnlineOrders: any = [];
          const TotalRefunds: any = [];
          const TotalVaplongOrders: any = [];
          response.Stats.forEach((element : any, i : any) => {
            if (i !== 0) {
              months.push(element.Month);
              TotalOnlineOrders.push(element.TotalOnlineOrders);
              TotalRefunds.push(element.TotalRefunds);
              TotalVaplongOrders.push(element.TotalVaplongOrders);
            }
          });
          this.lineSaleChartdata = {
            labels: months,
            datasets: [
              {
                label: "Total Online Orders",
                data: TotalOnlineOrders,
                fill: false,
                borderColor: "#4bc0c0",
              },
              {
                label: "Total Refunds",
                data: TotalRefunds,
                fill: false,
                borderColor: "#FFCE56",
              },
              {
                label: "Total System Orders",
                data: TotalVaplongOrders,
                fill: false,
                borderColor: "#ff0018",
              },
            ],
          };
          this.isAnnualLoading = false;
          console.log("isAnnualLoading is", this.isAnnualLoading);
          if(this.tab == 'sale') {
            this.cdr.detectChanges();
          }
        }
      });
  }

  GetAnnualDashboardStatsForPurchase() {
    this.isAnnualLoading = true;
    const FromDate = new Date(Date.UTC(this.currentYear, 0, 1, 0, 0, 0));
    const TODate = new Date(Date.UTC(this.currentYear, 11, 31, 23, 59, 59));
    this.filterRequestModel.FromDate = FromDate;
    this.filterRequestModel.ToDate = TODate;

    this.apiService
      .GetAnnualDashboardStatsForPurchase(this.filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          const months: any = [];
          // const TotalOnlineOrders: any = [];
          const TotalPurchaseRefundsOrders: any = [];
          const TotalPurchaseOrders: any = [];
          response.Stats.forEach((element : any, i : any) => {
            // if (i !== 0) {
            months.push(element.Month);
            // TotalOnlineOrders.push(element.TotalOnlineOrders);
            TotalPurchaseRefundsOrders.push(element.TotalPurchaseRefundsOrders);
            TotalPurchaseOrders.push(element.TotalPurchaseOrders);
            // }
          });
          this.linePurchaseChartdata = {
            labels: months,
            datasets: [
              // {
              //   label: 'Total Online Orders',
              //   data: TotalOnlineOrders,
              //   fill: false,
              //   borderColor: '#4bc0c0'
              // },
              {
                label: "Total Purchase Refunds Orders",
                data: TotalPurchaseRefundsOrders,
                fill: false,
                borderColor: "#FFCE56",
              },
              {
                label: "Total Purchase Orders",
                data: TotalPurchaseOrders,
                fill: false,
                borderColor: "#ff0018",
              },
            ],
          };
          this.isAnnualLoading = false;
          if(this.tab == 'purchase') {
            this.cdr.detectChanges();
          }
        }
      });
  }

  GetTopProductBySaleForDashboard() {
    this.isTopProductsLoading = true;
    if (this.dateId !== 7) {

      const daterequest : FilterRequestModel = datefilter.GetDateRangeByDropdown(this.dateId);
      this.filterRequestModel1.IsGetAll = daterequest.IsGetAll;
      this.filterRequestModel1.ToDate = new Date(
        this.datepipe.transform(daterequest.ToDate, "yyyy-MM-ddTHH:mm:ss") ?? ""
      );
      this.filterRequestModel1.FromDate = new Date(
        this.datepipe.transform(daterequest.FromDate, "yyyy-MM-ddTHH:mm:ss") ?? ""
      );
    } else {
      this.filterRequestModel1.IsGetAll = false;
      this.filterRequestModel1.ToDate = new Date(
        this.datepipe.transform(this.toDate, "yyyy-MM-ddTHH:mm:ss") ?? ""
      );
      this.filterRequestModel1.FromDate = new Date(
        this.datepipe.transform(this.fromDate, "yyyy-MM-ddTHH:mm:ss") ?? ""
      );
    }
    this.apiService
      .GetTopProductBySaleForDashboard(this.filterRequestModel1)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          const topSaleProducts: any = [];
          const topSaleQuantity: any = [];
          const topSaleImages: any = [];
          const topSalePrice: any = [];
          response.TopProducts.forEach((element : any) => {
            topSaleProducts.push(element.Product);
            topSaleQuantity.push(element.Quantity);
            topSaleImages.push(element.Image);
            topSalePrice.push(element.SalePrice);
          });
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
          
          this.cdr.detectChanges();
        }
        this.isTopProductsLoading = false;
      });
  }

  GetTopProductByPurchaseForDashboard() {
    
    this.isTopProductsLoading = true;
    // this.filterRequestModel.FromDate = new Date(new Date().setMonth(new Date().getMonth() - 11));
    this.apiService
      .GetTopProductByPurchaseForDashboard(this.filterRequestModel1)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          const topPurchaseProducts: any = [];
          const topPurchaseQuantity: any = [];
          const topPurchaseImages: any = [];
          const topPurchasePrice: any = [];
          response.TopProducts.forEach((element : any) => {
            topPurchaseProducts.push(element.Product);
            topPurchaseQuantity.push(element.Quantity);
            topPurchaseImages.push(element.Image);
            topPurchasePrice.push(element.PurchasePrice);
          });
          this.piePurchaseChartData = {
            labels: topPurchaseProducts,
            datasets: [
              {
                data: topPurchaseQuantity,
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
            images: topPurchaseImages,
            prices: topPurchasePrice
          };
          
          this.isTopProductsLoading = false;
          this.cdr.detectChanges();
        }
      });
  }
  RepostDataToOpenCart(id : any) {
    const param = {
      ID: id,
      RequestedUserID: this.usermodel.ID,
    };
    this.apiService
      .PostFailsRequestAgain(param)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          alert('success');
          this.cdr.detectChanges();
        } else {
          alert('error');
          console.log("internal server error ! not getting api data");
        }
      });
  }

  GetAllDataWithLazyLoadinFunction(filterRM : any) {
    //if (this.isFirstTime) { return; }

    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(
      this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss") ?? ""
    );
    filterRequestModel.ToDate = new Date(
      this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss") ?? ""
    );
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = true;
    filterRequestModel.UserID = 0;
    filterRequestModel.Type = 0;
    filterRequestModel.PermissionLevel = 2;
    filterRequestModel.Product = filterRM.Product;

    // if (this.dateId !== 7) {
    //   const daterequest = datefilter.GetDateRangeByDropdown(this.dateId);
    //   filterRequestModel.IsGetAll = daterequest.IsGetAll;
    //   filterRequestModel.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss'));
    //   filterRequestModel.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss'));
    // }
    // else {
    //   filterRequestModel.IsGetAll = false;
    //   filterRequestModel.ToDate = new Date(this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss'));
    //   filterRequestModel.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss'));
    // }
    this.apiService
      .GetAllOpenCartLogs(filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response1: any) => {
        if (response1.ResponseCode === 0) {
          response1.OpenCartLogModelList.forEach((element : any) => {
            element.showPostable =
              element.IsPosted == false && element.IsFailed == true
                ? true
                : false;
          });
          this.allLogs = response1.OpenCartLogModelList.filter(
            (x : any) => x.showPostable == true
          );
          this.totalRecords = response1.TotalCount;
          this.cdr.detectChanges();
        } else {
          console.log("internal server error ! not getting api data");
        }
      });
  }
}
