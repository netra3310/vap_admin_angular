import { Component, HostBinding, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from "@angular/common";
import { LayoutService } from 'src/app/modules/shell';
import {
  GenericMenuItems,
  RowGroup,
} from "src/app/shared/model/genric-menu-items.model";
import { ReportPermissionEnum } from "src/app/shared/constant/report-permission";
import { FilterRequestModel } from "src/app/Helper/models/FilterRequestModel";
import { vaplongapi } from "src/app/Service/vaplongapi.service";
import { untilDestroyed } from "src/app/shared/services/until-destroy";
import { Columns } from "src/app/shared/model/columns.model";
import { TableColumnEnum } from "src/app/shared/Enum/table-column.enum";
import { RowGroupTypeEnum } from "src/app/shared/Enum/row-group-type.enum ";

export type NotificationsTabsType =
  | 'success'
  | 'failed';

  @Component({
    selector: 'app-mixed-widget-notifications',
    templateUrl: './mixed-widget-notifications.component.html',
    styleUrls: ['./mixed-widget-notifications.component.scss'],
    providers: [DatePipe],
  })
export class MixedWidgetNotificationsComponent implements OnInit {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  @Output() newOpenCart = new EventEmitter();

  activeTabId: NotificationsTabsType = 'success';

  latestCartLogID: number = 0;

  ReportPermission = ReportPermissionEnum;
  filterRequestModel: FilterRequestModel;
  isLoading: boolean = false;
  genericMenuItems: GenericMenuItems[] = [
    {
      label: "RePost",
      icon: "fas fa-undo",
      dependedProperty: "ID",
      permission: ReportPermissionEnum.OpencartReposting,
      permissionDisplayProperty: "showPostable",
    },
  ];
  rowGroup: RowGroup = {
    property: "CreatedAt",
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE,
  };
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
  allLogs: any = [];
  totalRecords = 0;
  globalFilterFields = ["ActionName", "ActionID", "Status", "CreatedAt"];
  rowsPerPageOptions = [10, 20, 50, 100];

  constructor(
    private datepipe: DatePipe,
    private apiService: vaplongapi,
    private cdr: ChangeDetectorRef
  ) {
    this.FilterRequestModelInilizationFunction()
    // this.GetAllDataWithFunction(this.filterRequestModel)
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
      150000,
      0,
      true,
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

  ngOnInit(): void {}

  setActiveTabId(tabId: NotificationsTabsType) {
    this.activeTabId = tabId;
  }

  setTotalCounts(event : any) {
    this.totalRecords = event;
    this.cdr.detectChanges()
  } 

  ngOnchange(changes : any) {
    if(changes.groupedByDate) {
      alert('a');
      this.cdr.detectChanges();
    }
  }

  GetAllDataWithLazyLoadinFunction(filterRM : any) {
    this.isLoading = true;
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
          // this.allLogs = response1.OpenCartLogModelList.filter(
          //   (x : any) => x.showPostable == true
          // );
          this.allLogs = response1.OpenCartLogModelList;
          if(this.allLogs[0].ID > this.latestCartLogID) {
            this.newOpenCart.emit(true);
          }
          this.totalRecords = response1.TotalCount;
          this.isLoading = false;
          this.cdr.detectChanges();
        } else {
          console.log("internal server error ! not getting api data");
        }
      });
  }
  getDetailsPage(event : any) {
    //this is not implemented bacause the relative funtion is not implemented yet.
    alert("this is not implemented bacause the relative funtion is not implemented yet.")
  }

  
  GetAllDataWithFunction(filterRM : any) {
    this.isLoading = true;
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
          this.allLogs = response1.OpenCartLogModelList;
          this.isLoading = false;
          this.cdr.detectChanges();
        } else {
          console.log("internal server error ! not getting api data");
        }
      });
  }
  
  ngOnDestroy(): void {}

}