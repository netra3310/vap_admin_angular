import { Component, OnInit, ChangeDetectorRef, Output, ViewChild, EventEmitter } from '@angular/core';
import { FilterRequestModel } from "src/app/Helper/models/FilterRequestModel";
import { vaplongapi } from "src/app/Service/vaplongapi.service";
import { untilDestroyed } from "src/app/shared/services/until-destroy";
import { DatePipe } from "@angular/common";
import { datefilter } from "src/app/Helper/datefilter";
import { PermissionService } from "src/app/shared/services/permission.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { ToastService } from '../../shell/services/toast.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: 'app-sale-stats',
  templateUrl: './sale-stats.component.html',
  styleUrls: ['./sale-stats.component.scss'],
  providers: [DatePipe],
})
export class SaleStatsComponent implements OnInit {
  
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

   @Output() selectEvent = new EventEmitter();
   SearchByDateDropdown: any[];

  constructor(
    private apiService: vaplongapi,
    private datepipe: DatePipe,
    private permission: PermissionService,
    private storageService: StorageService,
    private toastService : ToastService,
    private cdr: ChangeDetectorRef
    ) {
      // this.usermodel = this.storageService.getItem("UserModel");
      this.lineFromDate = new Date();
      this.lineToDate = new Date();
    }

  ngOnInit() {
    
    // if (
    //   this.permission.getPermissionAccess(this.ShellPermission.ShowDashboard)
    // ) {
    //   this.showDashboard = true;
    // } else {
    //   this.showDashboard = false;
    // }
    
    this.GetSearchByDateDropDownList();
    
    this.getSaleStats(0);
    
    this.currentYear = new Date().getFullYear();
    if (1) {
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
      // this.GetTodayHeadQuarterDashBoardStatsCount();
      this.GetAnnualDashboardStatsForSale();
      this.GetAnnualDashboardStatsForPurchase();
      this.GetTopProductBySaleForDashboard();
      this.GetTopProductByPurchaseForDashboard();
    }
  }
  ngOnDestroy(): void {}
  tab: 'sale' | 'purchase' = 'sale';
  yearList: any = [];
  currentYear: number = new Date().getFullYear();
  lineFromDate: Date;
  lineToDate: Date;
  fromDate = this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss");
  toDate = this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss");
  isAnnualLoading : boolean = false;
  isTopProductsLoading : boolean = false;
  filterRequestModel: FilterRequestModel;
  filterRequestModel1: FilterRequestModel;
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
  isCustomDate = false;
  dateId = 0;
  emitAction(event : any) {
    if (event.forLabel === "RePost") {
      this.RepostingOpenCart(event.selectedRowData);
    }
  }
  IsSpinner = false;
  
  selectedSearchByDateID : any = "";
  selectedSearchByDateIdPie : any = "";
  statsSalesIncTax = 0;
  statsSalesExTax = 0;
  statsSalesTax = 0;
  statsRefunds = 0;
  statsRefundCogs = 0;
  statsRefundTax = 0;
  statsCogs = 0;
  statsGrossProfit = 0;
  isLoadingData : boolean = true;
  
  GetSearchByDateDropDownList() {
    this.SearchByDateDropdown = [];

    this.SearchByDateDropdown.push({ value: "0", label: "Today" });
    this.SearchByDateDropdown.push({ value: "1", label: "Yesterday" });
    this.SearchByDateDropdown.push({ value: "2", label: "Last7Days" });
    this.SearchByDateDropdown.push({ value: "3", label: "Last30Days" });
    this.SearchByDateDropdown.push({ value: "4", label: "ThisMonth" });
    this.SearchByDateDropdown.push({ value: "5", label: "LastMonth" });
    // this.SearchByDateDropdown.push({ value: '6', label: 'All' });
    this.SearchByDateDropdown.push({ value: "7", label: "Custom" });
    this.selectedSearchByDateID = "0";
    this.selectedSearchByDateIdPie = "0";
  }
  
  async openDatePickerModal() {
    return await this.datepickerModalComponent.open();
  }
  
