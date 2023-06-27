import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { WishlistModel } from "src/app/Helper/models/WishlistModel";
import { vaplongapi } from "src/app/Service/vaplongapi.service";
import { UserModel } from "src/app/Helper/models/UserModel";
import { FilterRequestModel } from "src/app/Helper/models/FilterRequestModel";

import { Columns } from "src/app/shared/model/columns.model";
import {
  GenericMenuItems,
  RowGroup,
} from "src/app/shared/model/genric-menu-items.model";
import { untilDestroyed } from "src/app/shared/services/until-destroy";
import { TableColumnEnum } from "src/app/shared/Enum/table-column.enum";
import { customSearchFn } from "src/app/shared/constant/product-search";
import { ActivatedRoute, Router } from "@angular/router";
import { StorageService } from "src/app/shared/services/storage.service";
import { RowGroupTypeEnum } from "src/app/shared/Enum/row-group-type.enum ";
import { DatePipe } from "@angular/common";
import { datefilter } from "src/app/Helper/datefilter";
import { environment } from "src/environments/environment";
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: "app-cash-in-out",
  templateUrl: "./cash-in-out.component.html",
  styleUrls: ["./cash-in-out.component.scss"],
  providers: [DatePipe],
})
export class CashInOutComponent implements OnInit, OnDestroy {

  modalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };

  @ViewChild('modal') private modalComponent: ModalComponent;

  dateModalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };

  @ViewChild('datepicker') private datepickerModalComponent: ModalComponent;
    
  modalNarrationConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideDismissButton: () => true
  };

  @ViewChild('modalNarration') private modalNarrationComponent: ModalComponent;
  AllTransactionList: any[] = [];
  AllPaymentInList: any[] = [];
  AllPaymentOutList: any[] = [];

  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 10;
  // last = 25;
  totalRecords = 0;
  outTotalRecords = 0;
  totalPaymentIn = 0;
  totalPaymentOut = 0;
  usermodel: UserModel;
  displayDialog = false;
  DialogRemarks = "";

  inColumns: Columns[] = [
    {
      field: "CreatedAt",
      header: "Date",
      sorting: "CreatedAt",
      placeholder: "",
      type: TableColumnEnum.DATE_FORMAT,
    },
    //{ field: 'Remarks', header: 'Remarks', sorting: 'Remarks', placeholder: '' ,type:TableColumnEnum.REMARKS },
    {
      field: "dDebit",
      header: "Amount",
      sorting: "dDebit",
      placeholder: "",
      type: TableColumnEnum.BALANCE_COLUMN,
    },
    // { field: 'Attachment', header: 'Attachment', sorting: 'Attachment', placeholder: '', type: TableColumnEnum.MULTIPLEATTACHMENT },
    {
      field: "sNarration",
      header: "Narration",
      sorting: "sNarration",
      placeholder: "",
      type: TableColumnEnum.Narration,
    },
  ];
  rowGroup: RowGroup = {
    property: "CreatedAt",
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE,
  };
  outColumns: Columns[] = [
    {
      field: "CreatedAt",
      header: "Date",
      sorting: "CreatedAt",
      placeholder: "",
      type: TableColumnEnum.DATE_FORMAT,
    },
    //{ field: 'Remarks', header: 'Remarks', sorting: 'Remarks', placeholder: '' ,type:TableColumnEnum.REMARKS },
    {
      field: "dCredit",
      header: "Amount",
      sorting: "dCredit",
      placeholder: "",
      type: TableColumnEnum.BALANCE_COLUMN,
    },
    // { field: 'Attachment', header: 'Attachment', sorting: 'Attachment', placeholder: '', type: TableColumnEnum.MULTIPLEATTACHMENT },
    {
      field: "sNarration",
      header: "Narration",
      sorting: "sNarration",
      placeholder: "",
      type: TableColumnEnum.Narration,
    },
  ];

  GlobalFilterFields =
    ['CreatedAt','Remarks','dCredit','Attachment','sNarration','dDebit'];

  rowsPerPageOptions = [10, 20, 50, 100];
  genericMenuItems: GenericMenuItems[] = [];

  dataFunc: any = customSearchFn;
  isFirstTime = true;

  fromDate: any = new Date();
  toDate: any = new Date();

  SearchByDateDropdown: any[];
  selectedSearchByDateID = "";
  dateId: number;
  isCustomDate = false;
  filterRequestModel: FilterRequestModel;
  displayNarrationDialog = false;
  DialogNarration = "";

  constructor(
    private apiService: vaplongapi,
    private activatedRoute: ActivatedRoute,
    private datepipe: DatePipe,
    public route: Router,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {
    this.storageService.setItem("PurchaseDetailRoute", this.route.url);
    this.storageService.setItem("SaleDetailRoute", this.route.url);
    this.usermodel = this.storageService.getItem("UserModel");
    const obj = {
      Action: "View",
      Description: `View Cash In & Out Report`,
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
    this.GetSearchByDateDropDownList();
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
    this.GetAllCashInOutFunction(this.dateId);
  }
  emitAction(event: any) {}
  GetSearchByDateDropDownList() {
    this.SearchByDateDropdown = [];

    this.SearchByDateDropdown.push({ value: 0, label: "Today" });
    this.SearchByDateDropdown.push({ value: 1, label: "Yesterday" });
    this.SearchByDateDropdown.push({ value: 2, label: "Last7Days" });
    this.SearchByDateDropdown.push({ value: 3, label: "Last30Days" });
    this.SearchByDateDropdown.push({ value: 4, label: "ThisMonth" });
    this.SearchByDateDropdown.push({ value: 5, label: "LastMonth" });
    //this.SearchByDateDropdown.push({ value: 6, label: 'All' });
    this.SearchByDateDropdown.push({ value: 7, label: "Custom" });
    this.dateId = 0;
  }
  SearchByDate(event: any) {
    if (event === 7) {
      this.isCustomDate = true;
      this.openDatePickerModal();
    } else {
      this.dateId = Number(this.dateId);
      this.GetAllCashInOutFunction(this.dateId);
    }
  }

  Close() {
    this.route.navigate(["/dashboard"]);
  }

  ngOnDestroy(): void {}

  showDialog(event: any) {
    this.displayDialog = true;
    this.openModal();
    this.DialogRemarks = event.Remarks;
  }
  showNarrationDialog(event: any) {
    this.displayNarrationDialog = true;
    this.openModalNarration();
    this.DialogNarration = event.sNarration;
  }

  GetAllCashInOutFunction(dateId: any) {
    // if (this.isFirstTime) { return; }

    if (dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(Number(dateId));
      this.filterRequestModel.IsGetAll = daterequest.IsGetAll;
      this.filterRequestModel.ToDate = new Date(
        this.datepipe.transform(daterequest.ToDate, "yyyy-MM-ddTHH:mm:ss") ?? "" + "Z"
      );
      this.filterRequestModel.FromDate = new Date(
        this.datepipe.transform(daterequest.FromDate, "yyyy-MM-ddTHH:mm:ss") ?? "" + "Z"
      );
    } else {
      this.filterRequestModel.IsGetAll = false;
      this.filterRequestModel.ToDate = new Date(
        this.datepipe.transform(this.toDate, "yyyy-MM-ddTHH:mm:ss") ?? "" + "Z"
      );
      this.filterRequestModel.FromDate = new Date(
        this.datepipe.transform(this.fromDate, "yyyy-MM-ddTHH:mm:ss") ?? "" + "Z"
      );
    }
    this.IsSpinner = true;
    this.apiService
      .GetCashInOutByFilter(this.filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response1: any) => {
        this.IsSpinner = false;
        if (response1.ResponseCode === 0) {
          this.AllTransactionList = response1.AllTransactionList;
          this.totalPaymentIn = response1.CurrentBalance;
          this.totalPaymentOut = response1.PreviousBalance;
          this.AllPaymentInList = this.AllTransactionList.filter(
            (x) => x.dDebit != 0
          );
          this.AllPaymentOutList = this.AllTransactionList.filter(
            (x) => x.dCredit != 0
          );

          this.totalRecords = this.AllPaymentInList.length;
          this.outTotalRecords = this.AllPaymentOutList.length;
        } else {
          console.log("internal server error ! not getting api data");
        }
        this.cdr.detectChanges();
      });
  }
  DisplayAttachment(event: any) {
    window.open(`${environment.CUSTOMER_DOCUMENT_PATH}${event}`, "blank");
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.datepickerModalComponent.close();
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    // console.log(this.fromDate);
    this.GetAllCashInOutFunction(this.dateId);
  }
  
  async openModal() {
    return await this.modalComponent.open();
  }

  async openDatePickerModal() {
    return await this.datepickerModalComponent.open();
  }

  async openModalNarration() {
    return await this.modalNarrationComponent.open();
  }

}
