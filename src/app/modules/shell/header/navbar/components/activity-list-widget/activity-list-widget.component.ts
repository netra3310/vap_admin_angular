import { Component, OnDestroy, OnInit, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { datefilter } from 'src/app/Helper/datefilter';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { concat } from 'rxjs';

@Component({
  selector: 'app-activity-list-widget',
  templateUrl: './activity-list-widget.component.html',
  styleUrls: ['./activity-list-widget.component.scss'],
  providers: [DatePipe]
})
export class ActivityListWidgetComponent implements OnInit {
  @Input() isNewActivity : any;
  @Output() newActivity = new EventEmitter(); 
  constructor(
    private apiService: vaplongapi,
    private datepipe: DatePipe, 
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Activity Report`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then((x: any) => { });
    this.FilterRequestModelInilizationFunction();
  }
  allActivity: any = [];
  filterModel = {
    PageNo: 0,
    PageSize: 25,
    Product: '',
  };
  usermodel: any;
  dateId: number = 3;
  selectedID: any;
  fromDate: any = new Date();
  toDate: any = new Date();
  totalRecords: any = 0;
  filterRequestModel: FilterRequestModel;
  groupedByDate : any = [];
  currentTime: any  ;
  latestActivityTime: string = "0";


  ngOnInit(): void {
    
    this.GetAllDataWithLazyLoadinFunction(this.filterModel);
    
    // setInterval(() => {
    //   this.GetAllDataWithLazyLoadinFunction(this.filterModel);
    //   this.cdr.checkNoChanges();
    //   this.cdr.detectChanges();
    // }, 30000)
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
  
  GetAllDataWithLazyLoadinFunction(filterRM : any) {
    // this.stockRequestModel.Search = filterRM.Product;
    const Type = 1;
    // let filterRequestModel = new FilterRequestModel();
    // let filterRequestModel = new FilterRequestModel(
    //   -1, -1, -1, -1, -1, -1, -1, -1, new Date(), new Date(), 150000, 0, true, true,
    //   -1, -1, -1, false, false, false, '', '', false, false, -1, -1, false, false, '', ''
    // );
    const filterRequestModel = new FilterRequestModel();
    // this.datepipe.transform(this.toDate, "yyyy-MM-ddTHH:mm:ss") ?? ""
    filterRequestModel.FromDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.ToDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.IsReceived = true;
    filterRequestModel.Product = filterRM.Product;
    filterRequestModel.UserID = this.selectedID ? this.selectedID.value : 0;
    
    if (this.dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(this.dateId);
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date((this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
      filterRequestModel.FromDate = new Date((this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    }
    else {
      filterRequestModel.IsGetAll = false;
      filterRequestModel.ToDate = new Date((this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
      filterRequestModel.FromDate = new Date((this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    }
    this.apiService.GetAllActivity(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        this.allActivity = response1.GetAllActivityLogs;
        if(response1.GetAllActivityLogs[0].PerformedAt > this.latestActivityTime) {
          this.latestActivityTime = response1.GetAllActivityLogs[0].PerformedAt;
          this.newActivity.emit(true);
        }
        this.totalRecords = response1.TotalRecords;
        this.setViewData();
        this.cdr.detectChanges();
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    });
  }
  ngOnDestroy(){

  }

  setViewData() {
    if(this.allActivity.length < 1){
      return;
    }
    type dataType = {
      UserID: number,
      Action: any,
      Description: any,
      User: boolean,
      ID: number,
      PerformedAt: string
    };
    type GroupedByDate = {
      [key: string]: dataType[];
    };
   
    const groupedByDate: GroupedByDate = {};
    
    this.allActivity.forEach((item : any) => {
      if(item.IsPosted) {
        return;
      }
      const dateKey = item.PerformedAt.slice(0, 10);
      if (groupedByDate[dateKey]) {
        item.PerformedAt = this.datepipe.transform(item.PerformedAt, "MMM d, y, h:mm:ss a");
        groupedByDate[dateKey].push(item);
      } else {
        item.PerformedAt = this.datepipe.transform(item.PerformedAt, "MMM d, y, h:mm:ss a");
        groupedByDate[dateKey] = [item];
      }
    });

    this.groupedByDate = groupedByDate;
  }

  ArrayNotifications(arrays : any) {
    return arrays;
  }
}