  SearchByDate(event: any) {
    if (event == "7") {
      this.isCustomDate = true;
      this.openDatePickerModal();
    } else {
      this.getSaleStats(this.selectedSearchByDateID);
    }
  }
  getSaleStats(dateId : any) {
    this.IsSpinner = true;
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(
      this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss") ?? ""
    );
    filterRequestModel.ToDate = new Date(
      this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss") ?? ""
    );
    // filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = 0;
    filterRequestModel.PageSize = 10000;
    filterRequestModel.IsGetAll = false;

    dateId = Number(dateId);
    if (dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(dateId);
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date(
        this.datepipe.transform(daterequest.ToDate, "yyyy-MM-ddTHH:mm:ss") ?? ""
      );
      filterRequestModel.FromDate = new Date(
        this.datepipe.transform(daterequest.FromDate, "yyyy-MM-ddTHH:mm:ss") ?? ""
      );
    } else {
      filterRequestModel.IsGetAll = false;
      filterRequestModel.ToDate = new Date(
        this.datepipe.transform(this.toDate, "yyyy-MM-ddTHH:mm:ss") ?? ""
      );
      filterRequestModel.FromDate = new Date(
        this.datepipe.transform(this.fromDate, "yyyy-MM-ddTHH:mm:ss") ?? ""
      );
    }
    const singleproductprice = 0;
    this.isLoadingData = true;
    this.apiService
      .GetSaleDashboardReportByFilters(filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.isLoadingData = false;
        if (response.ResponseCode === 0) {
          this.statsGrossProfit = response.GrossProfit;
          this.statsSalesIncTax = response.TotalSaleIncludedTax;
          this.statsSalesExTax = response.TotalSaleExcludedTax;
          this.statsSalesTax = response.TotalTax_Sale;
          this.statsCogs = response.COGS;
          this.statsRefundCogs = response.COGS_Refund;
          this.statsRefunds = response.TotalRefunds;
          this.statsRefundTax = response.TotalTax_Refund;
          this.IsSpinner = false;
          this.cdr.detectChanges();
        } else {
          this.IsSpinner = false;
          // this.notificationService.notify(
          //   NotificationEnum.ERROR,
          //   "error",
          //   "Internal Server Error! not getting api data"
          // );
          // console.log('internal server error ! not getting api data');
          this.toastService.showErrorToast("Error", "Internal Server Error! not getting api data");
        }
      });
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
  selectValue(newValue: any) {
    // this.isCustomDate = false;
    // this.fromDate = newValue.fromDate;
    // this.toDate = newValue.toDate;

    // this.dateId = 7;
    // this.datepickerModalComponent.close();
    // this.GetTopProductBySaleForDashboard();
    // this.GetTopProductByPurchaseForDashboard();
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.getSaleStats(7);
    this.datepickerModalComponent.close();
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
          this.cdr.detectChanges();
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
          this.cdr.detectChanges();
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
          response.TopProducts.forEach((element : any) => {
            topPurchaseProducts.push(element.Product);
            topPurchaseQuantity.push(element.Quantity);
            topPurchaseImages.push(element.Image)
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
          };
          
          this.isTopProductsLoading = false;
          this.cdr.detectChanges();
        }
      });
  }
  changeyear(event : any) {
    if (event) {
      this.currentYear = event;
      this.GetAnnualDashboardStatsForSale();
      this.GetAnnualDashboardStatsForPurchase();
      this.cdr.detectChanges();
    }
  }
  onChangeDate(event: any) {
    if (event == 7) {
      this.isCustomDate = true;
      this.openDateProductPickerModal();
    } else {
      // this.getAllSaleList(this.selectedSearchByDateID);
      this.dateId = Number(event);
      this.GetTopProductBySaleForDashboard();
      this.GetTopProductByPurchaseForDashboard();
      this.cdr.detectChanges();
    }
  }
  selectValueProduct(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;

    this.dateId = 7;
    this.datepickerProductModalComponent.close();
    this.GetTopProductBySaleForDashboard();
    this.GetTopProductByPurchaseForDashboard();
  }
  async openDateProductPickerModal() {
    return await this.datepickerProductModalComponent.open();
  }
}
