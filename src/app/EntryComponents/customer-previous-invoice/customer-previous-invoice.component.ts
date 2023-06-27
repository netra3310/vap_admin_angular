import { Component, OnInit, Input, OnDestroy, ViewChild, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { SaleModel } from 'src/app/Helper/models/SaleModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
// import { SelectItem } from 'primeng/api/primeng-api';
import { DatePipe } from '@angular/common';
import { datefilter } from 'src/app/Helper/datefilter';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { Columns } from 'src/app/shared/model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';

import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';
import { ToastService } from 'src/app/modules/shell/services/toast.service';

@Component({
  selector: 'app-customer-previous-invoice',
  templateUrl: './customer-previous-invoice.component.html',
  styleUrls: ['./customer-previous-invoice.component.scss'],
  providers: [DatePipe]
})
export class CustomerPreviousInvoiceComponent implements OnInit,OnDestroy {
  dateModalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };


  @ViewChild('datepicker') private datepickerModalComponent: ModalComponent;
  AllPreviousInvoiceList: SaleModel[]=[];
  first = 0;
  rows = 10;
  totalRecords: any = 0;
  SearchByDateDropdown: any[];
  selectedSearchByDateID = '';
  isCustomDate = false;
  
  @Input() OrderByID: any;
  
  rowGroup: RowGroup = {
    property: 'SaleDate',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  filterModel = {
    PageNo: 0,
    PageSize: 10,
    Product: '',
  };
  columns: Columns[] = [
    
    {
      field: 'SaleDate', header: 'Date', sorting: 'SaleDate', searching: true, placeholder: '',
      type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DATE'
    },
    {
      field: 'dTotalSaleValue', header: 'Invoice Amount', sorting: 'dTotalSaleValue', searching: true,
      placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.INVOICEAMOUNT'
    },
    {
      field: 'dTotalPaidValue', header: 'Paid Amount', sorting: 'dTotalPaidValue', searching: true,
      placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.PAIDAMOUNT'
    },
    { field: 'Outlet', header: 'Outlet', sorting: 'Outlet', searching: true, placeholder: '', translateCol: 'SSGENERIC.OUTLET' },
   
  ];

  initialColumns : any = ['SaleDate', 'dTotalSaleValue', 'dTotalPaidValue'];

  isLoading : boolean = true;

  globalFilterFields = ['Outlet', , 'dTotalPaidValue', 'dTotalSaleValue','SaleDate'];
  rowsPerPageOptions = [10, 20, 50, 100];
  fromDate: any = new Date();
  toDate: any = new Date();
  dateId: number=6;
  genericMenuItems: GenericMenuItems[] = [];
  notificationService: any;
  constructor(
    private apiService: vaplongapi, 
    private datepipe: DatePipe,
    private toastService: ToastService,
    private cdr : ChangeDetectorRef ) { }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.GetSearchByDateDropDownList();
  }

  ngOnChanges(changes : SimpleChanges) {
    if(changes.OrderByID) {
      if(this.OrderByID === null || this.OrderByID === undefined) {
        return;
      }
      this.GetCustomerPreviousList(this.filterModel);
    }
  }

  GetSearchByDateDropDownList() {

    this.SearchByDateDropdown = [];

    this.SearchByDateDropdown.push({ value: '0', label: 'Today' });
    this.SearchByDateDropdown.push({ value: '1', label: 'Yesterday' });
    this.SearchByDateDropdown.push({ value: '2', label: 'Last7Days' });
    this.SearchByDateDropdown.push({ value: '3', label: 'Last30Days' });
    this.SearchByDateDropdown.push({ value: '4', label: 'ThisMonth' });
    this.SearchByDateDropdown.push({ value: '5', label: 'LastMonth' });
    this.SearchByDateDropdown.push({ value: '6', label: 'All' });
    this.SearchByDateDropdown.push({ value: '7', label: 'Custom' });
    this.selectedSearchByDateID = '6';

  }
  onChangeDate(event: any) {
    if (event == '7') {
      this.isCustomDate = true;
      this.openDatePickerModal();
    }
    else {
      this.dateId = Number(event);
      this.GetCustomerPreviousList(this.filterModel);
    }
  }
  async openDatePickerModal() {
    return await this.datepickerModalComponent.open();
  }

  selectValue(newValue: any) {
    this.dateId = 7;
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    
    this.datepickerModalComponent.close();
    this.GetCustomerPreviousList(this.filterModel);
  }

  GetCustomerPreviousList(filterRM : any) {
    if(this.OrderByID === undefined || this.OrderByID === null) {
      this.isLoading = false;
      return;
    }
    const isGetAll = false;

    const params : any = {
      PageNo: filterRM.PageNo,
      PageSize : filterRM.PageSize,
      CustomerID: this.OrderByID ? this.OrderByID.value : null,
      FromDate: new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z"),
      ToDate: new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z"),
      PermissionLevel: 1,
      IsGetAll: isGetAll,
      Product: filterRM.Product
    };

    if (this.dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(this.dateId);
      params.IsGetAll = daterequest.IsGetAll;
      params.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss') ?? "");
      params.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "");
    }
    else {
      params.IsGetAll = false;
      params.ToDate = new Date(this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss') ?? "");
      params.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "");
    }

    this.isLoading = true;
  
    this.apiService.GetCustomerPreviousInvoicesTotalCount(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.totalRecords = response.TotalRowCount;
        
      }
      else {
        this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
        // this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
        // console.log('internal server error ! not getting api data');
      }
    });
    console.log("params is ", params);
    this.apiService.GetCustomerPreviousInvoices(params).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      {
        this.isLoading = false;
        if (response1.ResponseText === 'Success') {
          this.AllPreviousInvoiceList = response1.AllSaleList;
          //this.totalRecords = response.AllSaleList.length;
          this.cdr.detectChanges();
        }
        else {

          console.log('internal serve Error', response1);
        }

      }
    });

    
  
 
  }




}
